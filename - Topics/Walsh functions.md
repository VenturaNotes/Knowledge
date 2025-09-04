## Synthesis
- 
## Source [^1]
- A complete set of functions that form an orthonormal basis for Walsh analysis: they take only the values +1 and -1 , and are defined on a set of $2^{n}$ points for some $n$. For purposes of computer representation, and also for their use in coding, it is usual to represent ' +1 ' by ' 0 ', and ' -1 ' by ' 1 '. As an example, the 8 -point Walsh functions are then as follows:

  

$$

\begin{aligned}

& \operatorname{wal}(8,0)=00000000 \\

& \operatorname{wal}(8,1)=11110000 \\

& \operatorname{wal}(8,2)=00111100 \\

& \operatorname{wal}(8,3)=11001100 \\

& \operatorname{wal}(8,4)=10011001 \\

& \operatorname{wal}(8,5)=01101001 \\

& \operatorname{wal}(8,6)=01011010 \\

& \operatorname{wal}(8,7)=10101010

\end{aligned}

$$

  

Note that the Walsh functions (usually denoted wal) consist alternatively of even and odd functions (usually denoted cal and sal by analogy with cos and sin). Furthermore, within the set of $2^{n}$ functions there is one function of zero sequency, one of (normalized) sequency $2^{n-1}$, and one pair (odd and even) of each (normalized) sequency from 1 to $2^{n-1}$ $-1$.

  

A set of Walsh functions corresponds, with some permutation of columns, to a ReedMuller code and, with a column deleted, to a simplex code. See also HadAMARD MATRICES.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]