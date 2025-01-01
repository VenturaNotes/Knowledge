---
Source:
  - https://youtu.be/JbbRaiXI6yw
Length: 3 minutes, 59 seconds
tags:
  - status/complete
  - type/video
Reviewed: false
---
- ![[Screenshot 2023-05-28 at 9.19.02 AM.png]]
	- Most of Calculus (Derivatives, Integrals, Infinite Series), are based on limits
	- Idea of limits is that we approach a particular input value
		- As inputs approach the value c, the outputs of our function approach L
			- Useful because sometimes we want to study a function in places where it doesn't exist
				- For example, speed of car is change of displacement over change of time $\frac {\Delta d}{\Delta t}$
					- If we want the speed at a point, the change in distance and time would be 0 and $\frac {0}{0}$ is not helpful which creates a hole in the graph
						- Limits allow us to consider non-zero changes in time and look at what the value approaches as the change in time approaches 0. Therefore, we can get a speed at a point which makes sense
	- To define a limit, we have to think about what it means for a function's output to approach a value L. Therefore, the output should get very close to L
		- Should find a limit around that point if it's truly approaching that value.
	- If the function's output is close to L, the difference between f(x) - L should be small. The magnitude (absolute value) of difference should be small as well
		- For any positive distance ($\varepsilon$) greater than 0, there is an input value (x), such that the distance between f(x) and L has a magnitude less than $\varepsilon$ 
	- [[Epsilon-Delta Limit Definition|Formal Epsilon-Delta Limit Definition]]
		- Because limits are about functions approaching a particular input, we say that for any distance around that limiting value L, we can find a range where every value in that range is closer to L than that $\varepsilon$ 
		- Technical Notation
			- $\forall \varepsilon > 0, \exists \delta > 0 | 0 < |x-c| < \delta \rightarrow |f(x)-L| < \varepsilon$ 