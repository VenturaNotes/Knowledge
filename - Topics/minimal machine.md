## Synthesis
- 
## Source [^1]
- An abstract machine possessing no redundant states. To any finite-state automaton or sequential machine there corresponds a unique (up to isomorphism) minimal machine that recognizes the same language (in the case of finite automata) or has the same response function (in the case of sequential machines). This is true for infinite as well as finite state-sets.
- There are two ways in which a state $q$ may be 'redundant': it is either 'inaccessible' in that there is no input string that takes the start-state to $q$, or else it is equivalent to another state $q^{\prime}$ in that the subsequent behavior of the machine is the same whether it is in state $q$ or $q^{\prime}$. In a minimal machine all inaccessible states have been dropped and all equivalent states have been merged. There is a simple algorithm that will give the minimized version of any machine. See also MyHill Equivalence, Nerode Equivalence.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]