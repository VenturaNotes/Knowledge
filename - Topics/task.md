---
tags:
  - in-progress
---
## Synthesis
- A task is a problem that a machine learning model is designed to solve. 
	- #question Are tasks only for machine learning models or are there other things tasks are for in terms of artificial intelligence
	- #question Is artificial intelligence the umbrella term for machine learning? Where does neural networks fall under this hierarchy? 
- A task defines the objective and type of output expected from a model. Predictions are made based on data which can range from identifying patterns to forecasting future values
	- Examples of problems:
		- Image recognition
			- Identifying objects or people in images such as "Is this a cat or dog?"
		- Spam Detection
			- Classifying emails as spam or not spam.
		- Medical Diagnosis
			- Predicting the likelihood of a disease based on patient symptoms and test results.
		- Financial Forecasting
			- Predicting stock prices or economic indicators.
		- Recommendation Systems
			- Suggesting products or content to users based on their past behavior.
		- #question Of the example problems, could you tell me what kind of model would be best used for each of the examples of above and the equations required?
	- #question Are the problems always just predictions
	- #question Only machine learning models or other types of models? 
	- #question How accurate are machine learning models when it comes to forecasting data? What kinds of forecasting techniques are there? (like time-series data, etc.)
	- #question What kinds of machine learning models are there? 
	- #question What other kinds of models are there aside from machine learning models. 
	- #question What kind of problems would these be? Could you give an example? 
- Examples
	- For classification, the task is to predict a discrete category or class label. This describes the output. The objective for a classification task is to correctly assign an input data point to one of several predefined categories or classes.  The model aims to learn a decision boundary that separates these classes in the feature space.
		- #question What is a decision boundary
		- #question What is the feature space? 
		- #question What is meant by discrete category? Is discrete category a term itself or is "discrete" the term of interest. Is "discrete" category a part of the field of category theory similar to mathematics? 
		- To generalize the objective for supervised learning tasks (like classification and regression), the overarching goal is to learn a function that maps input data (features) to desired output labels (targets) in a way that minimizes a specific error or loss function. This function should be able to generalize well to unseen data.
		- #question But wait, isn't this just the type of output expected from the model? So the prediction is a discrete category but what would the objective be in this case? Is there a way to generalize the objective as well?
	- For regression, the task is to predict a continuous numerical value
		- #question What is the objective?
	- #question Wait, is classification and regression a type of task or what? 
- So here, the task is the specific problem or objective that the supervised learning algorithm is trying to achieve.
## Organize

-   Examples
    -   For regression, the task is to predict a continuous numerical value
        -   **#question What is the objective?**
            The **objective** for a regression task is to predict a continuous numerical value that is as close as possible to the true target value, based on the input features. The model aims to learn the underlying relationship or trend between the input variables and the continuous output variable.

## Source [^1]
- (1) Another name for process. 
- (2) Another name for job.
- When each job consists of only one process, the above difference is not significant. The concurrent execution of a number of tasks is referred to as multitasking. See also PARALLEL PROCESSING.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]