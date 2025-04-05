---
aliases:
  - λ-calculus
---
## Synthesis
- 
## Source [^1]
- A formalism for representing functions and ways of combining functions, invented around 1930 by the logician Alonzo Church. The following are examples of $\lambda$-expressions:
	- $\lambda x . x$ denotes the identity function, which simply returns its argument;
	- $\lambda x . c$ denotes the constant function, which always returns the constant $c$ regardless of its argument;
	- $\lambda x . f(f(x))$ denotes the composition of the function $f$ with itself, i.e. the function that, for any argument $x$, returns $f(f(x))$.
- Much of the power of the notation derives from the ability to represent higher-order functions. For example,$$\lambda f. \lambda x . f(f(x))$$denotes the (higher-order) function that, when applied to a function $f$, returns the function obtained by composing $f$ with itself.
- As well as a notation, the $\lambda$-calculus comprises rules for reducing $\lambda$-expressions to equivalent ones. The most important is the rule of [[beta reduction]] ($\beta$-reduction), by which an expression of the form$$\left(\lambda x . e_{1}\right)\left(e_{2}\right)$$reduces to $e_{1}$ with all free occurrences of $x$ replaced by $e_{2}$. For example:$$(\lambda x . f(\lambda x . x , x))(a)$$reduces to$$f(\lambda x . x, a)$$As a second example, involving a functional variable, the expression $$(\lambda f.f(a))(\lambda x.g)(x,b))$$reduces to $$(\lambda x. g(x, b))(a)$$and hence to$$g(a, b)$$In theoretical terms, the formalism of $\lambda$-calculus can be shown to be equivalent in expressive power to that of Turing machines. It has a special role in the study of programming languages: one can point to its influence on the design of functional languages such as J. McCarthy's Lisp; to P. Landin's reduction of Algol 60 to $\lambda$-calculus, and to D. Scott's construction of a set-theory meaning for the full unrestricted $\lambda$-calculus -a construction that ushered in the theory of domains in the denotational semantics of programming languages.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]