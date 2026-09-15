# Tree of Thought — The 24 Game (abbreviated)

```
Tree of Thought — The 24 Game (abbreviated)

[USER]    Numbers: 4, 9, 10, 13.
          Use +, -, ×, ÷ to make 24.
          Think through multiple solution paths before committing.

[MODEL]   Let me explore several approaches:

          Branch A: Start with 13 - 9 = 4. Now I have {4, 4, 10}.
            A1: 4 × 4 = 16. Now {16, 10}. 16 + 10 = 26. 
            A2: 4 + 4 = 8. Now {8, 10}. 8 × 10 = 80. 
            A3: 10 - 4 = 6. Now {6, 4}. 6 × 4 = 24. 

          Solution: (10 - 4) × (13 - 9) = 24
                    10 - 4 = 6; 13 - 9 = 4; 6 × 4 = 24.

          Verify: (10 - 4) × (13 - 9) = 6 × 4 = 24.
```
