---
Source:
  - https://youtube.com/watch?v=tPnjkMx9X74
Reviewed: false
---
 - ![[Screenshot 2024-01-23 at 2.09.32 AM.png]]
	 - Slide 2 - Learning Objectives (for this video)
		 - By the end of this video, participants should be able to:
			 - Evaluate if a [[composition]] of functions is defined
			 - Prove general facts about compositions of functions, from definitions
	 - Slide 3 - Motivation
		 - Motivation
			 - Here we will see how to deal with applying many functions, one after another
			 - We will also see how to take off your socks
	 - Slide 4 - (1) Example
		 - Exercise. Draw the following functions
			 - basic function
			 - scale up by 3
			 - reflect across x-axis
			 - Shift up one
	 - Slide 5 - (1) Example
		 - This function was composed of four simple functions
		 - We performed a, then b, then c, then d
		 - Order matters
			 - Compositions depend on order
- ![[Screenshot 2024-01-23 at 2.18.33 AM.png]]
	- Slide 6 - (2) definition
		- Definition
			- Let f: $A \to B$ and $g: C \to D$ be functions
			- The composition of g with f, denoted $g \circ f: A \to D$ is defined by g $\circ$ f(x) = g(f(x)) for x $\in$ A
		- Warning
			- In order for $g \circ f$ to be defined, we need $g(f(x))$ to always be defined. i.e.
				- ran(f) $\subseteq$ dom(g)
					- All the outputs of f(x) need to be something you're allowed to plug into g
		- Usually we'll actually have codom(f) $\subseteq$ dom(g)
	- Slide 7 - (3) The order of [[Composition|compositions]] really matters
		- $f \circ g$ not possible