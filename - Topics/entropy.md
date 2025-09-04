## Synthesis
- 
## Source [^1]
- (Shannon entropy) For a random variable $X$ which takes $k$ values with probabilities $p_1, p_2, ... p_k,$ the entropy of $X$ is given by $H(X) = \sum_1^k p_ilog_2p_i.$ This is the expected value of the information when sampling $X$. It is maximal when the probability distribution is uniform. See SHANNON'S THEOREM.

## Source[^2]
- A measure of the amount of information that is output by a source, or throughput by a channel, or received by an observer (per symbol or per second). Following Shannon (1948) and later writers, the entropy of a discrete memoryless source with alphabet $A=\{a i\}$ of size $n$, and output $X$ at time $t$ is

  

$$

H(X)=\sum_{i=0}^{n-1} p\left(x_{i}\right) \log _{2}\left(1 / p\left(x_{i}\right)\right)

$$

  

where

  

$$

p\left(x_{i}\right)=\operatorname{Prob}\left\{X_{t}=a_{i}\right\}

$$

  

The logarithmic base $b$ is chosen to give a convenient scale factor. Usually,

  

$$

\begin{aligned}

& b=2 \\

& b=e=2.71828 \ldots

\end{aligned}

$$

  

or

  

$$

b=10

$$

  

Entropy is then measured in bits, in natural units or nats, or in Hartleys, respectively. When the source has memory, account has to be taken of the dependence between successive symbols output by the source.

  

The term arises by analogy with entropy in thermodynamics, where the defining expression has the same form but with a physical scale factor $k$ (Boltzmann constant) and with the sign changed. The word [[negentropy]] is therefore sometimes used for the measure of information, as is uncertainty or simply 'information'.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]