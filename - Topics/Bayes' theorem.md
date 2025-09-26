## Synthesis
- 
## Source [^1]
- Let $A_{1}, A_{2}, \ldots, A_{k}$ be mutually exclusive events whose union is the whole sample space of an experiment and let $B$ be an event with $\operatorname{Pr}(\mathrm{B}) \neq 0$. Then $\operatorname{Pr}\left(A_{i} \mid B\right)$ equals$$\frac{\operatorname{Pr}\left(B \mid A_{i}\right) \operatorname{Pr}\left(A_{i}\right)}{\operatorname{Pr}\left(B \mid A_{1}\right) \operatorname{Pr}\left(A_{1}\right)+\ldots+\operatorname{Pr}\left(B \mid A_{k}\right) \operatorname{Pr}\left(A_{k}\right)}$$For example, let $A_{1}$ be the event of tossing a double-headed coin and $A_{2}$ the event of tossing a normal coin. Suppose that one of the coins is chosen at random so that $\operatorname{Pr}\left(A_{1}\right)=\frac{1}{2}$ and $\operatorname{Pr}\left(A_{2}\right)=\frac{1}{2}$. Let $B$ be the event of obtaining 'heads'. Then $\operatorname{Pr}\left(B \mid A_{1}\right)=1$ and $\operatorname{Pr}\left(B \mid A_{2}\right)=\frac{1}{2}$. So$$\begin{aligned}
\operatorname{Pr}\left(A_{1} \mid B\right)
& =\frac{\operatorname{Pr}\left(B \mid A_{1}\right) \operatorname{Pr}\left(A_{1}\right)}{\operatorname{Pr}\left(B \mid A_{1}\right) \operatorname{Pr}\left(A_{1}\right)+\operatorname{Pr}\left(B \mid A_{2}\right) \operatorname{Pr}\left(A_{2}\right)} \\

& =\frac{1 \times \frac{1}{2}}{1 \times \frac{1}{2}+\frac{1}{2} \times \frac{1}{2}}=\frac{2}{3}

\end{aligned}$$This says that, given that 'heads' was obtained, the probability that it was the double-headed coin that was tossed is $2 / 3$.
- Here, $\operatorname{Pr}\left(A_{i}\right)$ is a prior probability and $\operatorname{Pr}\left(A_{i} \mid B\right)$ is a posterior probability.

## Source[^2]
- $n$. In statistics, a theorem, easily proved from Bayes' rule, expressing the conditional probability of an event $H$ given an event $D$, written $P(H \mid D)$, in terms of the conditional probability of $D$ given $H$, written $P(D \mid H)$, the probability of $D$, and the probability of $H$. In its simplest form, $P(H \mid D)=P(D \mid H) P(H) / P(D)$. The theorem enables the prior probability (2) of a hypothesis $(H)$ to be updated repeatedly to produce posterior probabilities in the light of data $(D)$ derived from observation or experience, and it underpins the whole edifice of Bayesian inference. In its most general form, the theorem states that if $H_{n}$ is one of a set $H_{i}$ of mutually exclusive and exhaustive events, then $P\left(H_{n} \mid D\right)=P(D \mid$ $\left.H_{n}\right) P\left(H_{n}\right) / \Sigma_{i}\left[P\left(D \mid H_{i}\right) P\left(H_{i}\right)\right]$. \[Named after the English mathematician and Presbyterian clergyman Thomas Bayes (1702-61) and published posthumously in 1763]
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Psychology 4th Edition by Oxford Reference]]