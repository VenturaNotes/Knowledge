## Synthesis
- 
## Source [^1]
- The number of digits differing between two binary codewords of the same length. This defines a metric on the set of such codewords. If codewords are used that are at least distance 3 apart, in the event of a single transmission error, the error can be corrected by using the nearest codeword

## Source[^2]
- (Hamming metric) In the theory of block codes intended for error detection or error correction, the Hamming distance $d(u, v)$ between two words $u$ and $v$, of the same length, is equal to the number of symbol places in which the words differ from one another. If $u$ and $v$ are of finite length $n$ then their Hamming distance is finite since

  

$$

d(u, v) \leq n

$$

  

It can be called a distance since it is nonnegative, nil-reflexive, symmetric, and triangular:

  

$$

\begin{aligned}

& 0 \leq d(u, v) \\

& d(u, v)=0 \text { iff } u=v \\

& d(u, v)=d(v, u) \\

& d(u, w) \leq d(u, v)+d(v, w)

\end{aligned}

$$

  

The Hamming distance is important in the theory of error-correcting codes and errordetecting codes: if, in a block code, the codewords are at a minimum Hamming distance $d$ from one another, then

(a) if $d$ is even, the code can detect $d-1$ symbols in error and correct $1 / 2(d-1)$ symbols in error;

(b) if $d$ is odd, the code can detect $d-1$ symbols in error and correct $1 / 2(d-1)$ symbols in error.

  

See also CODING BOUNDS, CODING THEORY, HAMMING BOUND, HAMMING SPACE, PERFECT CODES.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]