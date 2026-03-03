## Synthesis
- 
## Source [^1]
- Two or more systems connected in series. In Laplace transfer function form, two cascaded linear time-invariant systems with transfer functions $G_{1}(s)$ and $G_{2}(s)$ can be represented in block diagram form as
- ![[Screenshot 2026-03-03 at 7.20.19 AM.png|400]]
	- (a) Cascaded systems
- where $X(s), Y(s)$ , and $Z(s)$ , are the Laplace transforms of time signals $x(t), y(t)$ and $z(t)$
- Here, $Y(s) = G_{1}(s)X(s)$ and $Z(s) = G_{2}(s)Y(s)$ , so that $Z(s) = G_{2}(s)G_{1}(s)X(s) = \left[G_{1}(s)G_{2}(s)\right]X(s)$ and the cascaded processes can be replaced by a single equivalent system with transfer function $G_{1}(s)G_{2}(s)$
- ![[Screenshot 2026-03-03 at 7.21.25 AM.png|400]]
	- (b) Cascaded systems
- Note that since $G_{1}(s)$ and $G_{2}(s)$ are simply algebraic functions of $s$, the order of multiplication is irrelevant.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]