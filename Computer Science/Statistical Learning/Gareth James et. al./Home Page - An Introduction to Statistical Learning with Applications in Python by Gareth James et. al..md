---
Source:
  - zotero://open-pdf/library/items/MGG794JE?page=3&annotation=CTI8VXCC
Length: "613"
tags:
  - type/textbook
  - status/incomplete
Reviewed: false
---
## Preface
- “[[Statistical learning]] refers to a set of tools for making sense of complex datasets.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=3&annotation=5T68RQNW))
- “One of the first books on statistical learning — The Elements of Statistical Learning (ESL, by Hastie, Tibshirani, and Friedman) — was published in 2001, with a second edition in 2009.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=3&annotation=8D8XESS5)) #resource
	- “ESL is best-suited for individuals with advanced training in the mathematical sciences” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=3&annotation=3DZC2MG9))
- “Hence, this book, An Introduction to Statistical Learning, With Applications in Python (ISLP), covers the same materials as ISLR but with labs implemented in Python — a feat accomplished by the addition of a new co-author, [[Jonathan Taylor]].” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=4&annotation=HL6RZEWM))
	- Originally the programming language "R" was the go-to 
- “[[ISLP Python package]], which we have written to facilitate carrying out the statistical learning methods covered in each chapter in Python.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=4&annotation=HY53TCQN))
- “appropriate for advanced undergraduates or master’s students in statistics or related quantitative fields” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=4&annotation=64KGUDQ6))
	- “It can be used as a textbook for a course spanning two semesters.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=4&annotation=PVCBCI7C))
## (1) Introduction
### (1.1) An Overview of Statistical Learning
- “[[Statistical learning]] refers to a vast set of tools for understanding data.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=12&annotation=739KYYRM))
	- Tools can be classified as [[supervised]] or [[unsupervised]]
- “Broadly speaking, [[supervised statistical learning]] involves building a statistical model for predicting, or estimating, an output based on one or more inputs.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=12&annotation=X6DXG2RF))
	- Problems of this nature occur in fields as diverse as [[business]], [[medicine]], [[astrophysics]], and [[public policy]]
- “With [[unsupervised statistical learning]], there are inputs but no supervising output; nevertheless we can learn relationships and structure from such data.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=12&annotation=KLMSV8ME))
	- #question What is a supervising output?
### (1.2) Wage Data
- “wish to understand the association between an employee’s age and education, as well as the calendar year, on his wage.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=12&annotation=K8HKTZ9I))
- “age alone is unlikely to provide an accurate prediction of a particular man’s wage.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=12&annotation=663QN4YE))
- “[[Boxplots]] displaying wage as a function of education, with 1 indicating the lowest level (no high school diploma) and 5 the highest level (an advanced graduate degree). On average, wage increases with the level of education.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=13&annotation=PAEW3K4X))
	- #comment An advanced graduate degree is master's degree and above
- “Wages are also typically greater for individuals with higher education levels: men with the lowest education level (1) tend to have substantially lower wages than those with the highest education level (5).” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=13&annotation=IRPKPUMF))
- “most accurate prediction of a given man’s wage will be obtained by combining his age, his education, and the year” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=13&annotation=QI8RNXN9))
	- Could use linear regression for this to predict wage from data set
- “Ideally, we should predict wage in a way that accounts for the non-linear relationship between wage and age.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=13&annotation=AMGPJAXD))

### (1.3) Stock Market Data
- “The Wage data involves predicting a [[continuous]] or [[quantitative]] output value.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=13&annotation=A6BBISHW))
	- Often referred to as a [[regression]] problem
- “However, in certain cases we may instead wish to predict a non-numerical value—that is, a [[categorical]] or [[qualitative]] output.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=13&annotation=3JH3WJSQ))
- “Standard & Poor’s 500 ([[Standard & Poor’s|S&P]]) stock index over a 5-year period between 2001 and 2005.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=13&annotation=VUFHPYUE))
	- Will be referred to as `Smarket` data
	- “goal is to predict whether the [[index]] will increase or decrease on a given day, using the past 5 days’ percentage changes in the index.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=13&annotation=R9N59WXC))
		- #comment I actually made a program similar to this
	- Prediction will not find a numerical value but whether it will increase or decrease.
		- This is known as a [[classification]] problem
