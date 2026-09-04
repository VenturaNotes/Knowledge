## Synthesis
- 
## Source [^1]
- Let $x_0, x_1, \dots, x_n$ be equally spaced values, so that $x_i = x_0 + ih$, for $1 \le i \le n$. Suppose that the values $f_0, f_1, \dots, f_n$ are known, where $f_i = f(x_i)$, for some function $f$. The first differences are defined, for $0 \le i < n$, by $\Delta f_i = f_{i+1} - f_i$. The second differences are defined by $\Delta^2 f_i = \Delta f_{i+1} - \Delta f_i$ and, in general, the $k$-th differences are defined by $\Delta^k f_i = \Delta^{k-1} f_{i+1} - \Delta^{k-1} f_i$. For a polynomial of degree $n$, the $(n + 1)$-th differences are zero.
- These finite differences may be displayed in a table, as in the following example. Alongside it is a numerical example.
- ![[Pasted image 20260903220249.png]]
- With such tables it should be appreciated that if the values $f_0, f_1, \dots, f_n$ are rounded values then increasingly serious errors result in the succeeding columns.
- Numerical methods using finite differences have been extensively developed. They may be used for interpolation, as in the Gregory-Newton forward difference formula, for finding a polynomial that approximates to a given function, or for estimating derivatives from a table of values.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]