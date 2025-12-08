## Synthesis
### First Description
- It is a concept used in [[Bayesian inference]] to make data processing more efficient. 
- It's a small weighted subset of data that approximates the full dataset
- It is a small, weighted subset of a large dataset designed to approximate the [[posterior distribution]] of a [[Bayesian model]] as closely as possible. 
	- #question What is posterior distribution?
	- #question What does a Bayesian model look like? 
- Using the coreset helps significantly reduce computational costs while maintaining high fidelity to the original [[posterior]].
	- #question What is a coreset. Difference between regular coreset and bayesian coreset? 
	- #question No idea what posterior means here
	- #question What is meant by "high fidelity?"
#### Example
- [[Bayesian Linear Regression]]
- Suppose you have a dataset $\mathcal{D} = \{(x_i, y_i)\}^N_{i=1}$ where N = 100,000 and you want to perform bayesian linear regression to infer the posterior over model parameters
	- #question What is meant by this dataset?
	- #question Why is the `mathcal` notation used?
	- #question What does posterior over model parameters mean? 
	- #comment Is the dataset saying that we have N points worth of data which each of two components, $(x,y)$? So each one would fit on a coordinate plane?
- Suppose you have a dataset $D={(xi,yi)}i=1N\mathcal{D} = \{(x_i, y_i)\}_{i=1}^ND={(xi​,yi​)}i=1N​,$
- $\mathcal{N}$ 
	- #question I think this symbol wasn't finished. What is it supposed to say?
### Second Description
- It is a small, weighted subset of a larger dataset. Instead of performing [[inference]] (such as [[MCMC sampling]]) on the full dataset which may be computationally expensive, you perform inference on this smaller [[coreset]]. 
## Source[^1]
- It is a small, weighted subset of a data set that replaces the full data during inference to reduce computational cost. 
## References

[^1]: [[(Paper) Tuning-free corset Markov chain Monte Carlo]]
