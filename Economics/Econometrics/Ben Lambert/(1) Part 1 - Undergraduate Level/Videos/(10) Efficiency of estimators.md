---
Source:
  - https://www.youtube.com/watch?v=_iR4uG8MVpA
Reviewed: false
---
- ![[Screenshot 2023-12-28 at 1.46.35 AM.png]]
	- [[Efficiency]] of estimators
		- [[Frequency distribution]] of estimator
			- Let's say we had an [[unbiased]] estimator (centered around true population parameter)
				- Expectation of estimator = population parameter
				- $E[\overset \wedge \beta]= \beta^P$ 
			- Let's say we have another estimator that uses the same sample size and yet it outputs a range of values for $\beta$ and P which are closer to the population parameter
				- Let's call this estimator $\overset \sim \beta$ 
			- In this case $\overset \sim \beta$ is more efficient than $\overset \wedge \beta$ 
				- Not only is it more efficient. It is also unbiased
			- Applying $\overset \sim \beta$ to a given sample, there is a higher probability we'd get a value of the population parameter which was closer to the actual population parameter
			- However, a given estimator may be more efficient than $\overset \wedge \beta$  as it may have a smaller range of values which it will likely output, it might be slightly biased (right image)
				- Need to look at tradeoff between efficiency and unbiasedness or efficiency and consistency