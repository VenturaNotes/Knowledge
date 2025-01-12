---
Source:
  - https://www.youtube.com/watch?v=mXn9ZNiBV5s
Reviewed: false
---
- ![[Screenshot 2025-01-12 at 4.33.39 AM.png]]
	- Stars and Bars?
		- Suppose you planned on giving 7 gold stars to some of the 13 high achieving students in your class. Each student can receive at most one star. How many ways can you do this?
		- The method of stars and bars is not needed here.
			- Used combination formula for first example
	- Stars and Bars?
		- New we must use PIE to eliminate all distributions in which one or more students gets more than one star
		- $13 \choose 3$
			- number of ways of selecting 3 students in which each will receive 2 stars
		- $13 \choose 12$
			- Number of ways distributing the remainder star to the 13 students.
		- Can stop here as there is no way that 4 students can receive 2 stars as there is only 7 stars to begin with