- “The two plots look almost identical, suggesting that there is no simple strategy for using yesterday’s movement in the S&P to predict today’s returns.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=14&annotation=MB23NXTW))
- “Interestingly, there are hints of some weak trends in the data that suggest that, at least for this 5-year period, it is possible to correctly predict the direction of movement in the market approximately 60% of the time” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=14&annotation=5M542CU7))
- “We fit a [[quadratic discriminant analysis model]] to the subset of the Smarket data corresponding to the 2001–2004 time period,” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=15&annotation=9FD7F7JB))
	- “able to correctly predict the direction of movement in the market 60% of the time.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=15&annotation=V2DDG234)) for 2005 data.

### (1.4) Gene Expression Data
- Previous data sets have both input and output variables
- “another important class of problems involves situations in which we only observe input variables, with no corresponding output.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=14&annotation=9JQSN9R9))
- “in a marketing setting, we might have demographic information for a number of current or potential customers” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=14&annotation=EBP6W4EE))
	- “may wish to understand which types of customers are similar to each other by grouping individuals according to their observed characteristics.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=14&annotation=6HJ84N79))
	- This is known as a [[clustering]] problem
		- Not trying to predict an output variable in this case.
- Given the `NCI60` data set, which consists of 6,830 [[gene expression]] measurements for each of 64 cancer cell lines. #question what is a cell line?
	- “interested in determining whether there are groups, or clusters, among the cell lines based on their gene expression measurements.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=15&annotation=BBXZUDWX))
	- “difficult question to address, in part because there are thousands of gene expression measurements per cell line, making it hard to visualize the data.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=15&annotation=J7Y68BQ6))
