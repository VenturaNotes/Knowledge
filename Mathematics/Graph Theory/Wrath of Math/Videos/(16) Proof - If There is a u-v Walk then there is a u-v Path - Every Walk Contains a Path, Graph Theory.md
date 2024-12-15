---
Source:
  - https://youtube.com/watch?v=728bZWwTbf8
---
- ![[Screenshot 2023-06-14 at 4.54.58 AM.png]]
	- If a graph contains a u-v [[Walk|walk]] of length l, then it contains a u-v [[path]] of length at most l, provided u $\ne$ v.
	- A shortest u-v walk should be a path
		- [[Proof by contradiction]]
			- We stated that the walk we made is the shortest walk and therefore has a length of L. We then supposed that it was not a path which must mean there are vertices repeating. If we remove the vertices, then we get a shorter path and therefore the length < k which is a contradiction because the original walk we had was already the shortest. Therefore, the maximum length but be at most "k", or in this case "l"