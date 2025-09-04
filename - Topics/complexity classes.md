## Synthesis
- 
## Source [^1]
- A way of grouping algorithms, computable functions, or specifications according to their computational complexity. Computable functions that have the same complexity according to some measure are placed in the same complexity class; functions in the same class are equally difficult to compute with respect to the measure.

  

The classification is most thoroughly done for formal languages that can be recognized by Turing machines. If $L$ is a formal language that can be recognized by a deterministic Turing machine program $M$, and the time complexity (see COMPLEXITY MEASURE) for $M$ is a function $T_{\mathrm{M}}(n)$ of the length $n$ of the input string, then $L$ is classified according to the nature of $T_{\mathrm{M}}(n)$. If $T_{\mathrm{M}}(n)$ is bounded (e.g. by a polynomial or exponential function) then there exists a bounding function $S(n)$ such that for all $n$,

  

$$

T_{\mathrm{M}}(n) \leq S(n)

$$

  

For a particular function $S(n)$ there is consequently a class of languages for which the above bound on time holds. This class is denoted by

  

Thus $\operatorname{DTIME}(S(n))$ is the class of languages recognizable within time $S(n)$.

There is a similar definition of a class of languages

$\operatorname{DSPACE}(S(n))$

in terms of the space complexity (see COMPLEXITY MEASURE).

There are various known relations between complexity classes. For example, if for two bounding functions $S_{1}$ and $S_{2}$

  

$$

\lim _{n \rightarrow \infty} S_{1}(n) / S_{2}(n)=0

$$

  

then there is a language in $\operatorname{DSPACE}\left(S_{2}(n)\right)$ that is not in $\operatorname{DSPACE}\left(S_{1}(n)\right)$. Note that this applies if $S_{1}$ is polynomial and $S_{2}$ is exponential. There are similar results for time complexity classes.

  

Complexity classes can also be defined for nondeterministic Turing machine programs. Thus a language $L$ is in

  

# $\operatorname{NSPACE}(S(n))$

  

if there is some nondeterministic Turing machine program that recognizes $L$ and such that on an input string of length $n$ none of the possible computations uses more than $S(n)$ tape squares. Time complexity classes, NTIME, can be similarly defined. It is known for example that

  

$$

\operatorname{NSPACE}(S(n)) \subseteq \operatorname{DSPACE}\left(S(n)^{2}\right)

$$
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]