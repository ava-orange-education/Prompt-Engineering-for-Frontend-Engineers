Add two conditional fields to the Employment Information section:

1. contractEndDate (type: date, label: 'Contract End Date')
   Visible only when employmentType === 'contractor'.
   Required. Insert after employmentType.

2. partTimeHours (type: number, label: 'Weekly Hours',
   placeholder: 'e.g. 20', validation.min: 4, validation.max: 32)
   Visible only when employmentType === 'parttime'.
   Required. Message: 'Please enter your weekly contracted hours'.
   Insert after contractEndDate.

Output a single JSON array containing both field objects, not two separate objects.
