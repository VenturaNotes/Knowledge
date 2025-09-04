---
aliases:
  - Clock Arithmetic
---
## Synthesis
- 
## Source [^1]
- (residue arithmetic) Arithmetic based on the concept of the congruence relation defined on the integers and used in computing to circumvent the problem of performing arithmetic on very large numbers. 
- Let $m_{1}, m_{2}, \ldots, m_{k}$ be integers, no two of which have a common factor greater than one. Given a large positive integer $n$ it is possible to compute the remainders or residues $r_{1}, r_{2}$, $\ldots, r_{k}$ such that$$\begin{aligned}& n\equiv r_{1}\left(\bmod m_{1}\right) \\& n\equiv r_{2}\left(\bmod m_{2}\right) \\& \ldots \\& n\equiv r_{k}\left(\bmod m_{k}\right)\end{aligned}$$Provided $n$ is less than$$m_{1} \times m_{2} \times \ldots \times m_{k}$$$n$ can be represented by$$\left(r_{1}, r_{2}, \ldots, r_{k}\right)$$This can be regarded as an internal representation of $n$. Addition, subtraction, and multiplication of two large numbers then involves the addition, subtraction, and multiplication of corresponding pairs, e.g.$$\begin{aligned}& \left(r_{1}, \ldots, r_{k}\right)+\left(s_{1}, \ldots, s_{k}\right)= \\& \left(r_{1}+s_{1}, \ldots, r_{k}+s_{k}\right)\end{aligned}$$Determining the sign of an integer or comparing relative magnitudes are less straightforward.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]