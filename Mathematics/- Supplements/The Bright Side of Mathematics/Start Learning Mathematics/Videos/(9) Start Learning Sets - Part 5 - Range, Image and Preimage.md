---
Source:
  - https://www.youtube.com/watch?v=twBYYTJdcjc
Reviewed: false
---
- ![[Screenshot 2023-10-16 at 7.25.06 PM.png]]
	- [[Map]]
		- We defined the map as a special relation between two sets and we can write it as an assignment from A $\to$ B
			- "A into B"
			- A is the [[Domain (Math)|domain]] of the map f
				- B is the [[codomain]]
	- Example
		- f: $\mathbb{N} \to \mathbb{Z}$
			- This arrow is used for [[set|sets]]
		- $x \mapsto x^2$ 
			- This arrow is used for [[members|elements]]
			- New notation for $f(x) = x^2$
	- Limits of visualization is that you can't draw all the arrows since we could have infinitely many of them
		- We see immediately that we don't hit all the points in the [[codomain]]
		- Therefore, it makes sense to introduce a new set that consists of all the element we actually hit
			- [[range]] of the map
				- Ran(f)
	- The [[real numbers]] are just a one-dimensional [[number line]]
	- $\mathbb{R} \times \mathbb{R}$ is a two-dimensional plane
		- Fixing one point in the plane will give an element in the domain and then we map it to the right-hand side by using the $x_1^2 + x_2^2$ formula
			- Connected to [[pythagorean theorem]]
			- Radius squared will give exactly that number
			- Different radii gives different numbers on right-hand side
				- Therefore, the whole range would be the half-line
- ![[Screenshot 2023-10-16 at 7.39.12 PM.png]]
	- [[Image]] and [[preimage]]
		- The [[range]] of f are all the points of B that we hit with "f"
	- What are the points that we hit with a given set of points on the left-hand-side
		- Call this subset in A to be $\overset {\sim}{A}$ 
		- The subset we hit on the right-hand side is called the [[image]]  of $\overset {\sim}{A}$ 
			- Notation used for this subset is $\overset \sim A: f[\overset \sim A]$ 
				- Using brackets to remind you we have a whole set and not just an element "f(x)"
				- Unfortunately, parenthesis are used in the notation. Since it can lead to confusion, lecturer will just use brackets
	- Equation shown denotes the image of $\overset \sim A$ under f
	- For the [[preimage]], need to go the other way around
		- Will fix set $\overset \sim B$ on right-hand side
			- When going to left-hand side, will look for which possible inputs are mapped into the set $\overset \sim B$ 
				- All the inputs together form a subset in A called the preimage of $\overset \sim B$ 
		- For $\overset \sim B \subseteq B$, 
			- $f^{-1}[\overset \sim B] := \{x \in A | f(x) \in \overset \sim B\}$ 
				- The $f^{-1}$ is just a reminder that the input set lies on the right-hand side
- ![[Screenshot 2023-10-16 at 7.45.56 PM.png]]
	- Example: f : $\mathbb{N}$ $\to$ $\mathbb{Z}$ 
		- [[Domain (Math)|domain]] is $\mathbb{N}$
		- [[Codomain]] is $\mathbb{Z}$ 
	- We want to calculate the [[image]] of the set 2, 3, 4 on the f and the [[preimage]] of the set that only contains 0 on the f
		- $f[\{2, 3, 4\}]$  = {0, 3}
			- Here, the image set is finished
		- $f^{-1}[\{0\}]$= {2, 4, 6, 8, 10, ...}
			- Know this by definition (even natural numbers)