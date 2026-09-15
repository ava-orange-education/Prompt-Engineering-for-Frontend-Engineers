# Prompting Best Practices — Before/After Demonstrations

Standalone demonstrations of the prompting patterns from Chapter 10: context-setting,
specificity vs. vagueness, and prompting for debugging, code review, and documentation.
Each pattern shows a vague "before" prompt next to the specific/well-scoped "after" prompt,
with a note on why the second gets better results.

Where the book gives an explicit before/after pair, both prompts below are quoted directly
from the manuscript. Where the book gives only a single well-formed prompt (context-setting,
debugging, code review, documentation), the "before" is a constructed contrast — a realistic
vague version of the same ask — included here to make the pattern concrete, not a quotation
from the book.

---

## 1. Specificity over Vagueness

This is the one pattern in the chapter presented as an explicit before/after pair.

**Before (vague):**

> Create a nice card component for displaying products.

**After (specific):**

> Create a ProductCard component with these specifications:
> Layout: white card, rounded-xl, p-4, shadow-sm hover:shadow-md transition
> Image: 16:9 aspect ratio, rounded-lg, object-cover, skeleton while loading
> Content below image:
>   - Product name: text-sm font-semibold text-gray-900, truncate
>   - Price: text-lg font-bold text-indigo-600
>   - Rating: 5 stars (filled/unfilled), text-sm text-gray-500, (n reviews)
>   - Add to Cart button: full width, mt-3, primary style
> Props: { id, name, price, imageUrl, rating, reviewCount, inStock }
> When inStock is false, show 'Out of Stock' badge and disable the button.
> Include aria-label on the card region combining the product name.
> Write a Vitest unit test covering: renders name/price, out-of-stock state,
>   aria-label, and button disabled state.

**Why the second works better:** "Nice card component" leaves every visual and behavioral
decision to the model — spacing, color, what happens out of stock, whether it's accessible,
whether it's tested — so two runs of the same vague prompt can produce two incompatible
components. The specific version pins down layout values, prop shape, an edge case
(`inStock`), an accessibility requirement, and a test obligation, so the output is
reproducible and matches what the rest of the codebase expects on the first pass instead of
after several rounds of follow-up corrections.

---

## 2. Context-Setting Prompts

**Before (vague):**

> Build me a form component.

**After (specific — quoted from the book):**

> You are a senior React developer on the [PROJECT NAME] team.
> Technology stack:
>   - React 19, TypeScript strict mode
>   - Vite for bundling, Vitest for tests
>   - Tailwind CSS v4, no CSS Modules or styled-components
>   - React Hook Form + Zod for all forms
>   - TanStack Query for data fetching
> Code conventions:
>   - Named exports only (no default exports except pages)
>   - Functional components only, no class components
>   - Props interfaces named [ComponentName]Props
>   - Custom hooks in src/hooks/, prefixed with 'use'
>   - Absolute imports via @/ alias
> Quality standards I always expect:
>   - Accessibility: ARIA labels where the visible label is insufficient, keyboard
>     navigation
>   - Types: no 'any', use 'unknown' when necessary
>   - Tests: unit test every non-trivial component and hook
>   - Error states: every async operation has an error state
> I will now give you tasks. Apply these conventions unless I explicitly
> override them.

**Why the second works better:** Without context, the model has to guess the stack, the
export style, the validation library, and the quality bar — and it will guess wrong for any
project with opinions. Setting this once, up front, means every task prompt that follows
can stay short: "build me a form component" now inherits React Hook Form + Zod, named
exports, a `FormComponentProps` interface, and a required test file, without repeating any
of that per request.

---

## 3. Prompting for Debugging

**Before (vague):**

> This isn't working, can you fix it?
> [PASTE CODE]

**After (specific — quoted from the book):**

> I am getting this error in my React application:
> [PASTE FULL ERROR MESSAGE AND STACK TRACE]
> The error occurs when: [describe the user action or code path]
> Here is the relevant code:
> [PASTE COMPONENT / HOOK / FUNCTION]
> What I expected: [describe expected behavior]
> What actually happened: [describe actual behavior]
> Please:
> 1. List the likely root causes, ranked by probability, and how to verify each
> 2. Explain why the error occurs
> 3. Provide a minimal test that reproduces the issue, then a minimal fix
> 4. Suggest whether a more structural change is advisable

**Why the second works better:** "This isn't working" gives the model no error text, no
repro steps, and no definition of "working," so it either asks clarifying questions or
guesses at a fix for a bug it can't actually see. The structured version supplies the stack
trace, the triggering action, expected vs. actual behavior, and asks for root causes ranked
by probability plus a reproducing test — which turns debugging into verification (does the
fix make the test pass?) instead of a guess the developer has to manually check.

---

## 4. Prompting for Code Review

**Before (vague):**

> Can you review this code?
> [PASTE COMPONENT CODE]

**After (specific — quoted from the book):**

> Review the following React component for:
> 1. Correctness: any logic errors, edge cases, or runtime failure risks
> 2. Performance: unnecessary re-renders, memoization only where profiling shows it's
>    needed, large bundle impact
> 3. Accessibility: ARIA attributes, keyboard navigation, color contrast concerns
> 4. Security: XSS risks, unsafe HTML rendering, exposed sensitive data
> 5. Testability: is this structured in a way that is easy to unit test?
> For each issue found, specify:
>   - Severity (critical / warning / suggestion)
>   - Location (line number or code snippet)
>   - Explanation of the problem
>   - Recommended fix, plus a test or verification step to confirm it
> If you find no issues in a category, say so explicitly.
> [PASTE COMPONENT CODE]

**Why the second works better:** "Can you review this code?" typically returns a handful of
whatever issues are most visually obvious — usually style nits — and silently skips
categories like accessibility or security that require deliberately looking for them. Naming
the five review dimensions up front, and requiring severity plus a location plus a
verification step per issue, forces even the "no issues found" categories to be stated
explicitly, so the reviewer isn't left wondering whether accessibility was checked and passed
or just never checked.

---

## 5. Prompting for Documentation

**Before (vague):**

> Write docs for this component.
> [PASTE COMPONENT CODE]

**After (specific — quoted from the book):**

> Generate the following documentation for the [ComponentName] component:
> 1. JSDoc comment for the component function, documenting:
>    - What the component does
>    - Each prop (type, required/optional, description, default value if any)
>    - Any side effects
>    - Usage example in JSX
> 2. A Storybook story file (current CSF format) with:
>    - Default story showing the component in its most common configuration
>    - A story for each significant variant or state
>    - Manual argtype descriptions only where the auto-inferred types need
>      additional explanation
> [PASTE COMPONENT CODE]

**Why the second works better:** "Write docs" doesn't say what form the docs should take, so
the model might return a markdown summary, a JSDoc block, or a README section — none of which
may be what the project actually needs wired into its tooling. Specifying JSDoc (with the
exact fields to cover) plus a Storybook file in the current CSF format, with one story per
variant, means the output drops directly into the existing documentation and Storybook setup
instead of needing to be reformatted by hand afterward.
