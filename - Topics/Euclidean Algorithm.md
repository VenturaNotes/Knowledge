## Synthesis
- 
## Source [^1]
- A process, based on the Division Algorithm, for finding the greatest common divisor (a, b) of two positive integers $a$ and $b$. Assuming that $a > b$, write $a = bq_1 + r_1$, where $0 \le r_1 \lt b$. If $r_1 = 0$, the gcd (a, b) is equal to $b$; if $r_1 \ne 0$, then $(a,b) = (b,r_1)$, so the step is repeated with $b$ and $r_1$ in place of $a$ and $b$. After further repetitions, the last non-zero remainder obtained is the required gcd. For example, for $a = 1274$ and $b = 871$, write $$\begin{align} 1274 &= 1 \times 871 + 403, \\871 &= 2 \times 403 + 65, \\403 &= 6 \times 65 + 13, \\ 65 &= 5 \times 13.\end{align}$$and then $(1274, 871) = (871,403) = (403,65) = (65,13) = 13$ 
- The algorithm also enables $s$ and $t$ to be found such that the gcd can be expressed as $sa + tb$ (see Bézout's lemma). We use the previous equations in turn to express each remainder in this form. Thus, $$\begin{align} 403 &=1274 - 1 \times 871 = a-b, \\ 65 &= 871-2\times 403 = b - 2(a-b) = 3b - 2a, \\13 &= 403 - 6 \times 65 = (a-b) -6(3b-2a) = 13a - 19b.  \end {align}$$
## References

[^1]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]