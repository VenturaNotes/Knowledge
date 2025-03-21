## Synthesis
- 
## Source [^1]
- A mode of computation in which, at certain points, there is a choice of ways to proceed: the computation may be thought of as choosing arbitrarily between them, or as splitting into separate copies and pursuing all choices simultaneously. The precise form of nondeterminism depends on the particular model of computation.
- For example, a nondeterministic Turing machine will have a choice of moves to make for a given internal state and tape symbol being read. After a choice has been made, other choice-points will be encountered. There is therefore a tree whose paths are all possible different computations, and whose nonterminal nodes represent choice-points. If, for example, the algorithm performs some kind of 'search', then the search succeeds if at least one sequence of choices (path through the tree) is successful.
- Nondeterministic constructs in programming languages can offer a choice of control, e.g.$$\text { do } \mathrm{S}_{1} \text { or } \mathrm{S}_{2} \text { od }$$or a choice of data, e.g.$$\mathrm{y}:=\text { ? and } \mathrm{y}:=\mathrm{x} . \mathrm{R}(\mathrm{x})$$These latter select a value for $y$ randomly and such that it satisfies test R. Many algorithms are expressed most conveniently using such constructs; nondeterminism also arises naturally in connection with interleaving and concurrency.
- Nondeterminism is important in the field of complexity: it is believed that a nondeterministic Turing machine is capable of performing in 'reasonable time' computations that could not be so performed by any deterministic Turing machine (see $\mathrm{P}=\mathrm{NP}$ QUESTION).
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]