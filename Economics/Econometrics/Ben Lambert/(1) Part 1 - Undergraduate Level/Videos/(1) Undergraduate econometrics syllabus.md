[Video](https://www.youtube.com/watch?v=M_5SLG7sUa0)

- ![[Screenshot 2023-09-22 at 4.26.32 AM.png]]
	- [[Population (Statistics)]]
		- In population, there might be countries, individuals, firms
		- Don't have the whole population data set. Just a [[sample]] (sample data set) from the population
	- Want to use some sort of mathematical tool on the sample to make an inference about what is going on in the population (or make an estimation on a [[population parameter]])
	- There may be a relationship between wage and level of education of an individual
		- The coefficient $\beta$ might represent one-year extra of education on wages
			- $\beta$ would be the average effect of one year of education on wages within the population
	- Want to use tool to find $\beta$ 
	- When talking about [[estimation techniques]], will first start talking about [[cross-sectional data]]
		- Might be when we have the level of wages and the level of education for a set of individuals at one point in time
		- A tool called [[ordinary least squares]] happens to be a good tool to use on a sample
			- It happens to be what we call [[BLUE]] (meaning it's the best linear unbiased estimator possible)
		- Set of criteria that needs to be fulfilled are called the [[Gauss-Markov assumptions]]
			- If each is satisfied, then OLS are a useful thing to use on sample
		- To test the certain criteria, need a set called [[diagnostic tests]]
			- Enable us to test on whether it's the case these criteria are satisfied
			- If each criteria is satisfied, we can use OLS on sample and enable good estimate on population parameters
		- If diagnostic tests not satisfied, OLS would be no longer BLUE
			- We'd need to define a new set of [[estimators]], may not be BLUE but may posses some other sort of good property which an estimator might have (in particular [[consistent]])
			- In less constrictive assumptions, they may be BLUE or consistent
	- More [[estimators]]
		- [[Instrumental variables]]
		- [[GLS]] estimators
		- [[maximum likelihood]] (ML) estimators
		- Might talk about [[GMM]]
	- Second part of course will be more concerned with [[time series]] data
		- Example is a given company's level of sales across time
			- Might look at [[gross domestic product|GDP]]
		- Time series more in the realm of [[macroeconometrics]] than [[microeconometrics]] (which is where cross-sectional data is mainly concerned)
		- Will talk about what it means for time series to be [[stationary]]
		- Will discuss examples of time series
			- [[autoregressive]] of order one AR(1)
			- [[moving average]] of order one MA(1)
	- Final part will be about [[panel data]] methods
		- What if we have the same individual's data across time?
			- Might have their wage in 2010 and 2011
	- For panel data and time series data, we need to modify the Gauss-Markov assumptions slightly (to take into account that the data is [[correlated]] across time (no longer [[independent]]))
		- Will amend the Gauss-Markov conditions
		- Won't talk about population data anymore
		- Will talk more about a data generating process
			- Can't think about a sample of data as taken from an infinite amount of time
			- Need to think of some kind of data generating process which is generating samples at different points in time
			- So doesn't make sense to talk about populations when discussing time series and panel data
	- For panel data, will discuss
		- [[between estimator]]
		- [[within estimator]]
		- [[fixed effects]]
		- [[random effects]]