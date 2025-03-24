## Synthesis
- 
## Source [^1]
- A logic programming language, widely used in artificial intelligence. The basic element of Prolog programs is the structure, which expresses a simple relationship among individuals (constants or variables). Examples of structures are:
	- sister(`mary`, `jane`).
	- ancestor(`adam`, X).
- Words that start with a lower-case letter are constants and words that start with a capital letter are variables, so `mary`, `jane`, and `adam` are constants and X is a variable. Prolog programs consist of clauses, where each is either a simple assertion or an implication. The former consists of a single structure, while the latter takes the form:
	- 'A if B1 and B2 and ... and Bn',
- where the conclusion A and the conditions Bn are all structures. An example of an implication is
	- grandfather(X, Y) :-
	- father(X, Z), parent(Z, Y).
	- which means ' X is a grandfather of Y if X is the father of Z and Z is a parent of Y ' .
- A Prolog program is invoked by presenting a query in the form of a conjunction of structures, as in
	- friend(`fred`, X), father(john, X).
- Execution of the program then determines (if possible) a set of values for the variables in the query such that the truth of the query then follows from the assertions and implications in the program. The above example tries to find all the sons of john that are friends of `fred`.
- Prolog was used as the basis of the Japanese fifth generation project.

## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]