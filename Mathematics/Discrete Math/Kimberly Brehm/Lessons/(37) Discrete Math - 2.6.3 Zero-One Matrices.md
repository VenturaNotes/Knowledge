[Video](https://youtube.com/watch?v=EkW2QsKyddM)

- Zero-One Matrices
	- A matrix where all entries are either 0 or 1. Zero-One matrices are based on Boolean operations
	- "meet"
		- ![[Screenshot 2022-12-18 at 12.49.51 AM.png]]
			- $\land$ is a conjunction
	- "join"
		- ![[Screenshot 2022-12-18 at 12.49.57 AM.png]]
- Find the join and meet of A and B.
	-  ![[Screenshot 2022-12-18 at 12.50.25 AM.png]]
		- A' means complement
- Boolean Product of Zero-One Matrices
	- The Boolean product of set $A_{m \text{ x } x}$ and $B_{k \text{ x } n}$ denoted A$\bigodot$ B, is the zero-one matrix $C_{m \text{ x } n}$ where $C_{ij} = (a_{1j} \land b_{j1}) \lor (a_{i2} \land b_{2j})$
	- ![[Screenshot 2022-12-18 at 12.54.28 AM.png]]
		- $\bigodot$ means xnor (both true or both false)
			- ![[Screenshot 2022-12-18 at 12.56.05 AM.png]]