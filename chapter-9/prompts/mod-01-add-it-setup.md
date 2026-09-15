Add a fourth section to the employee onboarding config called 'IT Setup'.
It should come after 'Emergency Contact' and collect:
  - Preferred OS (radio: macOS, Windows, Linux)
  - Equipment (checkbox-group: Laptop, External Monitor, Keyboard, Mouse, Desk)
  - GitHub username (text, optional, pattern: ^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}
    [a-zA-Z0-9])?$, message: 'Enter a valid GitHub username')
  - Slack display name (text, required, maxLength 80)
  - Accessibility needs (textarea, optional, maxLength 500,
    helpText: 'Confidential. Used only to set up your workspace correctly.')

Output ONLY the new section JSON object, not the entire config.
