## Synthesis
- 
## Source [^1]
- A structure-preserving mapping between algebras. A homomorphism

  

allows the modelling, simulation, or representation of the structure of one algebra within another, possibly in a limited form. Let $A$ and $B$ be algebras and $h$ a function from $A$ to $B$. Suppose that $A$ contains an $n$-ary operation $f_{\mathrm{A}}$, while $B$ contains a corresponding operation $f_{\mathrm{B}}$. If $h$ is a homomorphism it must satisfy

  

$$

h\left(f_{\mathrm{A}}\left(a_{1}, \ldots, a_{k}\right)\right)=f_{\mathrm{B}}\left(h\left(a_{1}\right), \ldots, h\left(a_{k}\right)\right)

$$

  

for all elements $a_{1}, \ldots, a_{k}$ of $A$ and every 'corresponding' pair of operations of $A$ and $B$.

The idea that $f_{\mathrm{A}}$ and $f_{\mathrm{B}}$ are 'corresponding' operations is made precise by saying that $A$ and $B$ are algebras over the same signature $\Sigma$, while $f$ is an operation symbol in $\Sigma$ with which $A$ and $B$ associate the operations $f_{\mathrm{A}}$ and $f_{\mathrm{B}}$ respectively. A homomorphism from $A$ to $B$ is any function $h$ from $A$ to $B$ that satisfies the condition given above for each $f$ in $\Sigma$. As applications of this idea, the semantic functions involved in denotational semantics can be viewed as homomorphisms from algebras of syntax to algebras of semantic objects. Usually, to define a semantic function by induction on terms is to define a homomorphism on a term algebra. In several important cases, compilers can be designed as homomorphisms between two algebras of programs.

  

Special cases of this general definition occur when $A$ and $B$ belong to one of the familiar classes of algebraic structures. For example, let $A$ and $B$ be monoids, with binary operations ${ }^{\circ} \mathrm{A}$ and ${ }^{\circ} \mathrm{B}$ and identity elements $e_{\mathrm{A}}$ and $e_{\mathrm{B}}$. Then, rewriting the general condition above, a homomorphism from $A$ to $B$ satisfies

  

$$

\begin{aligned}

& h\left(x^{\circ} \mathrm{A} y\right)=h(x)^{\circ} \mathrm{B} h(y) \\

& h\left(e_{\mathrm{A}}\right)=e_{\mathrm{B}}

\end{aligned}

$$

  

A further specialization from formal language theory arises with monoids of words, where the binary operation is concatenation and the nullary operation is the empty word. Let $S$ and $T$ be alphabets, and let $h$ be a function from $S$ to $T^{}$, i.e. a function that gives a $T$-word for each symbol in $S$. Then $h$ can be extended to $S$-words, by concatenating its values on individual symbols:

  

$$

h\left(s_{1}, \ldots, s_{n}\right)=h\left(s_{1}\right), \ldots, h\left(s_{n}\right)

$$

  

This extension of $h$ gives a monoid homomorphism from $S^{}$ to $T^{}$. Such an $h$ is said to be $\Lambda$-free if it gives a nonempty $T$-word for each symbol in $S$.

$h$ can be further extended to a mapping on languages, giving, for any subset $L$ of $S^{}$, its homomorphic image $h(L)$ :

  

$$

h(L)=\{h(w) \mid w \in L\}

$$

  

Similarly the inverse homomorphic image of $L \subseteq T^{}$ is

  

$$

h^{-1}(L)=\{w \mid h(w) \in L\}

$$

  

These language-mappings are also homomorphisms, between the monoids of languages over $S$ and over $T$, the binary operation being concatenation of languages.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]