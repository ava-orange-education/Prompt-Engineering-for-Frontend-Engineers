# Contributing

This repo is the companion code for *Prompt Engineering for Frontend Engineers*. It exists to keep the book's examples working as frameworks, tools, and models change — it isn't an open-source project looking for new features or alternative implementations of the exercises.

## Reporting a problem

Please open an [issue](../../issues) for any of the following:

- **Broken code** — an example no longer runs, install fails, or a dependency is deprecated. Include the chapter number, what you expected, what happened (error message/screenshot), and your environment (Node/npm version, OS, browser).
- **Outdated framework or model version** — something in a chapter's `code/` or `prompts/` no longer matches current best practice. Label it `outdated`.
- **Errata in the book text** — an error in the printed/ebook content itself (not the code). Label it `errata` and include the page number and edition/printing if known.

## Pull requests

Small, targeted fixes are welcome — dependency bumps, a corrected typo in a prompt, a broken link. Please open an issue first for anything larger (e.g. reworking a chapter's example) so it can be discussed before you put in the work.

If you do submit a PR:
1. Keep changes scoped to a single `chapter-N/` (or `appendix-X/`) folder.
2. Update that folder's `README.md` if setup steps changed.
3. Describe what changed and why.

We don't accept PRs that add alternative implementations, new exercises, or content not covered in the book.
