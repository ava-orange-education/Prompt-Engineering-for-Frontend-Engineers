import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { FormConfig } from '@formforge/types';
import employeeOnboarding from '../../../../configs/employee-onboarding.json';
import { DynamicForm, isFieldVisible, type FormValues, type FormErrors, type FieldValue } from './DynamicForm';
import { allFields, initialValues, validateField } from './FormPage';

const config = employeeOnboarding as FormConfig;

// Mirrors the render + validate loop FormPage runs, without pulling in
// routing or network mocks -- DynamicForm itself is purely presentational,
// so exercising conditional visibility and submit validation means driving
// it through the same state/validation logic FormPage uses.
function Harness() {
  const fields = allFields(config);
  const [values, setValues] = useState<FormValues>(() => initialValues(fields));
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(name: string, value: FieldValue) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    const submitted = fields.filter((f) => f.type === 'hidden' || isFieldVisible(f, values));
    const nextErrors: FormErrors = {};
    for (const field of submitted) {
      const message = validateField(field, values[field.name]);
      if (message) nextErrors[field.name] = message;
    }
    setErrors(nextErrors);
  }

  return (
    <div>
      <DynamicForm config={config} values={values} errors={errors} onChange={handleChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

describe('DynamicForm conditional fields', () => {
  it('shows the salary field by default, before any Employment Type is chosen', () => {
    render(<Harness />);
    expect(screen.getByLabelText('Salary Expectation')).toBeInTheDocument();
  });

  it('keeps the salary field visible when Full-time is selected', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByLabelText('Full-time'));
    expect(screen.getByLabelText('Salary Expectation')).toBeInTheDocument();
  });

  it('hides the salary field when Contractor is selected', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByLabelText('Contractor'));
    expect(screen.queryByLabelText('Salary Expectation')).not.toBeInTheDocument();
  });

  it('shows contractEndDate when Contractor is selected', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.queryByLabelText(/Contract End Date/)).not.toBeInTheDocument();
    await user.click(screen.getByLabelText('Contractor'));
    expect(screen.getByLabelText(/Contract End Date/)).toBeInTheDocument();
  });

  it('shows partTimeHours when Part-time is selected', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.queryByLabelText(/Weekly Hours/)).not.toBeInTheDocument();
    await user.click(screen.getByLabelText('Part-time'));
    expect(screen.getByLabelText(/Weekly Hours/)).toBeInTheDocument();
  });

  it('shows a required error when submitting with Contractor selected and no contractEndDate', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByLabelText('Contractor'));
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Contract End Date is required.')).toBeInTheDocument();
  });
});
