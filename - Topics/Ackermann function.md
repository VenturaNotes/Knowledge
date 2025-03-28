## Synthesis
- 
## Source [^1]
- The function $A$ defined inductively on pairs of nonnegative integers in the following manner:

  

$$

\begin{aligned}

& A(0, n)=n+1 \\

& A(m+1,0)=A(m, 1) \\

& A(m+1, n+1)=A(m, A(m+1, n))

\end{aligned}

$$

  

where $m, n \geq 0$. Thus

  

$$

\begin{aligned}

& A(1, n)=n+2 \\

& A(2, n)=2 n+3 \\

& A(3, n)=2^{n+3}-3

\end{aligned}

$$

  

The highly recursive nature of the function makes it a popular choice for testing the ability of compilers or computers to handle recursion. It provides an example of a function that is general recursive but not primitive recursive because of the exceedingly rapid growth in its value as $m$ increases.

  

The Ackermann function may also be regarded as a function Ack of a single variable:

  

$$

\operatorname{Ack}(n)=A(n, n)

$$

  

where $A$ is defined as above.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]