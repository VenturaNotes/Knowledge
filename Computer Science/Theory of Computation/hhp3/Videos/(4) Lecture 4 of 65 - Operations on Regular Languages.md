---
Source:
  - https://www.youtube.com/watch?v=F-EXmG1-gRQ
Reviewed: false
---
- ![[Screenshot 2023-09-15 at 11.43.55 AM.png]]
	- Operations on Regular Languages
		- [[Regular operations]]
			- [[Union]]
			- [[Concatenation]]
			- [[Star]]
	- Regular Operations on Languages (could do them on 2 languages to come up with another language)
		- [[Union]]
			- $A \cup B$ = {x|x $\in$ A or x $\in$ B}
				- A is a set of strings and B is a set of strings
		- [[Concatenation]]
			- A $\circ$ B = {xy | x $\in$ A and y $\in$ B}
			- Makes more sense for strings
			- $\circ$ is concatenating on languages
				- Set operation that works on a set of strings
			- Taking something with A and concatenating it with something from B
			- First part comes from first language and second part comes from second language
		- [[Star]] (can star a language to get a larger language)
			- $A^*$ = {$x_1x_2...x_k$ | k $\ge$ 0 and each $x_i$ $\in$ A} 
				- If you take a bunch of strings from A, and you glue them together (0 or more strings from A), you'll get a string that's from $A^*$
				- You could get the [[empty string]]
					- It's always in the star (\*)
				- Any sequence of pieces where each piece comes from A. Don't need to be the same but each substring in the element of $A^*$ is itself an element of A 
		- Examples
			- $\Sigma$ = {a, b, c, ... z}
			- A = {aa, b}
			- B = {x, yy}
- ![[Screenshot 2023-09-15 at 11.51.08 AM.png]]
	- [[Closure Properties]]
		- Theorem: The class of Regular Languages is [[closed]] under [[union]] 
			- (if you have two regular languages and use a union operator on them, is the result itself also a regular language?
			- If $L_1$ and $L_2$ are regular languages, then so is $L_1 \cup L_2$ 
			- Similar to saying, [[Integers]] are closed under addition
				- If you take 2 integers and add them together, the thing you get is also an integer
				- Integers not closed under division
		- Proof (by [[Proof by construction|construction]])
			- Assume (since the languages are regular, we know that there must be a finite state machine to recognize them)
				- $L_1 = L(M_1)$
				- $L_2 = L(M_2)$
			- Build M to recognize $L_1 \cup L_2$ 
			- Combine machines (first approach is incorrect because there are 2 edges for "a" and 2 edges for "b")
				- Not an F.S.M
- ![[Screenshot 2023-09-15 at 12.00.59 PM.png]]
	- What about running $M_1$ then trying $M_2$?
		- No! Can't rewind the input!
	- Idea: Simulate $M_1$ and $M_2$ simultaneously. Each state in M corresponds to two states.
		- $M_1  = (Q_1, \Sigma, \delta_1, q_1, F_1)$
		- $M_2 = (Q_2, \Sigma, \delta_2, q_2, F_2)$
	- Construct
		- $M = (Q, \Sigma, \delta, q_0, F)$
	- Assume alphabets are the same
		- Or: $\Sigma$ = $\Sigma_1$ $\cup$ $\Sigma_2$ 
	- Approach:
		- Each state in new machine represents two states
			- One from $M_1$
			- One from $M_2$
		- (lots of possible combinations)
- Image
	- In a combined machine, we need to come up with states that represent both combinations (so all possible combinations)
		- Every state in the combined machine is going to be made from one state of machine 1 and one state from machine 2.
			- Name like X3 or Z6 start to appear
	- Constructing this machine
		- $Q = Q_1 \times Q_2 = \{(r_1, r_2) | r_1 \in Q_1 \text{ and } r_2 \in Q_2\}$
			- Set of states will be constructed of pairs 