---
aliases:
  - truth tables
---
## Synthesis
- 
## Source [^1]
- A truth table gives all possible inputs and corresponding outputs

| ![[Screenshot 2024-12-10 at 4.12.01 AM.png\|200]] | ![[Screenshot 2024-12-10 at 4.12.14 AM.png\|190]] |
| ------------------------------------------------- | ------------------------------------------------- |
| [[Negation]] Truth Table                          | [[Conjunction]] Truth Table                       |
## Source[^2]

| ![[Screenshot 2024-12-10 at 5.01.39 AM.png\|200]] |
| ------------------------------------------------- |
| [[Disjunction]] Truth Table                       |
- All possible arrangements of truth values for logical variables

## Source[^3]

| ![[Screenshot 2024-12-11 at 2.31.51 PM.png\|200]] | ![[Screenshot 2024-12-12 at 8.09.42 AM.png\|200]] |
| ------------------------------------------------- | ------------------------------------------------- |
| [[Implication\|conditional]] Truth Table          | [[Biconditional]]  Truth Table                    |

## Source[^4]
- (1) A tabular description of a combinational circuit (such as an AND gate, OR gate, NAND gate), listing all possible states of the input variables together with a statement of the output variable(s) for each of those possible states. 
- (2) A tabular description of a logic operation (such as AND, OR, NAND), listing all possible combinations of the truth values-i.e. true (T) or false (F)-of the operands together with the truth value of the outcome for each of the possible combinations.
## Source[^5]
- A table used in formal logic that lists the truth or falsity of the outcome when a logical operator, such as ‘and’ or ‘or’, is applied to combinations of logical statements. The truth table has been adapted to describe the operation of logic circuits by listing the outputs of a binary logic gate, such as a NAND circuit or flip-flop, for all possible combinations of inputs. The ‘true’ state corresponds to the voltage level representing a logical 1 and ‘false’ to logical 0.
## Source[^6]
- The truth value of a compound statement can be determined from the truth values of its components. A table that gives, for all possible truth values of the components, the resulting truth values of the compound statement is a truth table. The truth table for $\neg p$ is

| $p$ | $\neg p$ |
| :--- | :--- |
| T | F |
| F | T |

and combined truth tables for $p \wedge q, p \vee q$, and $p \Rightarrow q$ are as follows:

| $p$ | $q$ | $p \wedge q$ | $p \vee q$ | $p \Rightarrow q$ |
| :--- | :--- | :--- | :--- | :--- |
| T | T | T | T | T |
| T | F | F | T | F |
| F | T | F | T | T |
| F | F | F | F | T |

- From these, any other truth table can be completed. For example, the final column below, gives the truth table for the compound statement $(p \wedge q) \vee (\neg r)$, and is found by first completing columns for $p \wedge q$ and $\neg r$:

| $p$ | $q$ | $r$ | $p \wedge q$ | $\neg r$ | $(p \wedge q) \vee (\neg r)$ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T | T | T | T | F | T |
| T | T | F | T | T | T |
| T | F | T | F | F | F |
| T | F | F | F | T | T |
| F | T | T | F | F | F |
| F | T | F | F | T | T |
| F | F | T | F | F | F |
| F | F | F | F | T | T |

## References

[^1]: [[(2) Start Learning Logic - Part 1 - Logical Statements, Negation and Conjunction]]
[^2]: [[(3) Start Learning Logic - Part 2 - Disjunction, Tautology and Logical Equivalence]]
[^3]: [[(4) Start Learning Logic - Part 3 - Conditional, Biconditional, Implication and Deduction Rules]]
[^4]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^5]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]
[^6]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]