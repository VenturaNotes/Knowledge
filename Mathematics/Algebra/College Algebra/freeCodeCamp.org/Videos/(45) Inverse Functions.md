[6:29:32](https://www.youtube.com/watch?v=LwCRRUa8yTU&t=23372s)

- ![[Screenshot 2023-02-26 at 11.22.53 PM.png]]
	- The inverse of a function undoes what the function does.
	- Inverse of tying your shoes would be to untie them.
	- Inverse of a function that add 2 to a number would be to subtract 2 from a number
	- Video introduces inverses and their properties
- ![[Screenshot 2023-02-26 at 11.25.01 PM.png]]
	- Suppose f(x) is the function defined by the chart below
	- The [[inverse function]] for f, written $f^{-1}(x)$, undoes what f does.
	- Key Fact 1. <mark style="background: #FFF3A3A6;">Inverse functions reverse the roles of y and x</mark>
- ![[Screenshot 2023-02-26 at 11.31.55 PM.png]]
	- Graph y=f(x) and y=$f^{-1}(x)$ on the same axes below. What do you notice about the points on the graph of y = f(x) and the points on the graph of y=$f^{-1}$?
		- Blue and red points are [[mirror images]]
	- <mark style="background: #FFF3A3A6;">Key Fact 2</mark>
		- The graph of $y=f^{-1}(x)$ is obtained from the graph of $y=f(x)$ by reflecting over the line $y=x$
- ![[Screenshot 2023-02-26 at 11.36.12 PM.png]]
	- In our same example, compute:
	- <mark style="background: #FFF3A3A6;">Key Fact 3</mark>
		- $f^{-1} \circ f(x)$ = x and  $f \circ f^{-1}(x)$ = x. This is the mathematical way of saying that $f$ and $f^{-1}$ undo each other
	- The cube root function is the inverse of the cubing function. When composing the two functions, we get back to the number that we started with.
- ![[Screenshot 2023-02-26 at 11.44.47 PM.png]]
	- Find the inverse of the function
		- Reverse the roles of y and x
		- Solve for y
	- $f^{-1}(x)$ means the inverse function for f(x). Note that $f^{-1}(x)$ $\ne$ $\frac {1}{f(x)}$
	- Inverse function does not mean reciprocal
- ![[Screenshot 2023-02-27 at 12.48.52 PM.png]]
	- Question. Do all functions have inverse functions? That is, for any function that you might encounter, is there always a function that is its inverse?
		- No
			- $f(x) = x^2$ has no inverse.
				- Plugging in a 2 and a -2 gives 4 (violates the horizontal line test)
				- 4 can't return both 2 and -2 (violates the vertical line test)
	- Try to find an example of a function that does not have an inverse function.
		- for each X in the domain, there is only one corresponding y-value
- ![[Screenshot 2023-02-27 at 12.53.20 PM.png]]
	- Key Fact 4. A function f has an inverse function if and only if the graph of f satisfies the [[horizontal line test]] (i.e. every horizontal line intersects the graph of y=f(x) in at most one point.)
		- Graphs A and B violate the horizontal line test
	- Definition. A function is [[one-to-one]] if it passes the horizontal line test. Equivalently, a function is one-to-one if for any two different x-values $x_1$ and $x_2$, f($x_1$) and f($x_2$) are different numbers. Sometimes, this is said: f is one-to-one if, whenever f($x_1$) = f($x_2$), then $x_1$ = $x_2$ 
		- f($x_1$) and f($x_2$)  are the y-values
		- ![[Screenshot 2023-02-27 at 12.58.43 PM.png]] [^1]
			- A one-to-one function is injective, and any 2 y-values that are equal implies that 2 x-values are equal.
- ![[Screenshot 2023-02-27 at 1.05.51 PM.png]]
	- Example. (Tricky) Find inverse function and graph on the same axes
		- This is tricky because you need to add the restriction that x $\ge$ 0 since p(x) had the restriction of being greater than 0.
	- For the function p(x) = $\sqrt{x-2}$, what is:
		- the domain of p?
		- the range of p?
		- the domain of $p^{-1}$
		- the range of $p^{-1}$
	- Key Fact 5. For any invertible function f, the domain of $f^{-1}(x)$ is the range of f(x) and the range of $f^{-1}(x)$ is the domain of f(x).
		- The domain of a function is the range of its inverse
- ![[Screenshot 2023-02-27 at 1.10.13 PM.png]]
	- (1) Inverse functions reverse the roles of y and x
	- (2) The graph of the inverse is the graph of the function reflected over the line y=x
	- (3) Composing inverses will undo each other
		- Input seems to equal output
	- (4) Function is invertible if it satisfies the horizontal line test
	- (5) The domain of f(x) is the range of $f^{-1}(x)$
		- The range of f(x) is the domain of $f^{-1}(x)$
	- These properties of inverse functions are important when we study exponential functions and their inverses, logarithmic functions

## References

[^1]: https://www.math.uh.edu/~jiwenhe/Math1432/lectures/lecture01_handout.pdf