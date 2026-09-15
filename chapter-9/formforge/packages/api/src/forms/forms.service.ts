import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { FormConfig, FormSummary } from '@formforge/types';

// packages/api/{src,dist}/forms sits four directories below the repo root
// in both the ts-node dev run and the compiled dist build, so this walk-up
// resolves to the same configs/ regardless of which one is running or what
// the process's cwd happens to be (npm workspace scripts cwd into the
// package, not the repo root).
const CONFIGS_DIR = join(__dirname, '..', '..', '..', '..', 'configs');

@Injectable()
export class FormsService {
  listForms(): FormSummary[] {
    return this.configFilenames().map((formId) => {
      const config = this.readConfig(formId);
      return { formId: config.formId, title: config.title, description: config.description };
    });
  }

  getForm(formId: string): FormConfig {
    return this.readConfig(formId);
  }

  private configFilenames(): string[] {
    return readdirSync(CONFIGS_DIR)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''));
  }

  private readConfig(formId: string): FormConfig {
    let raw: string;
    try {
      raw = readFileSync(join(CONFIGS_DIR, `${formId}.json`), 'utf-8');
    } catch (err: any) {
      if (err?.code === 'ENOENT') {
        throw new NotFoundException({ message: `Form "${formId}" not found` });
      }
      throw new InternalServerErrorException(`Could not read form config "${formId}".`);
    }
    try {
      return JSON.parse(raw) as FormConfig;
    } catch {
      throw new InternalServerErrorException(`Form config "${formId}" is not valid JSON.`);
    }
  }
}
