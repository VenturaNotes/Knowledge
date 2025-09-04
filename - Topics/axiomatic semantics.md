## Synthesis
- 
## Source [^1]
- An approach to defining the semantics of programming languages in which the meaning of a language is given by describing the true statements that can be made about programs in that language using axioms and proof rules. Typically the statements are written in some suitable formal notation, such as predicate calculus or modal logic, and concern the states before and after running the program. For example, the formula $$\{p\} S\{q\}$$expresses: if a state satisfies property $p$ then there is an output state after executing program $S$, and it satisfies property $q$. This assertion is called a total correctness assertion; another type is a partial correctness assertion.
- The approach grew out of the early work of R. W. Floyd and C. A. R. Hoare. Though originally intended as methods for program correctness proofs (in particular as an alternative notation for the Floyd method), it was observed that Hoare logic could also be viewed as an axiomatic semantics for a very simple programming language, namely the while programming language. The approach was consequently extended to the description of practically useful languages.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]