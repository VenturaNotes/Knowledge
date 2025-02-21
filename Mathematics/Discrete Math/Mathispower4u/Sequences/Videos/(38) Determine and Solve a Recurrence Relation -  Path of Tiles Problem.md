---
Source:
  - https://www.youtube.com/watch?v=zZJjjd2aoIE
Reviewed: false
---
- ![[Screenshot 2025-02-20 at 11.12.02 AM.png]]
	- Sequences: Solving Recurrence Relations
		- You have access to 1x1 tiles which come in 4 different colors and 1x2 tiles which come in 5 different colors. We want to figure out how many different `1xn` path designs we can make out of these tiles
		- (a) Find a recursive definition of the number of paths of length n
			- Each path of length $n$ must either start with one of the 4 `1 x 1` tiles, in each case there are then $a_{n-1}$ ways to finish the path, or start with one of the 5 $1x2$ tiles, in each case there are then $a_{n-2}$ ways to finish the path
			- ![[Screenshot 2025-02-20 at 11.07.30 AM.png]]
				- There are 4 ways to select the color of the 1x1 tile
				- There are 5 ways to select the 1x2 tile OR if you select two 1x1, there are 4 ways to select each tile = $5 + 4*4 = 21$ 
		- (b) Write out the first 6 terms of the sequence $a_1, a_2, a_3, ..., a_6, ...$ 
	- Sequences: Solving Recurrence Relations
		- Write out the first 6 terms of the sequence
	- Sequences: Solving Recurrence Relations
		- Asked to solve the [[recurrence relation]] which means we want to find a closed formula for $a_n$. Can use the [[characteristic root technique]] here
	- Now just solving for $a,b$  