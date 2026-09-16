## Synthesis
- 
## Source [^1]
- A widely used class of methods for the numerical solution of ordinary differential equations. For the initial-value problem$$y^{\prime}=f(x, y), y\left(x_{0}\right)=y_{0},$$the general form of the $m$-stage method is$$\begin{aligned}

& k_{i}=f\left(x_{n}+c_{i} h, y_{n}+h \sum_{j=1}^{m} a_{i j} k_{j}\right) \\

& i=1,2, \ldots, m \\

& y_{n+1}=y_{n}+h \sum_{i=1}^{m} b_{i} k_{i} \\

& x_{n+1}=x_{n}+h

\end{aligned}$$
- The derivation of suitable parameters $a_{i j}, b_{i}$, and $c_{i}$ requires extremely lengthy algebraic manipulations, except for small values of $m$.
- Some early examples were developed by Runge and a systematic treatment was initiated by Kutta about 1900. Recently, significant advances have been made in the development of a general theory and in the derivation and implementation of efficient methods incorporating error estimation and control.
- Except for stiff equations (see ORDINARY DIFFERENTIAL EQUATIONS), explicit methods with $$a_{i j}=0, j \geq i$$are used. These are relatively easy to program and are efficient compared with other methods unless evaluations of $f(x, y)$ are expensive.
- To be useful for practical problems, the methods should be implemented in a form that allows the stepsize $h$ to vary across the range of integration. Methods for choosing the steps $h$ are based on estimates of the local error. A Runge-Kutta formula should also be derived with a local interpolant that can be used to produce accurate approximations for all values of $x$, not just at the grid-points $x_{n}$. This avoids the considerable extra cost caused by artificially restricting the stepsize when dense output is required.
## Source[^2]
- A numerical method of solving *differential equations in the form $\frac{dy}{dx} = f(x,y)$ which uses the midpoint of interval(s) to improve accuracy. So if the value of the function is known at $(x_n, y_n)$, and the estimate $y_{n+1}$ of $y$ is required at $x_{n+1} = x_n + h$, the second-order Runge–Kutta formula is$$\begin{align}&k_1 = h \times f(x_n, y_n)\\&k_2 = h \times f\left(x_n + \frac{1}{2}h, y_n + \frac{1}{2}k_1\right)\\&y_{n+1} = y_n + k_2\end{align}$$
- and the fourth-order Runge–Kutta formula is

$$\begin{align}&k_1 = h \times f(x_n, y_n)\\&k_2 = h \times f\left(x_n + \frac{1}{2}h, y_n + \frac{1}{2}k_1\right)\\&k_3 = h \times f\left(x_n + \frac{1}{2}h, y_n + \frac{1}{2}k_2\right)\\&k_4 = h \times f(x_n + h, y_n + k_3)\\&y_{n+1} = y_n + \frac{1}{6}k_1 + \frac{1}{3}k_2 + \frac{1}{3}k_3 + \frac{1}{6}k_4\end{align}$$
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]