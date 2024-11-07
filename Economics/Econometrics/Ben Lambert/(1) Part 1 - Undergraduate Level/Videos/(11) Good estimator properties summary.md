[Video](https://www.youtube.com/watch?v=uh4zUdKvxPA)

- ![[Screenshot 2023-12-28 at 2.06.13 AM.png]]
	- [[Estimator]]
		- [[Unbiased]]: $E(\overset \wedge \beta) = \beta^P$ 
			- Our expectation of estimator is the true population value. Frequency distribution of our estimator is centered around the population value
		- [[Consistency]] As n $\to$ $\infty$, $\overset \wedge \beta \to \beta^P$ 
			- As sample size tends to infinity, our estimator tends to output estimate for population parameter which ends up equaling the population parameter
		- Efficient
		- Linear in parameters
			- Will speak of this more in context of regression models
				- We want our estimator ($\overset \wedge \beta$) to be a linear function in parameters of the sample data
			- Ensures estimator is easy to manipulate mathematically
				- Doesn't take much computer power to output an estimate of the population parameter