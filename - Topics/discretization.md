## Synthesis
- 
## Source [^1]
- The process of replacing a problem defined on a continuum, say an interval $[0,1]$, by an approximating problem on a finite set of points, say $n h$,

  

$$

\begin{aligned}

& n=0,1,2, \ldots, N \\

& \text { where } h=1 / N

\end{aligned}

$$

  

Examples arise in many branches of numerical analysis, principally ordinary and partial differential equations where the finite-difference method and the finite-element method are common forms of discretization. For the ordinary differential equation

  

$$

\begin{aligned}

& y^{\prime}=f(x, y) \\

& 0 \leq x \leq 1, y(0)=y_{0}

\end{aligned}

$$

  

a simple discretization is given by Euler's method:

  

$$

(1 / h)\left(y_{n+1}-y_{n}\right)=f\left(x_{n}, y_{n}\right)

$$

  

where

  

$$

\begin{gathered}

x_{n}=h n, n=0,1, \ldots, N \\

h=1 / N

\end{gathered}

$$

  

and $y_{n}$ denotes the approximation to the true solution $y(x)$ at the point $x_{n}$. See also DISCRETIZATION ERROR.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]