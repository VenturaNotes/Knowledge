## Synthesis
- 
## Source [^1]
- One of the major open questions in theoretical computer science at present.
- [[P]] ($\boldsymbol{P}$) is the class of formal languages that are recognizable in polynomial time. More precisely a language $L$ is in $\boldsymbol{P}$ if there exists a  Turing machine program $M$ and a polynomial $p(n)$ such that $M$ recognizes $L$ and$$T_{\mathrm{M}}(n) \leq p(n)$$for all nonnegative integers $n$, where $T_{\mathrm{M}}$ is the [[time complexity]] of $M$ (see COMPLEXITY MEASURE). It is generally accepted that if a language is not in $\boldsymbol{P}$ then there is no algorithm that recognizes it and is guaranteed to be always 'fast'.
- $N P$ is the class of languages that are recognizable in polynomial time on a nondeterministic Turing machine. 
- Clearly$$P \subseteq N P$$but the question of whether or not$$P=N P$$has not been solved despite a great amount of research.
- Contained in $N P$ is a set NPC of languages that are called NP-complete. A language $L_{1}$ is in NPC if every language $L_{2}$ in [[NP]] can be polynomially reduced to $L_{1}$, i.e. there is some function $f$ such that
	- (a) $x \in L_{1}$ iff $f(x) \in L_{2}$
	- (b) $f(x)$ is computable by a Turing machine in time bounded by a polynomial in the length of $x$.
- It can be shown that if any NP-complete language is also in $\boldsymbol{P}$ then $\boldsymbol{P}=\boldsymbol{N P}$.
- A wide variety of problems occurring in computer science, mathematics, and operations research are now known to be NP-complete. As an example the problem of determining whether a Boolean expression in conjunctive normal form (see CONJUNCTION) can be satisfied by a truth assignment was the first problem found to be NP-complete; this is generally referred to as the satisfiability (or CNF satisfiability) problem. Despite considerable effort none of these NP-complete problems have been shown to be polynomially solvable. Thus it is widely conjectured that no NP-complete problem is polynomially solvable and $\boldsymbol{P} \neq \boldsymbol{N P}$.
- A language is said to be NP-hard if any language in $\boldsymbol{N P}$ can be polynomially reduced to it, even if the language itself is not in $\boldsymbol{N P}$.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]