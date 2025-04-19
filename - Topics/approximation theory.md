## Synthesis
- 
## Source [^1]
- The area of numerical analysis related to finding a simpler function $f(x)$ which has approximately the same values as $F(x)$ over a specified interval. Analysis can then be carried out on the more accessible $f(x)$ knowing that the difference is small

## Source[^2]
- A subject that is concerned with the approximation of a class of objects, say $F$, by a subclass, say $P \subset F$, that is in some sense simpler. For example, let

  

$$

F=C\{a, b\}

$$

  

the real continuous functions on $[a, b]$, then a subclass of practical use is $P_{n}$, i.e. polynomials of degree $n$. The means of measuring the closeness or accuracy of the approximation is provided by a metric or [[norm]]. This is a nonnegative function that is defined on $F$ and measures the size of its elements. Norms of particular value in the approximation of mathematical functions (for computer subroutines, say) are the Chebyshev norm and the 2-norm (or Euclidean norm or [[two-norm]]). For functions

  

$$

f \in C\{a, b\}

$$

  

these norms are given respectively as

  

$$

\begin{aligned}

& \|f\|=\max _{x \in x \in b}|f(x)| \\

& \|f\|_{2}=\left(\int_{a}^{b} f(x)^{2} \mathrm{~d} x\right)^{1 / 2}

\end{aligned}

$$

  

For approximation of data these norms take the discrete form

  

$$

\begin{aligned}

& \|f\|=\max _{x}\left|f\left(x_{i}\right)\right| \\

& \|f\|_{2}=\left(\sum_{i} f\left(x_{i}\right)^{2}\right)^{1 / 2}

\end{aligned}

$$

  

The 2-norm frequently incorporates a weight function (or weights). From these two norms the problems of Chebyshev approximation and least squares approximation arise. For example, with polynomial approximation we seek

  

$$

p_{n} \in P_{n}

$$

  

for which

  

$$

\left\|f-p_{n}\right\| \text { or }\left\|f-p_{n}\right\|_{2}

$$

  

are acceptably small. Best approximation problems arise when, for example, we seek

  

$$

p_{n} \in P_{n}

$$

  

for which these measures of errors are as small as possible with respect to $P_{n}$.

Other examples of norms that are particularly important are vector and matrix norms. For $n$-component vectors

  

$$

x=\left(x_{1}, x_{2}, \ldots, x_{n}\right)^{\mathrm{T}}

$$

  

important examples are

  

$$

\begin{aligned}

& \|x\|=\max _{i}\left|x_{i}\right| \\

& \|x\|_{2}=\left(\frac{8}{E_{11}} x_{i}^{2}\right)^{1 / 2}

\end{aligned}

$$

  

Corresponding to a given [[vector norm]], a subordinate matrix norm can be defined for $n \times n$ matrices $A$, by

  

$$

\|A\|=\max _{\|x\| \neq 0} \frac{\|A x\|}{\|x\|}

$$

  

For the vector norm

  

$$

\|x\|=\max _{i}\left|x_{i}\right|

$$

  

this reduces to the expression

  

$$

\|A\|=\max _{i} \frac{8}{f i 1}\left|a_{i j}\right|

$$

  

where $a_{i j}$ is the $i, j$ th element of $A$. Vector and matrix norms are indispensable in most areas of numerical analysis.
## References

[^1]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]
[^2]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]