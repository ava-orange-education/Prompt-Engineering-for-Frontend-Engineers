# Production Prompt Template

```
Production Prompt Template

[SYSTEM]
Role:        You are [PERSONA with attributes].
Goal:        Your goal is [TASK OBJECTIVE].
Constraints: [LIST OF EXPLICIT CONSTRAINTS].
Format:      [OUTPUT FORMAT SPECIFICATION].
Tone:        [TONE/REGISTER].

[EXAMPLE]   (if few-shot needed; repeat as [EXAMPLE 1], [EXAMPLE 2]... for multiple)
Input:  ...
Output: ...

Reasoning Instruction (if CoT needed):
For complex questions, think step by step before responding.

[USER]
{ACTUAL USER QUERY}
```
