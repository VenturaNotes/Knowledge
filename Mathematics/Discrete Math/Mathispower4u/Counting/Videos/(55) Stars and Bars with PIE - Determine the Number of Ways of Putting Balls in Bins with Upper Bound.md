---
Source:
  - https://www.youtube.com/watch?v=Uq1o9ba6bag
Reviewed: false
---
- ![[Screenshot 2025-01-12 at 4.27.57 AM.png]]
	- Stars and Bars with PIE
		- After gym class you are tasked with putting 14 identical balls away into 5 bins. How many ways can you complete the task with no restrictions?
		- How many ways can you complete the task if no bin can hold more than 6 balls?
			- We need to use the principle of inclusion/exclusion. We need to subtract the ways that have more than 6 balls in each bin from the number of ways with no restrictions. We know there are $18 \choose 4$ ways with no restrictions. 
			- We start by subtracting the number of ways at least one bin has at least 7 balls. We lose 7 balls or 7 stars.
	- Stars and Bars with PIE
		- The red combination is the number of ways that we can choose 1 bin from 5. The blue combination represents the number of ways of distributing the remaining 7 balls in the 5 bins. But now we subtracted too much. We need to add back the number of ways in which at least 2 bins have at least 7 balls. We lose 14 balls or 14 stars.
		- The red combination is the number of ways that we can choose 2 bins from 5. The blue combination represents the number of ways of distributing the remaining 0 balls in the 5 bins. We are now done since it is not possible to have 7 balls in at least 3 bins since there are only 14 balls. 