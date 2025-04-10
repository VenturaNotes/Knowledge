---
Source:
  - https://www.youtube.com/watch?v=C9DLEHu1l-g
Reviewed: false
---
- ![[Screenshot 2025-01-30 at 5.42.35 AM.png]]
	- We introduced a set $\mathbb{N}_0$ ([[natural numbers]]) whose elements we can use for counting
		- We know that writing down such an expression {0, 1, 2, 3, 4} is not a sufficient definition for natural numbers
		- Writing down properties explicitly that $\mathbb{N}_0$ has
			- (1) $\mathbb{N}_0$ is not empty and it contains a special element we call 0
			- (2) There is a map $\mathbb{N}_0$ $\to$ $\mathbb{N_0}$ which we'll call the [[successor map]]
				- Bears this name because it satisfies the following 3 special properties
					- (2a) The map $s$ is [[injective]]
						- Different natural numbers have different successors
						- Gives us visualization that the natural numbers lie ordered on a straight line
							- Another visualization of successor map is given by arrows left to right
								- We'll see the injectivity and that zero is not hit at all
						- If $s$ were not injective, we'd have loops in the picture
						- 0 is not a successor for any natural number
					- (2b) Will say that 0 is not in the [[range]] of s
						- The [[range]] is just the [[image]] of the whole [[Domain (Math)|domain]], mainly of $\mathbb{N}_0$ 
					- The above two assumptions together explain that $\mathbb{N}_0$ is an infinite set
					- (2c) $\mathbb{N}_0$ is essentially the smallest possible infinite set
						- #question But wouldn't the natural numbers without 0 be considered the smallest possible infinite set?
						- If M is any subset of $\mathbb{N}_0$ with 0 $\in$ M and all successors lie in M again, then with the same picture in mind, M would be an infinite set and therefore it has to be $\mathbb{N}_0$
						- Could describe this in other words. When M describes  some property, then 0 fulfills this property and if an element fulfills the property, the successor satisfies as well. Then the result is that all natural numbers fulfill this property
						- This procedure is known as [[mathematical induction]]
							- Later we will be shown how we can use this to prove a lot of things
	- Now we want to calculate the natural numbers as we already know it
		- Addition in $\mathbb{N}_0$
			- Operation of adding two numbers can be seen as a map from the cartesian product into the natural numbers again.
				- Just combine two natural numbers, and will use `m` and `n` for natural numbers from now on
				- The result that comes out (meaning the natural number which comes out) is denoted with a plus sign between the two inputs
			- How is it defined?: Could define 2 + 4 := 6
				- This would be one way to define a map
				- Just write down all outputs for all possible inputs
				- Not feasible because we have infinitely many inputs and not enough space to write it all down
				- Could maybe work with variables instead
					- m + 0 := m
						- Shouldn't change anything (took care of infinitely many definitions)
					- m + 1
						- On number line, it just means we jump to the next number in order
						- So we jump to the successor of m
						- Could use the map $s$ 
						- Could define $m+1 := s(m)$ 
							- Could define m plus one as $s$ of $m$.
						- m+2 should be the successor of m + 1
						- So the general definition would be $m + s(n) := s(m+n)$ 
							- So we have m plus the successor of n
				- With the formulas below, we have the whole definition for the map.
					- $m + 0 := m$
					- [[recursive definitions|recursive definition]]: $m + s(n) := s(m+n)$
						- This is known as a recursive definition or an inductive definition
						- We have to make sure that such a definition makes sense
							- One can prove this in general by using the property $2c$ from above.  
							- This fact is then known as [[Dedekind's principle of recursive definition]]
								- Won't write down proof but general statement will be given
				- However with the two formulas above, we don't have explicit definition for what $m+n$ is.
					- $2 + 5 = 2 + s(4) = s(2+4) = s(6) = 7$
						- For getting a new result, we have to go backwards until we reach a step where we already know the result
	- Dedekind's principle of recursive definition
		- For any set $A$ and then chose an element $a$ from $A$ and a map $h$ from $A \to A$, then there is a unique definition of what it means applying $h$ as often as you wanted to $a$ 
		- We can give meaning to the progression a, $h(a)$.... and so on
		- To put this in a precise form, we would say there exists a map from the natural numbers into A. We call it $f$ and there is only one such map
			- $f: \mathbb{N}_0$ $\to$ A with $f(0) = a$ and $f(s(n)) = h(f(n))$
		- Often we just read the whole principle backwards
		- This means that if we see something fixed at 0 and defined for the successors, then we know it exists and is uniquely defined by this property. 
		- So therefore, we know that addition is uniquely defined by the two equations written above
			- $m + 0 := m$
			- $m + s(n) := s(m+n)$
		- In the next video, we will talk about all the calculation rules we want for the natural numbers