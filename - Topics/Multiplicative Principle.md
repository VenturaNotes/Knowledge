## Synthesis
- 
## Source [^1]
### Description
- If event A can occur in $m$ ways, and each possibility for $A$ allows for exactly $n$ ways for event B, then the event "A and B" can occur in $m*n$ ways
- This principle generalizes to more than two events
- "And" doesn't always mean "times"
### Example
- Given 8 appetizers and 14 entrées, how many choices do you have if you are extra hungry and want to eat both an appetizer and an entrée?
	- #question Does it matter if the word "choices" was used here or "ways"? Does it help specify if it's a combination or permutation type of problem?
	- Could think of this problem has how many [[pair|pairs]] (x, y) there are, where x is an appetizer and y is an entrée
		- Since there are 8 ways to choose an appetizer and 14 ways to choose an entree, there are $8*14 = 112$ choices
	- Using sets, the [[cartesian product]] $A \times B$ is the set of all ordered pairs $(a,b), a \in A \land b \in B$ giving 
		- $|A \times B| = |A| \cdot |B| = 8 \cdot 14 = 112$ 
## References

[^1]: [[(1) Introduction to Counting Using Additive and Multiplicative Principles]]