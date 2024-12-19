## Synthesis
- 
## Source [^1]
- The general solution to a system is 
	- isolating the basic variables and writing them in terms of the free variables
### No General Solution Example
- ![[Screenshot 2024-12-18 at 10.10.52 AM.png]]
	- No general solution to system since
		- $0x_1 + 0x_2 + 0x_3 + 0x_4 = 5$ is [[inconsistent]]
### General Solution Example
- $\left[\begin{array}{rrr|r} 1 & 3 & 4 & 7 \\ 3 & 9 & 7 & 6\end{array}\right] \sim \left[\begin{array}{rrr|r} 1 & 3 & 4 & 7 \\ 0 & 0 & 1 & 3\end{array}\right]$
	- #comment The $\sim$ shows that two matrices are [[equivalent]]
- This gives our system of equations:
	- $x_1 + 3x_2 + 4x_3 = 7$
	- $x_3 = 3$ 
- Since columns 1 and 3 have pivots, $x_1$ and $x_3$ are the [[basic variable|basic variables]]

## References

[^1]: [[(4) Linear Algebra 1.2.2 Solution Sets and Free Variables]]