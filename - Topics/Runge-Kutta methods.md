## Synthesis
- 
## Source [^1]
- A widely used class of methods for the numerical solution of ordinary differential equations. For the initial-value problem

  

$$

y^{\prime}=f(x, y), y\left(x_{0}\right)=y_{0}

$$

  

the general form of the $m$-stage method is

  

$$

\begin{aligned}

& k_{i}=f\left(x_{n}+c_{i} h, y_{n}+h \sum_{j=1}^{m} a_{i j} k_{j}\right) \\

& i=1,2, \ldots, m \\

& y_{n+1}=y_{n}+h \sum_{j=1}^{m} b_{i} k_{i} \\

& x_{n+1}=x_{n}+h

\end{aligned}

$$

  

The derivation of suitable parameters $a_{i j}, b_{i}$, and $c_{i}$ requires extremely lengthy algebraic manipulations, except for small values of $m$.

  

Some early examples were developed by Runge and a systematic treatment was initiated by Kutta about 1900. Recently, significant advances have been made in the development of a general theory and in the derivation and implementation of efficient methods incorporating error estimation and control.

  

Except for stiff equations (see ORDINARY DIFFERENTIAL EQUATIONS), explicit methods with $a_{i j}=0, j \geq i$

are used. These are relatively easy to program and are efficient compared with other methods unless evaluations of $f(x, y)$ are expensive.

  

To be useful for practical problems, the methods should be implemented in a form that allows the stepsize $h$ to vary across the range of integration. Methods for choosing the steps $h$ are based on estimates of the local error. A Runge-Kutta formula should also be derived with a local interpolant that can be used to produce accurate approximations for

  

all values of $x$, not just at the grid-points $x_{n}$. This avoids the considerable extra cost caused by artificially restricting the stepsize when dense output is required.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]