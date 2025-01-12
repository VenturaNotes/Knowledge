---
Source:
  - https://www.coursera.org/learn/machine-learning/lecture/1ACA2/linear-regression-model-part-1
Reviewed: false
---
- Linear regression model
	- Fitting a straight line to data (most widely used learning algorithm used today)


## Problem
- ![[Screenshot 2022-12-27 at 1.54.42 AM.png]]
- Predict price of house based on size of house
- Use a dataset for house size and prices in Portland
	- x-axis is size of house in feet
	- y-axis is price of houses in 1000s
- Each datapoint is house with size and price that's been recently sold for
- When helping a client sell a house
	- dataset might help estimate price for house
	- Find out her house is 1250 square feet
	- Can build a linear regression model from dataset
	- Model will fit straight line to data
	- Can see that it will intersect the best fit line at around 220k dollars
- This is an example of a supervised learning model (because data has right answers)
- Called a "regression model" because "predicts numbers" in output
	- Addressing a regression problem
	- There are other models to address regression problems as well
- Other type of supervised learning model is called a classification model
	- predicts categories such as if a picture of a cat or dog
	- or if a patient has a particular disease
- Classification vs regression
	- Classification has small number of possible outputs. 2 outputs for cats vs dogs
		- Or recognize of 10 possible medical conditions in patients
		- Gives a discrete, finite set of possible outputs
	- Regression
		- infinitely many possible numbers that the model can output

## Visualization
- ![[Screenshot 2022-12-27 at 2.02.06 AM.png]]
- Instead of making a plot, you could create a data table
- Data comprises of inputs (size of house) and outputs that we're trying to predict (price in $1000's)
- If you have 47 rows, you'd have 47 crosses

## Terminology
- ![[Screenshot 2022-12-27 at 2.10.36 AM.png]]
- Training Set
	- Data used to train the model
	- Train model to learn from the training set and that model can then predict client's houses price
- Notation
	- $x$ = "input" variable
		- feature 
		- input feature
		- Example
			- For first house in training set, x is the size of the house so x = 2,104.
	- $y$ = "output" variable
		- "target" variable
	- $m$ = number of training examples
	- (x ,y) = single training example
	- $x^i, y^i$ 
		- $i^{th}$ training example
			- (1st, 2nd, 3rd)
		- The $i^{th}$ represents the row
		- The "i" is an index of the training set
