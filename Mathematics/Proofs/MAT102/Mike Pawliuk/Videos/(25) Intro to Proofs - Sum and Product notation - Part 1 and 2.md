[Video](https://youtube.com/watch?v=ZlToZm-PrZc)

- ![[Screenshot 2024-01-16 at 5.02.34 PM.png]]
	- Slide 2 - Learning Objectives (for this video)
		- By the end of this video, participants should be able to
			- Write a sum/product in sigma/pi notation
			- Extract a sum/product from the sigma/pi notation
	- Slide 3 - Motivation
		- Motivation
			- We want to express things like 1 + 2 + 3 + ... + 100 in a more compact and precise way, without using "...". This will be especially useful in [[calculus]] and [[statistics]] (e.g. [[Riemann Sums]])
	- Slide 4 - Warm - up example
		- Compute the following sums
		- Make a general [[conjecture]]
		- Express your conjecture in precise mathematical language
		- Conjecture: The sum of consecutive odd numbers is a square
			- $(\forall n \in \mathbb{N}) [1 + 3 + ... + (2n-3) + (2n-1) = n^2]$
	- Slide 5 - Making the precise: The math way
		- Definition ([[sigma notation]])
			- Let $a_i$ be a real number (for i $\in$ $\mathbb{N}$) and let n $\in$ $\mathbb{N}$
				- $\Sigma_{i=1}^n a_i =$ 
					- i is just an [[index]] 
					- n will be stopping at index
					- Read as
						- "The sum of i = 1 to n of $a_i$ "
					- Broke down:
						- n (end index)
						- $a_i$ (general term)
						- 1 (start index)
						- i (dummy variable)
			- Can think of $a_i$ as a function that depends on i
				- $a_i$ = f(i)
- ![[Screenshot 2024-01-16 at 5.10.31 PM.png]]
	- Slide 6 - Making this precise: The Python way
		- This is a for/while loop that computes $\Sigma_{i=1}^n(2i-1)$ 
	```python
	def total(n):
		"""Give the sum of the odd numbers a_1 through a_n"""
		sum = 0
		for i in range(1, n+1)
			sum += 2*i - 1
		return sum
	total(5)
	
	#>>>> 25
```
	- Slide 7 - Examples
		- $\Sigma_{i=-2}^3i^2$ 
		- i can be a positive or negative integer and it still increases by 1 every time
	- Slide 8 - Sum Exercises
		- For 3rd problem, work your way from outside in.
	- Slide 9 - [[Sum Theorems]]
		- Let c be a real number, and n be a natural number
		- These will be shown in next video
		- Exercise. If m $\le$ n then