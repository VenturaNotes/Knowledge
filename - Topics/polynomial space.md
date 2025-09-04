## Synthesis
- 
## Source [^1]
- A way of characterizing the complexity of an algorithm. If the [[space complexity]] (see complexity measure) is polynomially bounded, the algorithm is said to be executable in polynomial space. Many problems for which no polynomial time algorithms have been found, nevertheless can easily be solved in an amount of space bounded by a polynomial in the length of the input
- Formally [[PSPACE]] is defined as the class of formal languages that are recognizable in polynomial space. Defining P and NP as the classes of languages recognizable in polynomial time and recognizable in polynomial time on a nondeterministic Turing machine, respectively (see P=NP QUESTION), it can be shown that P is a subset of PSPACE and that NP is also a subset of PSPACE. It is not known, however, whether $$NP = PSPACE$$although it is conjectured that they are different, i.e. that there exist languages in PSPACE that are not in NP.
- Many problems associated with recognizing whether a player of a certain game (like GO) has a forced win from a given position are PSPACE-complete, which is defined in a similar manner to NP-completeness (see P=NP QUESTION). This implies that such languages can be recognized in polynomial time only if $$PSPACE = P$$Such problems can thus be considered to be even harder than NP-complete problems
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]