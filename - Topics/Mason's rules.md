## Synthesis
- 
## Source [^1]
- (Mason's nontouching loop rules) A technique for simplifying the analysis of signal flowgraph descriptions of electrical networks. Given a source node $\mathbf{a}$ and a destination node $\mathbf{b}$, then the total transfer function between the two nodes, accounting for all paths, is given by Mason's rules to be$$\frac {b}{a} = \frac {\left(\Sigma_ {K} \mathrm {T} _ {K} \Delta_ {K}\right)}{\Delta}$$where $T_{K}$ is the path gain or total transmittance of the Kth forward path from $\mathbf{a}$ to $\mathbf{b}$; $$\begin{align}\Delta &= (1 - (\text{sum of all individual loop gains}) \\&+ (\text{sum of products of loop gains for all possible combinations of two nontouching loops}) \\&- (\text{sum of products of loop gains for all possible combinations of three nontouching loops}) \\&+ \ldots);\end{align}$$$$\Delta_{K} = \text{sum of all terms in } \Delta \text{ not touching the } K\text{th path.}$$
- A path is a continuous succession of individual branches passing any node in the network only once. A loop is a path that starts and ends on the same node in the network. Nontouching loops do not share any nodes.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]