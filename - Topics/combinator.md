## Synthesis
- 
## Source [^1]
- A lambda expression containing no free variables. While this is the most general definition, the word is usually understood more specifically to refer to certain combinators of special importance, in particular the following four: $$\begin{align}&I = \lambda x.x \\&K = \lambda x.\lambda y. x \\ &S = \lambda x. \lambda y. \lambda z. x(z)(y(z)) \\ &Y = \lambda f. (\lambda u. f(u(u)))(\lambda u.f(u(u)))\end{align}$$The combinators I, K, and S were introduced by Schönfinkel and Curry, who showed that any $\lambda$-expression can essentially be formed by combining them. More recently combinators have been applied to the design of implementations for functional languages. In particular Y (also called the paradoxical combinator) can be seen as producing fixed points, since $Y(f)$ reduces to $f(Y(f))$.
## References

[^1]: [[Home Page - A Dictionary of Computer Science by Oxford Reference]]