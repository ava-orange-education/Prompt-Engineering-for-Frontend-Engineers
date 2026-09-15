Generate a FormConfig JSON for an Employee Onboarding Form.

Business context:
  HR uses this form to collect information from new employees on their first day.
  The form should feel professional and be completable in about 10 minutes.

Requirements:
  - Three sections: Personal Details, Employment Information, Emergency Contact
  - Personal Details (2 columns): first name, last name, email, phone,
    date of birth, gender (radio)
  - Employment Information (1 column): job title, department (select, 6
    departments), start date, employment type (radio: Full-time, Part-time,
    Contractor), salary expectation (number, optional), remote work (checkbox)
  - Emergency Contact (2 columns): contact name, relationship (select),
    emergency phone, email (optional)
  - All personally identifying fields must be required
  - Email fields must use email validation
  - Phone fields must enforce E.164 format via regex
  - The salary field should only be visible when employment type != Contractor
  - submitLabel: 'Submit Onboarding Form'
  - successMessage: 'Welcome to the team! Your information has been submitted.'

Reason through the visibleWhen dependency for salary step by step,
then output the complete JSON.
Briefly explain your department options and the phone regex.