- ![[Screenshot 2024-09-20 at 2.13.22 AM.png]]
	- Each point corresponds to one of the 64 cell lines in a two-dimensional space, $Z_1 \text{ and } Z_2$. For the left, there appears to be four groups of cell lines, which we have represented using different colors
	- $Z_1 \text{ and } Z_2$
		- “These are the first two [[principal components]] of the data, which summarize the 6,830 expression measurements for each cell line down to two numbers or dimensions.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=15&annotation=V8NNZ3G2))
			- This [[dimension reduction]] may have resulted in some loss of information, but it is now possible to visually examine the data for evidence of clustering.
	- Right graph is similar to left but we have represented each of the 14 different types of [[cancer]] using a different colored symbol
		- #question what are the 14 different types of cancer?
		- “Cell lines corresponding to the same cancer type tend to be nearby in the two-dimensional space.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=16&annotation=PZC7B8JZ))
	- “even though the cancer information was not used to produce the left-hand panel, the clustering obtained does bear some resemblance to some of the actual cancer types observed in the right-hand panel. This provides some independent verification of the accuracy of our clustering analysis.” ([pdf](zotero://open-pdf/library/items/MGG794JE?page=15&annotation=QFEUZDPW))
## (2) Statistical Learning
### (2.1) What is Statistical Learning?
#### (2.1.1) Why Estimate f?
#### (2.1.2) How Do We Estimate f?
#### (2.1.3) The Trade-Off between prediction accuracy and model interpretability
#### (2.1.4) Supervised Versus Unsupervised Learning
#### (2.1.5) Regression Versus Classification Problems
### (2.2) Assessing Model Accuracy
#### (2.2.1) Measuring the Quality of Fit
#### (2.2.2) The Bias-Variance Trade-Off
#### (2.2.3) The Classification Setting
### (2.3) Lab: Introduction to Python
#### (2.3.1) Getting Started
#### (2.3.2) Basic Commands
#### (2.3.3) Introduction to Numerical Python
#### (2.3.4) Graphics
#### (2.3.5) Sequences and Slice Notation
#### (2.3.6) Indexing Data
#### (2.3.7) Loading Data
#### (2.3.8) For Loops
#### (2.3.9) Additional Graphical and Numerical Summaries
### (2.4) Exercises
## (3) Linear Regression
### (3.1) Simple Linear Regression
#### (3.1.1) Estimating the Coefficients
#### (3.1.2) Assessing the Accuracy of the Coefficient Estimates
#### (3.1.3) Assessing the Accuracy of the Model
### (3.2) Multiple Linear Regression
#### (3.2.1) Estimating the Regression Coefficients
#### (3.2.2) Some Important Questions
### (3.3) Other Considerations in the Regression Model
#### (3.3.1) Qualitative Predictors
#### (3.3.2) Extensions of the Linear Model
#### (3.3.3) Potential Problems
### (3.4) The Marketing Plan
### (3.5) Comparison of Linear Regression with K-Nearest Neighbors
### (3.6) Lab: Linear Regression
#### (3.6.1) Importing packages
#### (3.6.2) Simple Linear Regression
#### (3.6.3) Multiple Linear Regression
#### (3.6.4) Multivariate Goodness of Fit
#### (3.6.5) Interaction Terms
#### (3.6.6) Non-linear Transformations of the Predictors
#### (3.6.7) Qualitative Predictors
### (3.7) Exercises
## (4) Classification
### (4.1) An Overview of Classification
### (4.2) Why Not Linear Regression?
### (4.3) Logistic Regression
#### (4.3.1) The Logistic Model
#### (4.3.2) Estimating the Regression Coefficients
#### (4.3.3) Making Predictions
#### (4.3.4) Multiple Logistic Regression
#### (4.3.5) Multinomial Logistic Regression
### (4.4) Generative Models for Classification
#### (4.4.1) Linear Discriminant Analysis for p = 3
#### (4.4.2) Linear Discriminant Analysis for p > 1
#### (4.4.3) Quadratic Discriminant Analysis
#### (4.4.4) Naive Bayes
### (4.5) A comparison of Classification Methods
#### (4.5.1) An Analytical Comparison
#### (4.5.2) An Empirical Comparison
### (4.6) Generalized Linear Models
#### (4.6.1) Linear Regression on the Bikeshare Data
#### (4.6.2) Poisson Regression on the Bikeshare Data
#### (4.6.3) Generalized Linear Models in Greater Generality
### (4.7) Lab: Logistic Regression, LDA, QDA, and KNN
#### (4.7.1) The Stock Market Data
#### (4.7.2) Logistic Regression
#### (4.7.3) Linear Discriminant Analysis
#### (4.7.4) Quadratic Discriminant Analysis
#### (4.7.5) Naive Bayes
#### (4.7.6) K-Nearest Neighbors
#### (4.7.7) Linear and Poisson Regression on the Bikeshare Data
### (4.8) Exercises
## (5) Resampling Methods
### (5.1) Cross-Validation
#### (5.1.1) The Validation Set Approach
#### (5.1.2) Leave-One-Out Cross-Validation
#### (5.1.3) k-Fold Cross-Validation
#### (5.1.4) Bias-Variance Trade-Off for k-Fold Cross-Validation
#### (5.1.5) Cross-Validation on Classification Problems
### (5.2) The Bootstrap
### (5.3) Lab: Cross-Validation and the Bootstrap
#### (5.3.1) The Validation Set Approach
#### (5.3.2) Cross-Validation
#### (5.3.3) The Bootstrap
### (5.4) Exercises
## (6) Linear Model Selection and Regularization
### (6.1) Subset Selection
#### (6.1.1) Best Subset Selection
#### (6.1.2) Stepwise Selection
#### (6.1.3) Choosing the Optimal Model
### (6.2) Shrinkage Methods
#### (6.2.1) Ridge Regression
#### (6.2.2) The Lasso
#### (6.2.3) Selecting the Tuning Parameter
### (6.3) Dimension Reduction Methods
#### (6.3.1) Principal Components Regression
#### (6.3.2) Partial Least Squares
### (6.4) Considerations in High Dimensions
#### (6.4.1) High-Dimensional Data
#### (6.4.2) What Goes Wrong in High Dimensions?
#### (6.4.3) Regression in High Dimensions
#### (6.4.4) Interpreting Results in High Dimensions
### (6.5) Lab: Linear Models and Regularization Methods
#### (6.5.1) Subset Selection Methods
#### (6.5.2) Ridge Regression and the Lasso
#### (6.5.3) PCR and PLS Regression
### (6.6) Exercises
## (7) Moving Beyond Linearity
### (7.1) Polynomial Regression
### (7.2) Step functions
### (7.3) Basic Functions
### (7.4) Regression Splines
#### (7.4.1) Piecewise Polynomials
#### (7.4.2) Constraints and Splines
#### (7.4.3) The Spline Basic Representation
#### (7.4.4) Choosing the Number and Locations of the Knots
#### (7.4.5) Comparison to Polynomial Regression
### (7.5) Smoothing Splines
#### (7.5.1) An Overview of Smoothing Splines
#### (7.5.2) Choosing the Smoothing Parameter λ
### (7.6) Local Regression
### (7.7) Generalized Additive Models
#### (7.7.1) GAMs for Regression Problems
#### (7.7.2) GAMs for Classification Problems
### (7.8) Lab: Non-Linear Modeling
#### (7.8.1) Polynomial Regression and Step Functions
#### (7.8.2) Splines
#### (7.8.3) Smoothing Splines and GAMs
#### (7.8.4) Local Regression
### (7.9) Exercises
## (8) Tree-Based Methods
### (8.1) The Basics of Decision Trees
#### (8.1.1) Regression Trees
#### (8.1.2) Classification Trees
#### (8.1.3) Trees Versus Linear Models
#### (8.1.4) Advantages and Disadvantages of Trees
### (8.2) Bagging, Random forests, Boosting, and Bayesian Additive Regression Trees
#### (8.2.1) Bagging
#### (8.2.2) Random Forests
#### (8.2.3) Boosting
#### (8.2.4) Bayesian Additive Regression Trees
#### (8.2.5) Summary of Tree Ensemble Methods
### (8.3) Lab: Tree-Based Methods
#### (8.3.1) Fitting Classification Trees
#### (8.3.2) Fitting Regression Trees
#### (8.3.3) Bagging and Random Forests
#### (8.3.4) Boosting
#### (8.3.5) Bayesian Additive Regression Trees
### (8.4) Exercises
## (9) Support Vector Machines
### (9.1) Maximal Margin Classifier
#### (9.1.1) What is a Hyperplane?
#### (9.1.2) Classification Using a Separating Hyperplane
#### (9.1.3) The Maximal Margin Classifier
#### (9.1.4) Construction of the Maximal Margin Classifier
#### (9.1.5) The Non-separable Case
### (9.2) Support Vector Classifiers
#### (9.2.1) Overview of the Support Vector Classifier
#### (9.2.2) Details of the Support Vector Classifier
### (9.3) Support Vector Machines
#### (9.3.1) Classification with Non-Linear Decision Boundaries
#### (9.3.2) The Support Vector Machine
#### (9.3.3) An Application to the Heart Disease Data
### (9.4) SVMs with More than Two Clasess
#### (9.4.1) One-Versus-One Classification
#### (9.4.2) One-Versus-All Classification
### (9.5) Relationship to Logistic Regression
### (9.6) Lab: Support Vector Machines
#### (9.6.1) Support Vector Classifier
#### (9.6.2) Support Vector Machine
#### (9.6.3) ROC Curves
#### (9.6.4) SVM with Multiple Clasess
#### (9.6.5) Application to Gene Expression Data
### (9.7) Exercises
## (10) Deep Learning
### (10.1) Single Layer Neural Networks
### (10.2) Multilayer Neural Networks
### (10.3) Convolutional Neural Networks
#### (10.3.1) Convolution Layers
#### (10.3.2) Pooling Layers
#### (10.3.3) Architecture of a Convolutional Neural Network
#### (10.3.4) Data Augmentation
#### (10.3.5) Results Using a Pretrained Classifier
### (10.4) Document Classification
### (10.5) Recurrent Neural Networks
#### (10.5.1) Sequential Models for Document Classification
#### (10.5.2) Time Series Forecasting
#### (10.5.3) Summary of RNNs
### (10.6) When to Use Deep Learning
### (10.7) Fitting a Neural Network
#### (10.7.1) Backpropagation
#### (10.7.2) Regularization and Stochastic Gradient Descent
#### (10.7.3) Dropout Learning
#### (10.7.4) Network Tuning
### (10.8) Interpolation and double Descent
### (10.9) Lab: Deep Learning
#### (10.9.1) Single Layer Network on Hitters Data
#### (10.9.2) Multilayer Network on the MNIST Digit Data
#### (10.9.3) Convolutional Neural Networks
#### (10.9.4) Using Pretrained CNN Models
#### (10.9.5) IMDB Document Classification
#### (10.9.6) Recurrent Neural Networks
### (10.10) Exercises
## (11) Survival Analysis and Censored Data 
### (11.1) Survival and Censoring Times
### (11.2) A Closer Look at Censoring
### (11.3) The Kaplan-Meier Survival Curve
### (11.4) The Log-Rank Test
### (11.5) Regression Models with a Survival Response
#### (11.5.1) The Hazard function
#### (11.5.2) Proportional Hazards
#### (11.5.3) Example: Brain Cancer Data
#### (11.5.4) Example: Publication Data
### (11.6) Shrinkage for the Cox Model
### (11.7) Additional Topics
#### (11.7.1) Area Under the Curve for Survival Analysis
#### (11.7.2) Choice of Time Scale
#### (11.7.3) Time-Dependent Covariates
#### (11.7.4) Checking the Proportional Hazards Assumption
#### (11.7.5) Survival Trees
### (11.8) Lab: Survival Analysis
#### (11.8.1) Brain Cancer Data
#### (11.8.2) Publication Data
#### (11.8.3) Call Center Data
### (11.9) Exercises
## (12) Unsupervised Learning
### (12.1) The Challenge of Unsupervised Learning
### (12.2) Principal Components Analysis
#### (12.2.1) What Are Principal Components
#### (12.2.2) Another Interpretation of Principal Components
#### (12.2.3) The Proportion of Variance Explained
#### (12.2.4) More on PCA
#### (12.2.5) Other Uses for Principal Components
### (12.3) Missing Values and Matrix Completion
### (12.4) Clustering Methods
#### (12.4.1) K-Means Clustering
#### (12.4.2) Hierarchical Clustering
#### (12.4.3) Practical Issues in Clustering
### (12.5) Lab: Unsupervised Learning
#### (12.5.1) Principal Components Analysis
#### (12.5.2) Matrix Completion
#### (12.5.3) Clustering
#### (12.5.4) NCI60 Data Example
### (12.6) Exercises
## (13) Multiple Testing
### (13.1) A Quick Review of Hypothesis Testing
#### (13.1.1) Testing a Hypothesis
#### (13.1.2) Type I and Type II Errors
### (13.2) The Challenge of Multiple Testing
### (13.3) The Family-Wise Error Rate
#### (13.3.1) What is the Family-Wise Error Rate?
#### (13.3.2) Approaches to Control the Family-Wise Error Rate
#### (13.3.3) Trade-Off Between the FWER and Power
### (13.4) The False Discovery Rate
#### (13.4.1) Intuition for the False Discovery Rate
#### (13.4.2) The Benjamini-Hochberg Procedure
### (13.5) A Re-Sampling Approach to p-Values and False Discovery Rates
#### (13.5.1) A Re-Sampling Approach to the p-Value
#### (13.5.2) A Re-Sampling Approach to the False Discovery Rate
#### (13.5.3) When Are Re-Sampling Approaches Useful?
### (13.6) Lab: Multiple Testing
#### (13.6.1) Review of Hypothesis Tests
#### (13.6.2) Family-Wise Error Rate
#### (13.6.3) False Discovery Rate
#### (13.6.4) A Re-Sampling Approach
### (13.7) Exercises