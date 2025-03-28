## Synthesis
- 
## Source [^1]
- For some given program statement $S$ and some postcondition R there is a (possibly empty) set of program states such that if execution of $S$ is initiated from one of these states then $S$ is guaranteed to terminate in a state for which $R$ is true. The weakest precondition of $S$ with respect to $R$, normally written$$\operatorname{wp}(S, R)$$is a predicate that characterizes this set of states. Use of the adjective weakest explicitly indicates that the predicate must characterize all states that guarantee termination of $S$ in a state for which $R$ is true.
- The term was introduced by Dijkstra in 1975 in conjunction with a calculus for the derivation of programs; this provides for development of a program to be guided by the simultaneous development of a total correctness proof for the program. See also PREDICATE TRANSFORMER, PROGRAM CORRECTNESS PROOF.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]