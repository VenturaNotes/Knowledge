## Synthesis
- 
## Source [^1]
- If $X$ is a random variable where $X$ takes only non-negative integer values, then $G_X(s) = E(s^X)$ is the probability generating function (pgf). Then $$G_X(s) = \sum_{x=0}^{\infty}Pr(X = k)s^k$$The mean and variance of $X$ can also be computed using the pgf from $$E(X) = G'_X(1) \quad \text{and} \quad \text{Var}(X) = G''_X(1) + G'_X(1) - (G'_X(1))^2.$$
- The pgf of the sum $X + Y$ of two independent random variables is given by $$G_{X+Y}(s) = G_X(s)G_Y(s),$$and for random sampling, where $Z = X_1 + ... + X_n$, with N itself a random variable and the $X_i$ are iid, then $G_Z(s) = G_N(G_X(s)).$ 
## References

[^1]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]