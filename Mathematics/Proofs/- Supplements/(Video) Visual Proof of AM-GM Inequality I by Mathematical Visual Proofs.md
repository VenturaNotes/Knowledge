---
Source:
  - https://www.youtube.com/watch?v=62G9fak1vyk
Length: 1 minute, 14 seconds
tags:
  - status/complete
  - type/video
---
- ![[Screenshot 2023-07-30 at 11.20.46 AM.png]]
	- (1) Suppose you start with a y by x rectangle
	- (2) Create 4 copies
		- These 4 copies surround an area of $4xy$
	- (3) Arranging these rectangles in a special way will produce a square of side length $x + y$ with a missing inner square of $y - x$ ^53d3ac
		- Therefore, $4xy = (x+y)^2 - (y-x)^2$
	- (4) The term $(y-x)^2$ is [[nonnegative]] so if we remove that term, we can conclude that $4xy \le (x+y)^2$
	- (5) Taking square root of both sides will obtain the inequality
	- (6) Dividing by 2 will give the [[AM-GM inequality]]
		- $\sqrt{xy} \le \frac {(x + y)}{2}$