---
Source:
  - https://youtube.com/watch?v=hWEZsyF3ZZc
Reviewed: false
---
![[Screen Shot 2022-10-24 at 3.56.08 AM.png]]
Constructing a truth table for compound propositions. We do this to find equivalencies between different compound propositions.

Compound proposition truth table walk-thru
- Rows
	- Need a row for every possible combination of values for the compound propositions.
		- Number of rows would be 2^n number of pr
- Columns
	- Need a column for each propositional variable
	- Need a column for the truth value of each expression that occurs in the compound proposition as it is built up
	- Need a column for the compound proposition (usually at far right)
- Order of Operations 

| Precedence | Operator   |
| ---------- | ---------- |
| 1          | $\lnot$    |
| 2          | $\land$    |
| 3          | $\lnot$    |
| 4          | $\implies$ |
| 5          | $\iff$     |

![[Screen Shot 2022-10-24 at 4.01.47 AM.png]]

Compound proposition truth table walk-thru

Construct a truth table for p$\lor$q $\implies$ $\lnot$ r

1. First, construct columns for each proposition; p,q,r (these may be referred to as atomic propositions)
| p   | q   | r   |
| --- | --- | --- |
2^3 = 8

2. Next, create a colmun for each compound proposition; p$\lor$ q,  $\lnot$ r

| p   | q   | r   | p $\lor$ q | $\lnot$ r |
| --- | --- | --- | --------- | --------- |

3. Lastly, create a column for the final compound proposition

| p   | q   | r   | p $\lor$ q | $\lnot$ r | p$\lor$ q $\implies$ $\lnot$ r |
| --- | --- | --- | ---------- | --------- | ------------------------------  |


![[Screen Shot 2022-10-24 at 4.08.15 AM.png]]

Compound Proposition Truth Table Walk-Thru

4. Now create as many rows as necessary for all possible combinations of expressions that occur in your compound proposition. Because we have 3 propositions, we need $2^3$ = 8 rows.

3 columns for propositions
Middle column for parts of proposition
Right-hand side just shows the results

| p   | q   | r   | p $\lor$ q | $\lnot$ r | p$\lor$ q $\implies$ $\lnot$ r |
| --- | --- | --- | ---------- | --------- | ------------------------------ |
|    |     |     |            |           |                                |
|    |     |     |            |           |                                |
|    |     |     |            |           |                                |
|    |     |     |            |           |                                |
|    |     |     |            |           |                                |
|    |     |     |            |           |                                |
|   |     |     |            |           |                                |
|     |     |     |            |           |                                |

![[Screen Shot 2022-10-24 at 4.11.28 AM.png]]

Compound Proposition Truth Table Walk-Thru

5. Fill in the truth table for your propositions first. Now complete the table. Try it on your own first!


| p   | q   | r   | p $\lor$ q | $\lnot$ r | p$\lor$ q $\implies$ $\lnot$ r |
| --- | --- | --- | ---------- | --------- | ------------------------------ |
| T   | T   | T   |    T        |     F      |  F                              |
| T   | T   | F   |     T       |      T     |   T                             |
| T   | F   | T   |      T      |       F    |    F                            |
| T   | F   | F   |       T     |        T   |     T                           |
| F   | T   | T   |        T    |         F  |      F                          |
| F   | T   | F   |         T   |          T |       T                         |
| F   | F   | T   |          F  |           F|        T                        |
| F   | F   | F    |          F  |           T|        T                        |

![[Screen Shot 2022-10-24 at 4.14.47 AM.png]]

Compound Proposition Truth Table Walk-Thru

- Here is your final solution

| p   | q   | r   | p $\lor$ q | $\lnot$ r | p$\lor$ q $\implies$ $\lnot$ r |
| --- | --- | --- | ---------- | --------- | ------------------------------ |
| T   | T   | T   |    T        |     F      |  F                              |
| T   | T   | F   |     T       |      T     |   T                             |
| T   | F   | T   |      T      |       F    |    F                            |
| T   | F   | F   |       T     |        T   |     T                           |
| F   | T   | T   |        T    |         F  |      F                          |
| F   | T   | F   |         T   |          T |       T                         |
| F   | F   | T   |          F  |           F|        T                        |
| F   | F   | F    |          F  |           T|        T                        |

![[Screen Shot 2022-10-24 at 4.17.19 AM.png]]

Practice
Create a truth table for (p $\lor$ $\lnot$ q) $\implies$ (p$\land$ q).
If a proposition is being negated, then you need a separate column for that

| p   | q   | $\lnot$ q | p $\lor$ $\lnot$ q | p$\land$ q | (p $\lor$ $\lnot$ q) $\implies$ (p$\land$ q) |
| --- | --- | --------- | ------------------ | ---------- | -------------------------------------------- |
| T   | T   | F         | T                  | T          | T                                            |
| T   | F   | T         | T                  | F          | F                                            |
| F   | T   | F         | F                  | F          | T                                            |
| F   | F   | T         | T                  | F          | F                                             |

