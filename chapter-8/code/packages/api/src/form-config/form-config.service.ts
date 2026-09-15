import { Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { readFileSync, readdirSync }      from "fs";
import { join }                           from "path";
import type { FormConfig } from "@formforge/types";
import { parseFormConfig, FormConfigValidationError } from "./formConfigSchema";

const CONFIGS_DIR = join(process.cwd(), "configs");

@Injectable()
export class FormConfigService {
  getConfig(formId: string): FormConfig {
    if (!/^[a-zA-Z0-9_-]+$/.test(formId)) {
      throw new NotFoundException(`Form "${formId}" not found`);
    }
    let raw: string;
    try {
      raw = readFileSync(join(CONFIGS_DIR, `${formId}.json`), "utf-8");
    } catch (err: any) {
      // Only a missing file is a 404 — a permission error or anything else
      // reading the file is a server-side problem, not "form not found".
      if (err?.code === "ENOENT") {
        throw new NotFoundException(`Form config "${formId}" not found.`);
      }
      throw new InternalServerErrorException(`Could not read form config "${formId}".`);
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new InternalServerErrorException(`Form config "${formId}" is not valid JSON.`);
    }
    try {
      return parseFormConfig(parsed, formId);
    } catch (err) {
      if (err instanceof FormConfigValidationError) {
        throw new InternalServerErrorException(err.message);
      }
      throw err;
    }
  }

  listConfigs(): string[] {
    return readdirSync(CONFIGS_DIR).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""));
  }
}
