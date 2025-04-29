## Synthesis
- 
## Source [^1]
- Let $A_{1}, A_{2}, \ldots, A_{k}$ be mutually exclusive events whose union is the whole sample space of an experiment and let $B$ be an event with $\operatorname{Pr}(\mathrm{B}) \neq 0$. Then $\operatorname{Pr}\left(A_{i} \mid B\right)$ equals$$\frac{\operatorname{Pr}\left(B \mid A_{i}\right) \operatorname{Pr}\left(A_{i}\right)}{\operatorname{Pr}\left(B \mid A_{1}\right) \operatorname{Pr}\left(A_{1}\right)+\ldots+\operatorname{Pr}\left(B \mid A_{k}\right) \operatorname{Pr}\left(A_{k}\right)}$$For example, let $A_{1}$ be the event of tossing a double-headed coin and $A_{2}$ the event of tossing a normal coin. Suppose that one of the coins is chosen at random so that $\operatorname{Pr}\left(A_{1}\right)=\frac{1}{2}$ and $\operatorname{Pr}\left(A_{2}\right)=\frac{1}{2}$. Let $B$ be the event of obtaining 'heads'. Then $\operatorname{Pr}\left(B \mid A_{1}\right)=1$ and $\operatorname{Pr}\left(B \mid A_{2}\right)=\frac{1}{2}$. So$$\begin{aligned}
\operatorname{Pr}\left(A_{1} \mid B\right)
& =\frac{\operatorname{Pr}\left(B \mid A_{1}\right) \operatorname{Pr}\left(A_{1}\right)}{\operatorname{Pr}\left(B \mid A_{1}\right) \operatorname{Pr}\left(A_{1}\right)+\operatorname{Pr}\left(B \mid A_{2}\right) \operatorname{Pr}\left(A_{2}\right)} \\

& =\frac{1 \times \frac{1}{2}}{1 \times \frac{1}{2}+\frac{1}{2} \times \frac{1}{2}}=\frac{2}{3}

\end{aligned}$$This says that, given that 'heads' was obtained, the probability that it was the double-headed coin that was tossed is $2 / 3$.
- Here, $\operatorname{Pr}\left(A_{i}\right)$ is a prior probability and $\operatorname{Pr}\left(A_{i} \mid B\right)$ is a posterior probability.
## References

[^1]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]