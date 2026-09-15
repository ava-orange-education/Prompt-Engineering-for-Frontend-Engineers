Tighten validation on the following fields:
  1. firstName and lastName: add maxLength 50
  2. jobTitle: add minLength 2 and maxLength 100
  3. slackDisplayName: add minLength 2 (it already has maxLength 80)
  4. githubUsername: add maxLength 39 (GitHub's actual limit)
  5. salaryExpectation: add message:
     'Please enter an annual salary between $10,000 and $1,000,000'

Output only the updated validation object for each field, labeled by name.
