---
Source:
  - https://www.youtube.com/watch?v=z1pwrSUHyHA
Reviewed: false
---
- ![[Screenshot 2025-01-12 at 3.18.56 AM.png]]
	- Stars and Bars
		- A [[multiset]] is a collection of objects, just like a set, but can contain an object more than once (the order of the elements still doesn't matter). For example, {1, 1, 2, 5, 5, 7} is a multiset of size 6
			- (1) How many sets of size 5 can be made using the 10 numeric digits 0 through 9?
				- digits: $\{0, 1, 2, 3, 4, 5, 6, 7, 8, 9\}$
				- Used combination here.
			- (2) How many multisets of size 5 can be made using the 10 numeric digits 0 through 9?
				- Using method of stars and bars here
				- Hint: Use stars and bars and let each star represents one of the 5 elements of the set, each bar represents a switch between digits 0-9
					- Indistinguishable (the 5 element positions) and distinguishable (the 10 possible digits)
						- The number of bars is always one less the number of distinguishable objects because the 9 bars (in this case) represents the 9 switches among the 10 digits
						- When using stars and bars, it's equal to the sum of the stars and bars choose the number of bars.
		- Stars and Bars Counting Method
			- We have two groups of objects, one of which is indistinguishable (the stars) and one that is identifiable (the bars).
			- We have a constraint that needs to be satisfied such as an inequality or a lower bound.
			- We do not care about the order.
			- The number of ways is $stars + bars \choose bars$ 
		- Recall: While a multiset allows an element to be repeated, a [[set]] does not