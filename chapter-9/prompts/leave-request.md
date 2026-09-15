Generate a completely new FormConfig for a Leave Request Form.

Business context: employees submit requests for annual, sick, or other leave.
A line manager reviews and approves.

Use formId: 'leave-request', matching the target filename configs/leave-request.json exactly.

Include:
  - Employee details: name and department, shown for context (populate with 
    placeholder text since this data would normally come from the logged-in user's 
    profile), employee ID (hidden)
  - Leave details: leave type (select: Annual, Sick, Parental, Compassionate,
    Unpaid), start date, end date, number of days, reason (textarea, optional for
    Annual/Parental but required for others -- model as required with a helpText
    explaining when it is needed)
  - Documentation: file upload (optional, PDF/image), notes (textarea, optional,
    maxLength 1000)
  - submitLabel: 'Submit Leave Request'

Make the form feel official and professional. Output the complete JSON.
