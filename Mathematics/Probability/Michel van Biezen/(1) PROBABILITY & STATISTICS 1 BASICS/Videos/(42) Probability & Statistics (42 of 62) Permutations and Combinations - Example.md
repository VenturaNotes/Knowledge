---
Source:
  - https://www.youtube.com/watch?v=RV6X8BlO2_Y
Reviewed: false
---
- ![[Screenshot 2024-11-10 at 7.06.30 AM.png]]
	- Permutation or combination?
		- Books, 3-Math, 2-Hist, 4-Bio, Placed on the shelf
			- (a) No restriction
			- (b) All subjects must stay together
				- This means you need to calculate the permutations of $_3P_3$ for math books and make similar calculations for history and biology books. Then you need to multiply by a 4th number to calculate the permutations for the order of math, history, and biology
			- (c) Only bio must stay together
				- Explanation for this is that $_6P_6$ means we have 3 math and 2 history books which can be arranged in any order and then we count the biology books as one group making 6
				- Then we just need to find the permutations of the biology books as they must stay together