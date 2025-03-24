## Synthesis
- 
## Source [^1]
- In the study of effective computability, a particular way of defining a new function in terms of other simpler ones. The functions involved are functions over the nonnegative integers. Primitive recursion is then the process of defining a function $f$ of $n+1$ variables in the following manner:

  

$$

\begin{aligned}

& f\left(x_{1}, x_{2}, \ldots x_{m}, 0\right)=g\left(x_{1}, x_{2}, \ldots x_{n}\right) \\

& f\left(x_{1}, x_{2}, \ldots x_{m}, y+1\right)= \\

& h\left(x_{1}, x_{2}, \ldots x_{m}, y, f\left(x_{1}, \ldots x_{m}, y\right)\right)

\end{aligned}

$$

  

where $g$ and $h$ are functions of $n$ and $n+2$ variables respectively. See also PRIMITIVE RECURSIVE FUNCTION.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]