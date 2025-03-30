## Synthesis
- 
## Source [^1]
- Ordinary differential equations where the derivatives depend on values of the solution at the current value and several previous values of the independent variable. The simplest form is

  

$$

\begin{aligned}

& y^{\prime}(x)=f(x, y(x), y(x-\tau(x))), \\

& a \leq x \leq b

\end{aligned}

$$

  

where $\tau(x) \geq 0$. To determine a solution, $y(x)$ must be specified on an interval $a^{} \leq x \leq a$ where $a^{}$ depends on the values taken by $\tau(x)$.

  

Most of the commonly used step-by-step methods for ordinary differential equations can be adapted to problems of this form, although they have not yet been developed to the same extent. It is necessary to incorporate an interpolation scheme to approximate

  

$$

y(x-\tau(x))

$$

  

at values that will not usually coincide with a previously computed approximation.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]