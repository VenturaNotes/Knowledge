---
Source:
  - https://www.coursera.org/learn/machine-learning/lecture/s91wX/supervised-learning-part-1
Reviewed: false
---
- 99 percent of economic value created by machine learning today is through one type of machine learning: supervised learning.
- Supervised learning
	- ![[Screenshot 2022-12-24 at 4.30.08 AM.png]]
		- refers to algorithms that learn x to y
		- or input to output mappings
	- key characteristic
		- give learning algorithm examples to learn from (which includes the "right answers")
			- meaning the correct label y for a given input x
		- by seeing correct pairs of input x and desired output label y that the learning algorithm eventually learns to just take the input alone without the output label and gives a reasonably accurate prediction or guess of the output
- Examples
| Input (X)         | Output(Y)              | Application         |
| ----------------- | ---------------------- | ------------------- |
| email             | spam? (0/1)            | spam filtering      |
| audio             | text transcripts       | speech recognition  |
| English           | Spanish                | machine translation |
| ad, user info     | click? (0/1)           | online advertising  |
| image, radar info | position of other cars | self-driving car    |
| image of phone    | defect? (0/1)          | visual inspection                    |
- In all of these applications, you will first train your model with examples of inputs x and the right answers that is the labels y. After the model learns from the input, outputs (or x and y pairs), it can take a new input x (something it's never seen before), and try to produce the appropriate corresponding output y
- Example
	- ![[Screenshot 2022-12-24 at 4.42.48 AM.png]]
		- Predict housing prices based on size of house
		- Collected data and plotted it
		- Horizontal axis (house size in feet$^2$ )
		- Vertical axis (price of house in thousands of dollars)
		- Price of 750 square foot house?
		- Learning algorithm could read a straight line on the data and find that his house could be sold for $150k
	- ![[Screenshot 2022-12-24 at 4.44.36 AM.png]]
		- Fitting a straight line isn't the only learning algorithm we can use
		- Perhaps a fit curve might be better (a more complex function)
		- Using a curved line, it'll show that our friends' house could be sold closer to $200,000
	- Will learn how to fit a straight line, a curve, or another function that is even more complex to the data
	- We can get an algorithm to systematically choose the most appropriate line, curve, or other thing to fit this data
	- This is supervised learning because we gave algorithm a dataset which the "right answer" (label or correct price y) is given for every house on the plot
		- Task of learning algorithm is to produce more of these right answers
		- Specifically, predicting what is the likely price for other houses like your friend's house.
	- This housing price prediction is the type of supervised learning called regression
		- Regression
			- Predict a number from infinitely many possible numbers (outputs), such as the house prices from 70,000 or 183,000 or any # in between
- Supervised learning recapped
	- Learning input to output or x to y mappings
	- We saw in this video regression where the task is to predict the number
	- Second type major type of supervised learning problem called classification