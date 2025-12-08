## Synthesis
- Coreset (short for "core of a dataset") is a small, representative subset of a larger dataset, sometimes with associated weights that approximates a key objective function or property of the original dataset
	- #question What would be an example of a key objective function?
- The main purpose of a coreset is to significantly reduce computational complexity while maintaining high accuracy on a given problem. 
- The goal is to replace a large original dataset with the small coreset for tasks like optimization or inference
- A [[bayesian coreset]] is a specific type of coreset designed for bayesian inference problems. 
### How Coresets Work
- It's constructed in a way that solving a problem on it yields a result that is provably close to the result you would get from solving the problem on the entire dataset.
	- In clustering for example, a coreset will allow you to find nearly the same optimal clusters as the full data, but much faster. 
## Source [^1]
- 
## References

[^1]: 