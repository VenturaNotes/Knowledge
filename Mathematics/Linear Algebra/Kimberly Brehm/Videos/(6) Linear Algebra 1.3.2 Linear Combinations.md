---
Source:
  - https://youtube.com/watch?v=9QXnOwSOoWA
Reviewed: false
---
- ![[Screenshot 2024-12-15 at 8.28.07 PM.png]]
	- [[linear combination|linear combinations]]
		- The vector defined by $y = c_1v_1 + c_2v_2 + ... + c_nv_n$ where $c_i$ are scalars and $v_i$ are vectors, is called a linear combination of $\overset \rightharpoonup v_1, \overset \rightharpoonup v_2, ..., \overset \rightharpoonup v_n$ with weight $c_1, c_2, ..., c_n$ 
			- Linear combinations is a vector created by combining other vectors and their scalars
			- We know from the [[parallelogram rule]] that $\overset \rightharpoonup u$ would be the opposite corner of a parallelogram
				- Based on the black parallelogram drawn, we've got $2v_1$ and $-1v_2$ and that's how we can write vector u. 
					- $\overset \rightharpoonup u$ = $2v_1 - v_2$ 
					- $\overset \rightharpoonup w$ found the same way (but a little harder due to estimations)
		- If $\overset \rightharpoonup v_1 = \begin{bmatrix}1 \\ 5\end{bmatrix}$ and  $\overset \rightharpoonup v_2 = \begin{bmatrix}-3 \\ 4\end{bmatrix}$, estimate the linear combination that generates vectors $\overset \rightharpoonup u$ and $\overset \rightharpoonup w$
	- Linear combinations existence
		- If $v_1$ and $v_2$, determine if $b$ can be written as a linear combination of $v_1$ and $v_2$, then determine the weights such that $c_1v_1 + c_2v_2 = b$ 
			- Write [[augmented matrix]]
			- Found [[pivot|pivots]]
			- Found the weights to be 3 and 2
	- Some clarification
		- A vector equation $x_1 \overset \rightharpoonup a_1 + x_2\overset \rightharpoonup a_2 +... + x_n \overset \rightharpoonup a_n = \overset \rightharpoonup b$ has the same solution set as the linear system whose augmented matrix is $[\overset \rightharpoonup a_1 \overset \rightharpoonup a_2 ... \overset \rightharpoonup a_n | \overset \rightharpoonup b]$. Therefore, a vector equation only has a solution if the system is consistent
		- If $[\overset \rightharpoonup v_1 \overset \rightharpoonup v_2... \overset \rightharpoonup v_p]$ are in $\mathbb{R}^n$, then the set of linear combinations is denoted [[span]]{$[\overset \rightharpoonup v_1 \overset \rightharpoonup v_2 ... \overset \rightharpoonup v_p]$} and is called the subset of $\mathbb{R}^n$ spanned. Essentially span{$[\overset \rightharpoonup v_1 ... \overset \rightharpoonup v_n]$} is all vectors that can be written in the form $c_1 \overset \rightharpoonup v_1 + c_2\overset \rightharpoonup v_2+... + c_p \overset \rightharpoonup v_p = \overset \rightharpoonup b$ with $c_i$ scalars
			- Span is a collection of all of the solutions to those linear combinations. So it's all of the scalars combined with all of those vectors that are solutions 
	- More span talk
		- Is b in the plane created by span.
			- The vector equation has no solution since 0 $\ne$ -2 and so `b` would not be in the span
- ![[Screenshot 2024-12-15 at 8.32.54 PM.png]]
	- Practice:
		- A mining company has two mines. One days operation at mine 1 produces ore that contains 20 metric tons of copper and 550kg of sliver. Mine 2 produces 30 metric tons of copper and 500 kg of silver. How many days should each mine operate to produce 150 tons copper and 2825kg silver.
			- `~` This notation shows that the matrices are [[equivalent]]
	- Practice 2
		- For what values off h is b in the span of $a_1$ and $a_2$?
		- `h` must be -17 for `b` to be in the span $\{a_1, a_2\}$