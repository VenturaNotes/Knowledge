---
aliases:
  - compositions
---
## Synthesis
- 
## Source [^1]
- 1. (relative product) A method of combining functions in a serial manner. The composition of two functions

  

$$

f: X \rightarrow Y \text { and } g: Y \rightarrow Z

$$

  

is the function

  

$$

h: X \rightarrow Z

$$

  

with the property that

  

$$

h(x)=g(f(x))

$$

  

This is usually written as $g^{\circ} f$. The process of performing composition is an operation between functions of suitable kinds. It is associative, and identity functions fulfil the role of units.

  

If $R$ denotes the set of real numbers and

  

$$

\begin{aligned}

& f: R \rightarrow R, f(x)=\operatorname{sim}(x) \\

& g: R \rightarrow R, g(x)=x^{2}+\overline{3}

\end{aligned}

$$

  

then $f^{\circ} g$ is the function $h$ :

  

$$

h: R \rightarrow R, h(x)=\operatorname{sim}\left(x^{2}+\overline{3}\right)

$$

  

The idea of composition of functions can be extended to functions of several variables. 2. A subdivision of a positive integer $n$ into parts $a_{1}, a_{2}, \ldots a_{\mathrm{k}}$ in which the ordering is significant and in which

  

$$

n \equiv a_{1}+a_{2}+\ldots+a_{k}

$$

  

where each $a_{i}$ is a positive integer. It is thus similar to a partition (see COVERING) but in a partition the ordering is not significant. In general the number of compositions of $n$ is $2^{n-1}$. 3. A particular form of association between entities found in object-oriented approaches. The association is used to indicate a hierarchy of objects such that objects lower in the hierarchy are part of objects higher in the hierarchy. Thus the hierarchy indicates a component structure.
## Source[^2]
- An agreement between a debtor and his or her creditors discharging the debts in exchange for a proportion of what is due. The agreement may be registered as a deed of arrangement or form part of an individual voluntary arrangement. See also SCHEME OF ARRANGEMENT.
## Source[^3]
- (of a number) A composition of the positive integer $n$ is obtained by writing$$n = n_1 + n_2 + \dots + n_k,$$where $n_1, n_2, \dots, n_k$ are positive integers, and the order in which $n_1, n_2, \dots, n_k$ matters. The number of compositions of $n$ equals $2^{n-1}$. For example the compositions of 4 are $$4 = 3 + 1 = 1 + 3 = 2 + 2 = 2 + 1 + 1 = 1 + 2 + 1 = 1 + 1 + 2 = 1 + 1 + 1 + 1.$$
- See PARTITION.
---
- (of functions) Let $f: S \rightarrow T$ and $g: T \rightarrow U$ be functions. With each $s$ in $S$ is associated the element $f(s)$ of $T$, and hence the element $g(f(s))$ of $U$. This rule gives a function from $S$ to $U$, which is denoted by $g \circ f$ and is the composition of $f$ and $g$. Note that $f$ operates first, then $g$. Thus $g \circ f: S \rightarrow U$ is defined by $(g \circ f)(s) = g(f(s))$, and exists if and only if the domain of $g$ equals the codomain of $f$.
- ![[Pasted image 20260710010518.png|500]]
	- The composition $g \circ f$
- For example, suppose that $f: \mathbb{R} \rightarrow \mathbb{R}$ and $g: \mathbb{R} \rightarrow \mathbb{R}$ are defined by $f(x) = 1 - x$ and $g(x) = x/(x^2 + 1)$. Then $f \circ g: \mathbb{R} \rightarrow \mathbb{R}$ and $g \circ f: \mathbb{R} \rightarrow \mathbb{R}$ both exist, and$$\begin{align} (f \circ g)(x) = 1 - \frac{x}{x^2 + 1}, \\ (g \circ f)(x) = \frac{1-x}{(1-x)^2 + 1}. \end{align}$$
- The term 'composition' is also used for the operation $\circ$; from the previous example we see $\circ$ is not generally commutative. Composition of functions is associative: if $f: S \rightarrow T, g: T \rightarrow U$ and $h: U \rightarrow V$ are functions, then $h \circ (g \circ f) = (h \circ g) \circ f$.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Business and Management 6th Edition by Oxford Reference]]
[^3]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]