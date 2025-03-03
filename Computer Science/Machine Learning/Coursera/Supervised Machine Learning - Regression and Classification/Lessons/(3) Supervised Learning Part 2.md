---
Source:
  - https://www.coursera.org/learn/machine-learning/lecture/Q8Vvp/supervised-learning-part-2
Reviewed: false
---
- Supervised learning algorithms learn to predict input, output or X to Y mapping.
	- Regression algorithms learns to predict numbers out of infinitely many possible numbers
- Classification problem
	- Classification: Breast cancer detection
	- Building a machine learning system so that doctors have a diagnostic tool to detect breast cancer.
		- early detection could save a patient's life
		- using patient's medical records machine learning system can try to figure out if a tumor (a lump) is malignant (cancerous/dangerous) or of tumor/lump is benign (lump not cancerous or dangerous).
	- Let's say dataset has tumors of various sizes
		- These tumors are labeled as benign (0) or malignant (1). These numbers are just used to designate the type of lump from the data
		- ![[Screenshot 2022-12-24 at 5.01.53 AM.png]]
	- Then plot data on graph
		- horizontal axis represents size of tumor
		- vertical axis takes on 2 values 0 or 1.
		- ![[Screenshot 2022-12-24 at 5.02.09 AM.png]]
	- This is different from regression because we're only trying to predict a small # of possible outputs or categories. 2 possible outputs are 0 or 1 (benign or malignant)
		- different from regression which tries to predict any number all of the infinitely many number of possible numbers
		- Two possible outputs makes this classification
			- Since only 2 outputs/categories, can also plot dataset on line. Using 2 different symbols to denote category. Circle is benign and cross is malignant example
			- If you have a new patient, will your system classify this tumor as benign or malignant?
				- ![[Screenshot 2022-12-24 at 5.02.30 AM.png]]
		- In classification problems, you can have more than 2 output categories. Learning algorithm can output multiple types of cancer diagnosis if it turns out to be malignant
			- Let's have 2 different types of cancers
				- malignant type 1
				- malignant type 2
				- ![[Screenshot 2022-12-24 at 5.06.38 AM.png]]
			- In this case, there are three possible outputs categories
		- In classification, output classes and output categories are used interchangeably
- Classification algorithms predict categories. Categories don't have to be numbers. Could be non-numeric. Could predict if a picture is a cat or dog. Could predict if a tumor is benign or malignant
	- Categories could be numbers like 0, 1, or 2.
- Classifications predicts a small number of possible outputs
	- not all possible numbers in between such as 0.5 or 1.7
- Two or more 
	- ![[Screenshot 2022-12-24 at 5.08.31 AM.png]]
	- Only had 1 input value (size of tumor) in example
	- can use more than 1 input value to predict an output
	- We could have tumor size and age in years
		- age
		- tumor size
	- Plotting dataset, we could use circles that show patients with tumors benign and malignant with croses
	- Record patient's tumor size and age
	- Learning algorithm might find boundary that separates malignant tumors from benign ones. Boundary line found will help doctor with diagnosis. In this case, tumor more likely to be benign.
		- Many more input values are required like thickness of tumor clump, uniformity of the cell size, uniformity of the cell shape and so on
- Recap
	- Supervised Learning (maps input x to output y)
		- Learns from being given "right answers"
		- Types
			- Regression
				- Predict a number
				- infinitely many possible outputs
			- Classification
				- predict categories
				- small number of possible outputs
- Second major type of machine learning called unsupervised learning
- Question: Supervised learning is when we give our learning algorithm the right answer _y_  for each example to learn from.  Which is an example of supervised learning?
	- Answer: spam filtering
		- For instance, emails labeled as "spam" or "not spam" are examples used for training a supervised learning algorithm. The trained algorithm will then be able to predict with some degree of accuracy whether an unseen email is spam or not.