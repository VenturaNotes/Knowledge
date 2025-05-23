---
aliases:
  - LLM
---
## Synthesis
- 
## Source [^1]
### Common Challenges
- Computational resources: LLMs require significant computational power and memory, making training and deployment resource-intensive.
	- #question What kind of resources would you need for an LLM? 
	- #question Computational resources are required. What are some examples of computational resources? 
	- #question What is the difference between computational power and computational memory?
	- #question What other things are resource intensive?
- Bias and fairness: LLMs can inadvertently learn and propagate biases present in the training data, leading to unfair or biased outputs.
	- #question Could you give an example of this? 
- Interpretability: Understanding and explaining the decisions made by LLMs can be difficult due to their complex and opaque nature.
	- #question What is complex about an LLM? 
	- #question What exactly is an LLM? 
	- #question What does interpretability mean in terms of LLMs? 
	- #question Is it difficult to understand because it is like a black box? 
- Data privacy: Using large datasets for training can raise concerns about data privacy and security.
	- #question How are the large datasets retrieved?
	- #question How could we lawfully obtain a dataset?
	- #question I understand that there are different licenses for different things. How would we determine if it's legal to use or not such as a commercial license or an MIT license? 
- Cost: The development, training, and deployment of LLMs can be expensive, limiting their accessibility for smaller organizations.
	- #question What is meant by development in this case? 
	- #question Instead of "accessibility", don't you 
	- #question How much could it cost for a company to develop, train, and deploy an LLM?
	- #question Couldn't smaller organization access LLMs developed by larger organizations? 
	- #question How large does an organization need to be so that cost does not become a problem?

## Source[^2]
- Training an LLM involves feeding it massive amounts of text data and adjusting its parameters using optimization algorithms (like stochastic gradient descent). This is done in several phases, often starting with pretraining on general data and then fine-tuning on task-specific datasets.
	- #question Does an LLM only take in text data?
	- #question How is an LLM "fed"? 
	- #question What kinds of optimization algorithms are there?
	- #question How does stochastic gradient descent work?
	- #question What is pretraining
	- #question What is a task-specific dataset? 
	- #question How many phases are there and how would this work?
	- #question What is meant by parameters?
	- #question What is meant by general data? 
	- #question How would you fine-tune? 
- Deployment an LLM involves making the model accessible through an interface (like an API) so users or systems can interact with it. This requires serving infrastructure (often cloud-based), optimized models (e.g., quantized or pruned), and possibly scaling techniques like load balancing and model sharding.
	- #question What other interfaces could you make it accessible? 
	- #question What is meant by "model" here? 
	- #question What is meant by "users or systems" could interact with it? 
	- #question What is meant by infrastructure here?
	- #question What is cloud-based infrastructure
	- #question What kind of optimized models are there?
	- #question What is a quantized model?
	- #question What is a pruned model? 
	- #question What is load balancing
	- #question What is model sharding
- Resources needed for an LLM
	- [[GPUs]] or [[Tensor Processing Unit|TPUs]] for training and inference
		- #question What is meant by training
		- #question What is meant by inference
		- #question What is a GPU
		- #question What is a TPU
	- Large-scale memory ([[RAM]] and VRAM)
		- #question What is RAM
		- #question What is VRAM
		- #question What is meant by large-scale memory? 


## References

[^1]: https://www.datacamp.com/blog/llm-interview-questions
[^2]: ChatGPT