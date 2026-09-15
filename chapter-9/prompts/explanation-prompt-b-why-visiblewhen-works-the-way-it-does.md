# Explanation Prompt B — Why visibleWhen Works the Way It Does

```
Explain how the visibleWhen feature works in FormForge:
  - How the isVisible check reads the dependency field's current value out of 
    DynamicForm's state on every render
  - Why re-evaluating visibleWhen on every render is cheap enough here that no 
    memoization is needed
  - What happens to a hidden field's value on submit, and why it matters
  - What the neq operator on the salary field is doing specifically
  - How React 19's React Compiler affects this pattern

Audience: mid-level React developer, new to the project.
```
