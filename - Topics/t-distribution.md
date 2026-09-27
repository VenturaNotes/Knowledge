## Synthesis
- 
## Source [^1]
- Introduced by William Gosset in 1908, the $t$-distribution is the continuous probability distribution of a random variable formed from the ratio of a random variable with a standard normal distribution and the square root of a random variable with a chi-squared distribution divided by its degrees of freedom $\nu$. Alternatively, it is formed from the square root of a random variable with an F-distribution in which the numerator has one degree of freedom. Its probability density function is$$f(x) = \frac{\Gamma(\frac{\nu+1}{2})}{\sqrt{\nu\pi}\Gamma(\frac{\nu}{2})} \left(1 + \frac{x^2}{\nu}\right)^{-\frac{\nu+1}{2}},$$which gives the Cauchy distribution when $\nu = 1$. The graph of $f$ is similar in shape to a standard normal distribution, but is less peaked and has fatter tails. The distribution is used to test for significant differences between a sample mean and the population mean and can be used to test for differences between two sample means. The table gives, for different degrees of freedom, the values corresponding to certain values of $\alpha$, to be used in a one-tailed or two-tailed $t$-test, as explained below.

| $\alpha$ | $2\alpha$ | $\nu = 1$ | $2$ | $3$ | $4$ | $6$ | $8$ | $10$ | $15$ | $20$ | $30$ | $60$ | $\infty$ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| $0.05$ | $0.10$ | $6.34$ | $2.92$ | $2.35$ | $2.13$ | $1.94$ | $1.86$ | $1.81$ | $1.75$ | $1.72$ | $1.70$ | $1.67$ | $1.64$ |
| $0.025$ | $0.05$ | $12.71$ | $4.30$ | $3.18$ | $2.78$ | $2.45$ | $2.31$ | $2.23$ | $2.13$ | $2.09$ | $2.04$ | $2.00$ | $1.96$ |
| $0.01$ | $0.02$ | $31.82$ | $6.96$ | $4.54$ | $3.75$ | $3.14$ | $2.90$ | $2.76$ | $2.60$ | $2.53$ | $2.46$ | $2.39$ | $2.33$ |
| $0.005$ | $0.01$ | $63.66$ | $9.92$ | $5.84$ | $4.60$ | $3.71$ | $3.36$ | $3.17$ | $2.95$ | $2.84$ | $2.75$ | $2.66$ | $2.58$ |

- Values for one- and two-tailed $t$-test

- Corresponding to the first column value $\alpha$, the table gives the one-tailed value $t_{\alpha, \nu}$ such that $\Pr(t > t_{\alpha, \nu}) = \alpha$, for the $t$-distribution with $\nu$ degrees of freedom. Corresponding to the second column value $2\alpha$, the table gives the two-tailed value $t_{\alpha, \nu}$ such that $\Pr(|t| > t_{\alpha, \nu}) = 2\alpha$. Interpolation may be used for values of $\nu$ not included.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]