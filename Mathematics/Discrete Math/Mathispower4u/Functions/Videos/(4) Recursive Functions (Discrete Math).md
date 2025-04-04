---
Source:
  - https://www.youtube.com/watch?v=BRJbMm4ZJDY
Reviewed: false
---
- ![[Screenshot 2025-01-18 at 2.45.14 PM.png]]
	- [[Recursive Function|Recursive functions]]
		- Giving an explicit formula that calculates the image of any element in the domain is a great way to describe a function. We will say that these explicit rules are closed formulas for the function.
			- What is the algebraic formula?
			- This explicit rule is a [[closed formula]]
				- $f(n) = n^2+1$ 
					- Only need value of $n$ or the input for the closed formula
		- There is another very useful way to describe functions whose domain is $\mathbb{N}$, that rely specifically on the structure of the natural numbers. We can define a function recursively!
		- Recursively Defined Functions
			- For a function $f: \mathbb{N} \to \mathbb{N}$, a recursive definition consists of an initial condition together with a [[recurrence relation]]. The [[initial condition]] is the explicitly given value of f(0). The recurrence relation is a formula for f(n+1) in terms for f(n) (and possibly n itself)
	- Recursive Functions
		- What isa recursive function for the same function that has the close formula $f: \mathbb{N} \to \mathbb{N}: f(n) = n^2+1$?
		- Here is the same function expressed recursively:
			- The drawback on recursive functions is that we do need to know previous function value or values to determine the next function value 
		- Note: Not all functions can be described explicitly and recursively.
	- Recursive Functions
		- Recursively defined functions are often easier to create from a "real world" problem, because they describe how the values of the functions are changing. However, this comes with a price. It is harder to calculate the image of a single input, since you need to know the images of other (previous) elements in the domain
		- Example 0.4.5.
			- Give recursive definitions for the functions described below
				- (1) $f : \mathbb{N} \to \mathbb{N}$ gives the number of snails in your terrarium $n$ years after you built it, assuming you started with 3 snails and the number of snails doubles each year
				- (2) g: $\mathbb{N} \to \mathbb{N}$ gives the number of push-ups you do $n$ days after you started your push-ups challenge, assuming you could do 7 push-ups on day 0 and you can do 2 more push-ups each day
				- (3) h: $\mathbb{N} \to \mathbb{N}$ defined by $h(n) = n!$. Recall that $n!$ = $1*2*3... (n-1)$$*$n is the product of all numbers from 1 through $n$. We also defined $0! = 1$ 
	- Recursive functions
		- (1) The initial condition is $f(0) =3$. To get f(n+1) we would double the number of snails in the terrarium in the previous year, which is given by $f(n)$. Thus $f(n+1) = 2f(n)$. The full recursive definition contains both of these, and would be written
			- $f(0) = 3; f(n+1) = 2f(n)$ 
- ![[Screenshot 2025-01-18 at 2.49.11 PM.png]]
	- (2) We are told that on day 0, you can do 7 push-ups, so $g(0) = 7$. The number of push-ups you can do on day $n+1$ is 2 more than the number you can do on day $n$, which is given by $g(n)$. Thus
		- $g(0) = 7; g(n+1) = g(n) + 2$ 
	- (3) Here $h(0) = 1$. To get the recurrence relation, think about how you can get $h(n+1) = (n+1)!$ from $h(n) = n!$. If you write out both of these products, you see that $(n+1)!$ is just like $n!$ except you have one more term in the product, an extra $n+1$. So we have
		- $h(0) = 1$; $h(n+1) = (n+1)*h(n)$ 
		- ![[Screenshot 2025-01-18 at 2.48.30 PM.png]]