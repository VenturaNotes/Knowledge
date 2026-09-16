## Synthesis
- 
## Source [^1]
- A lot of bivariate data do not meet the requirements necessary to use the product moment correlation coefficient (pmcc). This is often because at least one of the variables is measured on a scale which is ordinal but not interval. Where the measurement is reported on a non-numerical scale it is transparently not interval, but often gradings, based on subjective evaluations, are reported on a numerical scale.
- Spearman's rank correlation coefficient is the product moment correlation applied to the ranks. In the case of where there are no tied ranks, this is algebraically equivalent to computing the value of$$1 - \frac{6 \sum d_i^2}{n(n^2 - 1)}$$where $d_i = \text{difference in ranks of the } i\text{th pair and } n \text{ is the number of data pairs.}$ When $n$ is reasonably small, this computation is very quick. When there are tied ranks the above formula is not algebraically equivalent to the pmcc applied to the ranks but is often used as a reasonable approximation.
- Kendall's rank correlation coefficient: Sir Maurice Kendall proposed a measure of rank correlation based on the number of neighbour-swaps needed to move from one rank ordering to another. If $Q$ is the minimum number of neighbour swaps needed in a set of data with $n$ values then Kendall's coefficient is given by$$\tau = 1 - \frac{4Q}{n(n-1)}.$$
- Significance tests can then be carried out using critical values from books of statistical tables.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]