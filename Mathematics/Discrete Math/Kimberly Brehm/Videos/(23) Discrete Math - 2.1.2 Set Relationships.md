---
Source:
  - https://youtube.com/watch?v=FySFFWUU0OQ
Reviewed: false
---
- Set Equality
	- Sets are equal iff they have the same elements.
		- $\forall x (x \in A \iff x \in B)$ 
	- Notation: A = B
		- A = {0, 1, 1, 3, 4, 4}
		- B = {0, 1, 3, 5}
		- A = B
			- Doesn't matter order or duplicates
			- If B included 5, A $\not =$ B
- Subsets
	- A subset A is a subset of B iff every element of A is also an element of B.
		- $\forall x (x \in A \implies x \in B)$
			- If x is an element of A, then x is an element of B
		- ![[Screenshot 2022-12-17 at 8.37.31 PM.png]]
	- Show A $\subseteq$ B
		- Show every element of A belongs to B if x $\in$ A then x $\in$ B
	- Show A $\not \subseteq$ B
		- $\exists x \in A \implies x \notin B$ 
			- Shows x belongs to A but not set B
	- Show A $\subseteq$ B and B$\subseteq$ A
		- A = B
- Proper subsets
	- ![[Screenshot 2022-12-17 at 8.42.05 PM.png]]
		- If A $\subseteq$ B but A $\not =$ B, meaning B contains an element not contained in A, then A is a proper subset of B.
			- $\forall x (x \in A \implies x \in B) \land \exists x (x \in B \land x \notin A)$
- Cardinality
	- The number of distinct elements of a set
	- ![[Screenshot 2022-12-17 at 8.42.38 PM.png]]
- Power Sets
	- The set of all subsets of a set
	- ![[Screenshot 2022-12-17 at 8.43.05 PM.png]]
	- Cardinality of power set of a set with n elements is $2^n$ 
- Tuples
	- An ordered n-tuple is an ordered collection that has $a_1$ as its first element, $a_2$ as its second and so on until $a_n$ 
	- Notation
		- ![[Screenshot 2022-12-17 at 8.47.42 PM.png]]
	- Ordered pairs
		- ![[Screenshot 2022-12-17 at 8.47.53 PM.png]]
- Cartesian Product
	- The set of ordered pairs (a, b) where a $\in$ A and b $\in$ B, resulting from AxB
	- ![[Screenshot 2022-12-17 at 8.49.21 PM.png]]
		- The R is a relation to AxB because it is a subset of that cartesian product
- Truth Sets and Quantifiers
	- A [[truth set]] of P is the set of elements x in D such that P(x) is true
	- ![[Screenshot 2022-12-17 at 8.50.05 PM.png]]