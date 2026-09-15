# configs/

Each `*.json` file in this directory is a complete form: one file, one form. The
API reads these directly from disk on every request — `GET /api/forms` lists
them, `GET /api/forms/:formId` returns one in full, and the filename (minus
`.json`) is the `formId` used in URLs and API routes. There's no database and
no build step for form content — editing a file here changes the live form.

## FormConfig schema

| Field | Type | Required | Notes |
|---|---|---|---|
| `formId` | `string` | yes | Must match the filename exactly. |
| `title` | `string` | yes | Shown as the form's heading. |
| `description` | `string` | no | Shown under the title. |
| `submitLabel` | `string` | no | Submit button text. Defaults to "Submit". |
| `successMessage` | `string` | no | Shown after a successful submission. |
| `sections` | `FormSection[]` | yes | The form is rendered section by section. |

**FormSection**

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | yes | Unique within the form. |
| `title` | `string` | no | Section heading. |
| `description` | `string` | no | Shown under the section heading. |
| `columns` | `1 \| 2 \| 3` | no | Grid columns for this section's fields. Defaults to 1. |
| `fields` | `FormField[]` | yes | See below. |

**FormField**

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | `string` | yes | camelCase, unique across the *entire* form (not just the section). |
| `type` | `FieldType` | yes | See supported types below. |
| `label` | `string` | yes | |
| `placeholder` | `string` | no | |
| `helpText` | `string` | no | Shown under the field. |
| `width` | `'full' \| 'half' \| 'third'` | no | `full` spans the whole section grid; otherwise the field takes one grid cell. |
| `defaultValue` | `string \| number \| boolean \| string[]` | no | Pre-fills the field on first render. |
| `options` | `{ label: string; value: string \| number }[]` | select/radio/etc. only | Needs at least 2 entries. |
| `validation` | `FieldValidation` | no | See below. |
| `visibleWhen` | `VisibleWhen` | no | See "Conditionally visible fields" below. |

## Supported field types

| Type | Renders as |
|---|---|
| `text` | Single-line text input |
| `email` | Email input |
| `password` | Password input (masked) |
| `number` | Number input |
| `tel` | Phone number input |
| `url` | URL input |
| `textarea` | Multi-line text box |
| `select` | Dropdown, single choice |
| `multiselect` | Dropdown, multiple choices |
| `radio` | Radio button group, single choice |
| `checkbox` | A single on/off checkbox |
| `checkbox-group` | Multiple checkboxes, multiple choices |
| `date` | Date picker |
| `datetime` | Date + time picker |
| `time` | Time picker |
| `file` | File upload |
| `slider` | Range slider (uses `validation.min`/`validation.max`) |
| `rating` | Star rating (uses `validation.max` for the number of stars, defaults to 5) |
| `hidden` | Not rendered; submitted as-is (e.g. a record ID) |

## Common validation properties

All optional. Add only the ones a field actually needs.

| Property | Applies to | Meaning |
|---|---|---|
| `required` | any | Field must have a value before submit. |
| `minLength` / `maxLength` | text-like | Character count bounds. |
| `min` / `max` | `number`, `slider`, `rating` | Numeric bounds. |
| `pattern` | text-like | A JavaScript regex *source string* (no slashes) the value must match. |
| `message` | any | Overrides the default error message for every rule on this field. |
| `email` | `email` | Validates email format. |
| `url` | `url` | Validates URL format. |

## How to add a new form

1. Copy the shape of an existing config, e.g. `employee-onboarding.json`.
2. Change `formId` to a short, URL-safe, kebab-case name, and make the
   filename match it exactly (`formId: "leave-request"` → `leave-request.json`).
3. Save the file in this directory. There's nothing else to register — the
   form list and the form page both pick it up automatically.

Ask Claude to do this for you: describe the form in plain English (what
sections, what fields, what's required) and it can generate the whole JSON
file in one pass.

## How to add a field to an existing form

Add a new object to the relevant section's `fields` array with at least
`name`, `type`, and `label`. `name` must be camelCase and not reused anywhere
else in the form. If it's a `select`, `radio`, `multiselect`, or
`checkbox-group`, give it an `options` array with at least two entries.

## How to implement a conditionally visible field

Add a `visibleWhen` object to the field:

```json
"visibleWhen": { "dependsOn": "employmentType", "operator": "eq", "value": "contractor" }
```

- `dependsOn` is the `name` of another field in the *same form*.
- `operator` is one of `eq`, `neq`, `gt`, `lt`, `contains`, `empty`, `notEmpty`.
- `value` is what `dependsOn`'s current value is compared against (ignored
  for `empty`/`notEmpty`).

The field is hidden until the condition is true, and its value is excluded
from the submission while it's hidden — so a required conditional field
only blocks submission when it's actually visible.
