[Video](https://www.youtube.com/watch?v=YL-NNb4gojA)

- ![[Screenshot 2023-12-28 at 2.23.08 AM.png]]
	- [[Line of best fit]]
		- We could fit a line such that we minimize the sum of distances of each point to the line
			- Vertical or horizontal distance?
			- In this context, will be using $x_i$ to predict $y_i$ so we care about error prediction in the y-direction
	- Fitted value of y is represented by $\overset \wedge y_i$ 
		- $\overset \wedge \alpha$ is the intercept of a line
		- $\overset \wedge \beta$ represents the gradient
	- Need modulus signs
		- Care as much about a point which is below and above a line (don't want in sum for these things to cancel each other out)
		- The modulus function is a nonlinear function though (especially if we want to differentiate it)
		- We care as much about over-predicting as we do for under-predicting
			- Can have this squared: $(y_i - \overset \wedge y_i)^2$ 
	- By squaring it, we don't care about small deviations from the line as we do about big deviations from the line
		- There isn't an equal weighting which is applied to each observation
		- Larger distances takes higher precedence
	- By changing [[cost function]] which we're minimizing to S', that would move line closer to anomalous point
	- Can use modulus function or could minimize the sum of squares by default