[Video](https://youtube.com/watch?v=TpIBUeyOuv8)

## Terms
- Symbol
	- a, b, c, 0, 1, 2, 3, ...
- Alphabet ^7c0ff9
	- $\Sigma$ - Collection of symbols
	- Examples
		- {a, b}, {d, e, f, g}
		- {0, 1, 2}. . .
- String ^b88921
	- Sequence of symbols
	- Examples
		- a, b, 0, 1, aa, bb, ab, ab, 01
- Language ^e0c9c0
	- Set of strings
	- Example
		- $\Sigma$ = {0, 1}
		- $L_1$ = set of all strings of length 2 = {00, 01, 10, 11}
			- Finite set
		- $L_2$ = set of all strings of length 3 = {000, 001, 010, 011, 100, 101, 110, 111}
			- Finite set
		- $L_3$ = set of all strings that begin with 0 = {0, 00, 01, 000, 001, 010, 011, 0000, ....}
			- Infinite set
- Powers of $\Sigma$ 
	- $\Sigma$ = {0, 1}
	- $\Sigma^0$ = set of all strings of length 0 : $\Sigma^0$ = {$\epsilon$}
		- 1 element (cardinality)
	- $\Sigma^1$ = Set of all strings of length 1: $\Sigma^1$ = {0, 1}
		- 2 elements (cardinality)
	- $\Sigma^2$ = set of all strings of length 2: $\Sigma^2$ = {00, 01, 10, 11}
		- 4 elements (cardinality)
	- $\Sigma^3$ = set of all strings of length 3: $\Sigma^3$ = {000, 001, 010, 011, 100, 101, 110, 111}
		- 8 elements (cardinality)
	- $\Sigma^n$ = set of all strings of length n
- Cardinality
	- Number of elements in a set
	- $\Sigma^n$ = $2^n$  (can see example in Powers of $\Sigma$)
- $\Sigma^*$ = $\Sigma^0$ $\cup$ $\Sigma^1$ $\cup$ $\Sigma^2$ $\cup$ $\Sigma^3$ ...
	- = {$\epsilon$} $\cup$ {0, 1} $\cup$ {00, 01, 10, 11} $\cup$ ...
	- = set of all possible strings of all lengths over {0, 1}
		- This is an infinite set