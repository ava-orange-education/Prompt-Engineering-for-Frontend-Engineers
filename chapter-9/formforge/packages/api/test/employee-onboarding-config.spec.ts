import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { FormConfig } from '@formforge/types';

const config = JSON.parse(
  readFileSync(join(__dirname, '../../../configs/employee-onboarding.json'), 'utf-8'),
) as FormConfig;

const allFields = config.sections.flatMap((s) => s.fields);

describe('employee-onboarding.json', () => {
  it('has exactly 4 sections with correct IDs', () => {
    expect(config.sections.map((s) => s.id)).toEqual([
      'personal',
      'employment',
      'emergency',
      'itSetup',
    ]);
  });

  it('every field has a unique name within the form', () => {
    const names = allFields.map((f) => f.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('all option-type fields have at least 2 options', () => {
    const optionTypes = new Set(['select', 'multiselect', 'radio', 'checkbox-group']);
    const optionFields = allFields.filter((f) => optionTypes.has(f.type));
    expect(optionFields.length).toBeGreaterThan(0);
    for (const field of optionFields) {
      expect(field.options?.length ?? 0).toBeGreaterThanOrEqual(2);
    }
  });

  it('marks all expected required fields as required', () => {
    const expectedRequired = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'dateOfBirth',
      'gender',
      'jobTitle',
      'department',
      'startDate',
      'employmentType',
      'emergencyContactName',
      'emergencyRelationship',
      'emergencyPhone',
      'slackDisplayName',
    ];
    for (const name of expectedRequired) {
      const field = allFields.find((f) => f.name === name);
      expect(field, `expected field "${name}" to exist`).toBeDefined();
      expect(field!.validation?.required, `expected "${name}" to be required`).toBe(true);
    }
  });

  it('phone regex passes valid E.164 and rejects invalid numbers', () => {
    const pattern = allFields.find((f) => f.name === 'phone')!.validation!.pattern!;
    const re = new RegExp(pattern);
    expect(re.test('+14155552671')).toBe(true);
    expect(re.test('+447911123456')).toBe(true);
    expect(re.test('07911123456')).toBe(false); // no + prefix
    expect(re.test('+0123456789')).toBe(false); // leading zero after +
  });

  it('salary field uses the neq operator for visibility', () => {
    const field = allFields.find((f) => f.name === 'salaryExpectation')!;
    expect(field.visibleWhen?.operator).toBe('neq');
    expect(field.visibleWhen?.dependsOn).toBe('employmentType');
    expect(field.visibleWhen?.value).toBe('contractor');
  });

  it('contractEndDate uses the eq operator for visibility', () => {
    const field = allFields.find((f) => f.name === 'contractEndDate')!;
    expect(field.visibleWhen?.operator).toBe('eq');
    expect(field.visibleWhen?.dependsOn).toBe('employmentType');
    expect(field.visibleWhen?.value).toBe('contractor');
  });
});
