[Video](https://youtube.com/watch?v=_2cKtLkdwnc)

- Construct a DFA that accepts any strings over {a, b} that <mark style="background: #FFF3A3A6;"> does not contain</mark> the string <mark style="background: #FFF3A3A6;">aabb</mark> in it.
	- The [[(2) Finite State Machine (Prerequisites)#^b88921|sequence]] "aabb" should not be accepted.
	- [[(2) Finite State Machine (Prerequisites)#^7c0ff9|Alphabet]]
		- ![[Screenshot 2023-01-05 at 7.59.27 AM.png]]
	- Try to design a simpler problem
	- Let us construct a DFA that accepts all strings over {a, b} that <mark style="background: #FFF3A3A6;">contains</mark> the string <mark style="background: #FFF3A3A6;">aabb</mark> in it
		- ![[Screenshot 2023-01-05 at 8.05.46 AM.png]]
		- After constructing the simplified DFA, you now need to
			- Flip the states
				- Make the final state into non-final state
				- Make the non-final states into final states
			- ![[Screenshot 2023-01-05 at 8.09.07 AM.png]]