---
Source:
  - https://www.youtube.com/watch?v=QF-13ct4S1A
Reviewed: false
---
- ![[Screenshot 2025-01-12 at 4.21.43 AM.png]]
	- Stars and Bars with Principle of Inclusion/Exclusion
		- How many meals can you buy with $10 if there are 7-dollar menu items if:
			- (a) You can skip items?
			- (b) You buy at least one of every item?
			- (c) You don't get more than two of any items?
				- We need to use the principle of inclusion/exclusion. We need to subtract the outcomes that have at least 3 repetitions of the same item from the number of meals with no restrictions. We know from (a) there are $16 \choose 6$ meals with no restrictions
				- We start by subtracting all the possible ways in which at least one item can be purchased at least 3 times. We lose $3 or3 stars
				- The red part is the number of ways that we can choose 1 of the 7 items to be purchased 3 times. The blue combinations represents the number of meals with $7 and 7 menu items. The above result subtracts too many things. It does not differentiate among scenarios where two or more items are purchased at least 3 times. We need to add the possible ways at least 2 items can be purchased at least 3 times. We lose $6 or 6 stars
				- The red part is the number of ways that we can choose 2 of the 7 items to be purchased 3 times. The blue combinations represents the number of meals with $4 and 7 menu items. We are now counting too many things, and we need to subtract all the possible ways in which 3 items can be purchased at least 3 times. We lose $9 or 9 stars.
- ![[Screenshot 2025-01-12 at 4.23.03 AM.png]]
	- Stars and Bars with Principle of Inclusion / Exclusion
		- The red part is the number of ways that we can choose 3 of the 7 items to be purchased 3 times. The blue combinations represents the number of meals with $1 and 7 menu items
		- We are now done. It is not possible to purchase at least 4 items three times
			- 161 meals