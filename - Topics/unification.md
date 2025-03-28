## Synthesis
- 
## Source [^1]
- An operation on well-formed formulas, namely that of finding a most general common instance. The formulas can be terms or atomic formulas (see PREDICATE CALCULUS). A common instance of two formulas $A$ and $B$ is a formula that is an instance of both of them, i.e. that can be obtained from either by some consistent substitution of terms for variables. As an example let $A$ and $B$ be the following:

  

$$

\begin{aligned}

& A=p(f(u), v) \\

& B=p(w, g(x))

\end{aligned}

$$

  

Let $u, v, w, x, y, z$ be variables, and $c, d$ constants. Consider the substitution that replaces $u$, $v, w, x$ respectively by the terms $y, g(z), f(y), z$. This substitution, when applied to $A$ and $B$, transforms them both into the same formula $I_{1}$, where

  

$$

I_{1}=P(f(y), g(z))

$$

  

Hence the above is a common instance of $A$ and $B$. It is however only one of infinitely many: other common instances of $A$ and $B$ include

  

$$

\begin{aligned}

& I_{2}=P(f(z), g(y)) \\

& I_{3}=P(f(y), g(y)) \\

& I_{4}=P(f(f(y)), g(g(z))) \\

& I_{5}=P(f(c), g(d))

\end{aligned}

$$

  

Note that $I_{2}, I_{3}, I_{4}, I_{5}$ are themselves instances of $I_{1}$. In fact any common instance of $A$ and $B$ is an instance of $I_{1}$ and therefore $I_{1}$ is called a most general common instance of $A$ and $B$. Of the formulas above, the only other one that is a most general common instance is $I_{2} . I_{5}$ would also be one if $c$ and $d$ were variables rather than constants; indeed the $y$ and $z$ of $I_{1}$ could be any two distinct variables. In some cases $A$ and $B$ have no common instance; two examples of this are

  

$$

\begin{aligned}

& A=P(f(u), v) \\

& B=P(g(u), x)

\end{aligned}

$$

  

and

  

$$

\begin{aligned}

& A=P(f(u), u) \\

& B=P(w, f(w))

\end{aligned}

$$

  

If $A$ and $B$ do have a common instance however, they must have a most general one. There are algorithms (the original one being Robinson's, 1965) for deciding whether a given $A$ and $B$ have a common instance, and if so finding a most general one. Robinson's motivation for describing unification was its role in resolution theorem proving. Resolution was at one time associated with 'general problem-solving' techniques in

  

artificial intelligence. More recently it has provided the conceptual basis for the logic programming language Prolog. Another use of unification is in compile-time typeinference, especially for polymorphic types.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]