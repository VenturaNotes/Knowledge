[Video](https://youtube.com/watch?v=muiC-Gk9zFc)

- ![[Pasted image 20230604200012.png]]
	- Could separate S into even and odd elements
		- P is considered to be a partition of S
	- [[Partition]]
		- (1) Collection of nonempty subsets of S
		- (2) Every element of S is in exactly one element of P
		- Could call elements <mark style="background: #FFF3A3A6;">groups</mark> of a partition or <mark style="background: #FFF3A3A6;">parts</mark> of partition
	- Given S = {1, 2, 3}
		- <mark style="background: #FFF3A3A6;">Invalid partitions of S</mark>
			- {{1}, {2}, {}}
				- Contains an empty set
			- {{1}, {2}}
				- Element 3 not in any element of this set
			- {{1, 3}, {2, 3}}
				- element 3 in two parts of the set
			- {{1}, {3}, {2, 4}}
				- Not a subset of S
		- <mark style="background: #FFF3A3A6;">Valid Partitions of S</mark>
			- {{1, 3}, {2}}
			- {{1}, {2}, {3}}
			- {{1, 2, 3}}
- ![[Screenshot 2023-06-04 at 8.02.12 PM.png]]
	- A partition P, of a set S, is a collection of non-empty subsets of S such that every element of S is in exactly one of the subsets in P.