## Synthesis
- 
## Source [^1]
- A linear error-correcting code, characterized by a $k \times n$ generator matrix, $$G = (g_{ij}[x]),$$whose elements $g_ij[x]$ are polynomials whose highest degree, m, is called the memory of the code. The quantity $$c = m +1$$is called the constraint length of the code
	- #question Was the "$g_ij[x]$" written incorrectly?
- The convolutional encoder operates as follows. The input stream, regarded as the coefficients of a polynomial of arbitrary degree, is cyclically distributed (i.e. demultiplexed) among the inputs of k shift registers, all of length c: the contents of the $i$th shift register is serially multiplied by each of the $n$ polynomials $g_ij[x]$ (using $n$ serial multipliers in parallel). The $n$ output streams are formed by summing the outputs of the $j$th multiplier on each register. These streams are cyclically multiplexed to form the output of the encoder. All this can be carried out to base $q$, for $q$ prime; such codes are usually implemented in binary form (q =2). In practice, the parameter $k$ is normally equal to 1.
- The main decoding algorithms for convolutional codes are Viterbi's algorithm and various sequential algorithms, of which the most important are Fano's algorithm and the stack algorithm. Viterbi's is a maximum-likelihood algorithm
- Linear block codes can be regarded as a special case of convolutional codes with $m = 0$ and $c=1$. Convolutional codes are often specified by the parameters $(n, k)$ or $(n, k, c),$ although the simple phrase $(n, k)$ code usually specifies a block code rather than a convolutional code.
- Convolutional codes are of increasing importance as they become better understood theoretically, as better decoding algorithms are found, and as it becomes increasingly economical to provide programmable decoders, the decoding algorithms being best programmed in software owing to their complexity. 
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]