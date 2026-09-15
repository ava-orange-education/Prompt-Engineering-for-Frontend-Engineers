# Without CoT versus With CoT — A Reasoning Task

```
Without CoT versus With CoT — A Reasoning Task

WITHOUT CoT:

[USER]    A store sells apples for $0.50 each and oranges for $0.75  
          Each. Alice buys 4 apples and 3 oranges. How much does she 
          spend in total?

[MODEL]   $4.25

WITH CoT:

[USER]    A store sells apples for $0.50 each and oranges for $0.75 
          Each. Alice buys 4 apples and 3 oranges. How much does she 
          spend in total?
                    Think step by step.

[MODEL]   Step 1: Calculate the cost of the apples.
                  4 apples × $0.50/apple = $2.00
          Step 2: Calculate the cost of the oranges.
                  3 oranges × $0.75/orange = $2.25
          Step 3: Add the two amounts.
                  $2.00 + $2.25 = $4.25
          Alice spends $4.25 in total.
```
