---
aliases:
  - recurrence
---
## Synthesis
- 
## Source [^1]
- A statement describing some quantity such as $f(n)$ (where $f$ is some function and $n$ is a positive integer) in terms of values of $f(m)$, where $m$ is a nonnegative integer smaller than $n$; initial values such as $f(0)$ or $f(1)$ can be assumed to be defined. The concept can be extended to include functions of several variables. A recurrence will then involve defining $f(m, n)$, say, in terms of $f\left(m^{\prime}, n^{\prime}\right)$ where in some sense $\left(m^{\prime}, n^{\prime}\right)$ is smaller than $(m, n)$; again initial values can be assumed. The numbers in the $$ Fibonacci series can be defined by a recurrence.

  

In general, a recurrence can be considered as an equation connecting the values of the function at a number of related points. It has the form

  

$$

\begin{aligned}

& g(n, f(n), f(n-1), \ldots, f(n-k))=0 \\

& n=k, k+1, \ldots, N

\end{aligned}

$$

  

Assuming initial values for $f(0), f(1), \ldots, f(k-1)$, values for other points $n$ can be calculated.

Equations of this type arise naturally in the discretization of continuous problems, and in a slightly different form, known as a difference equation, appear repeatedly in combinatorics.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]