---
Source:
  - https://youtube.com/watch?v=ztsT5uoWeEE
Reviewed: false
---
- ![[Screenshot 2024-12-12 at 2.25.00 PM.png]]
	- [[Vector equation|Vector equations]]
	- [[Vectors]] in $\mathbb{R^2}$
		- [[Vector]] - an ordered list of numbers (more on this in Ch. 4)
		- [[Column vector]]: A vector with only one column. We often use these for ordered pairs, triples, etc.
		- Vectors in $\mathbb{R}^2$: The set of all vectors with 2 entries
			- $\mathbb{R}$ $\to$ Real Numbers
			- 2 $\to$ Number of entries
			- This is the set of all points in a plane
			- Example
				- If you had an [[ordered pair]] (1, 3), could write that as $\begin{bmatrix}1 \\ 3 \end{bmatrix}$ as a vector in $\mathbb{R}^2$ which is written as a column and has 2 entries so that it would belong to $\mathbb{R}^2$ 
		- Operations with vectors - Same as with other matrices
			- Scalar: Multiply vector by a constant
			- Addition: Add corresponding values
			- Multiplication: Nope! Dimensions don't work
				- To multiply a $2 \times 1$ vector, we would need another vector with 1 row times however many columns
	- Operations on Vectors Example
		- [[Parallelogram rule for addition]]
			- The end of the parallelogram (4th point), made up by the point by the zero vector and the two vectors that you're adding together. It's that 4th point. The vector would just be an arrow to that point
			- It's just making a parallelogram by adding them together
		- If you see a vector in a textbook, it will be a lowercase letter in boldface such as **u**
		- By hand, it will be $\overset \rightharpoonup u$
		- Drew a line and an arrow at the end (this is how we draw a vector)
		- Using scalar in this example
	- Vectors in $\mathbb{R}^n$
		- If n $\in$ $\mathbb{R}$, then $\mathbb{R}^n$ is the collection of all lists of ordered n-tuples of N real numbers written as $N \times 1$ column matrices
			- n can be any real number
			- six-tuples would be anything with 6 values
		- [[Zero vector]]: The vector whose entries are all 0, denoted by 0
		- In parallelogram rule, always starting at the $\begin{bmatrix}0 \\ 0 \end{bmatrix}$
			- And instead of saying $\begin{bmatrix}0 \\ 0 \end{bmatrix}$, we can just say it's the 0 vector of 0
	- Algebraic properties of $\mathbb{R}^n$
		- These properties correspond to properties of real numbers and pertain to vectors u, v, and w and scalars c and d
		- First property is [[commutative property]]
			- Can add vectors in either order and result will be the same
		- Second property is [[associative property]]
			- Can group vectors differently and result the same
		- Third property is [[additive identity property]]
			- Can add 0 to any vector and end up with that vector meaning the identity is 0
		- Fourth property is [[inverse property]]
			- Can add the inverse which would be the negative vector and would end up back at the identity of 0
		- Below the line deals with scalars (which is any value you're multiplying by a vector)
			- First property is [[distributive property]]
				- If you have a scalar, you can either add the two vectors first and multiply by the scalar or multiply each vector by the scalar and then add results together
			- Still the distributive property
				- But we have two scalars, so we can add them together first and then multiply by the vector or separate each scalar out, multiply each by the vector and then add them together
			- Multiplying instead of adding
				- Can multiplying scalar and vector first or scalars first and then vector
			- identity property for multiplication
				- Anything multiplied by 1 will end up at the same vector
- ![[Screenshot 2024-12-12 at 2.26.16 PM.png]]
	- Practice. Display the vectors on a graph
		- Could do $\frac {-1}{2}\overset\rightharpoonup u$
			- This visual will be important later when talking about spans