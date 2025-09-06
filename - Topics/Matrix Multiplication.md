---
explored:
  - "[[(3) Matrices - Matrix Multiplication  - ExamSolutions]]"
---
## Synthesis
- 
## Source [^1]
### Rules
- Multiplying 2 matrices together is <mark style="background: #FF5582A6;">not</mark> [[Commutative Property|commutative]]
	- Let A = $\begin{bmatrix}1 & 1 \\ 2 & 1\end{bmatrix}$  and B = $\begin{bmatrix}2 & 1 \\ 1 & 1\end{bmatrix}$[^2]
		- AB $\ne$ BA
			- AB = $\begin{bmatrix}3 & 2 \\ 5 & 3\end{bmatrix}$
			- BA = $\begin{bmatrix}4 & 3 \\ 3 & 2\end{bmatrix}$
- You can only multiply ($\text{mxn}$) with ($\text{nxp}$) matrix to give an ($\text{mxp}$) matrix[^3]
## Source [^4]
### Examples

#### (1) Matrix: (2x3) x (3x2)
$$
\begin{align*}
\begin{bmatrix}2 & 1 & 4 \\ 1 & 5 & 0\end{bmatrix} 
\begin{bmatrix}3 & 5 \\ 2 & 3 \\ 1 & 1\end{bmatrix} 
&= \begin{bmatrix}(2*3)+(1*2)+(4*1) & (2*5)+(1*3)+(4*1) \\ (1*3)+(5*2)+(0*1) & (1*5)+(5*3)+(0*1)\end{bmatrix} 
\\ &= \begin{bmatrix} 12 & 17 \\ 13 & 20\end{bmatrix} 
\end{align*}
$$
- Number of columns in first matrix must be equal to number of rows in second matrix
	- $(2\times \textcolor{hotpink}{3}) \times (\textcolor{hotpink}{3} \times 2)$
		- Inner numbers
- Product will be have number of rows in first matrix and number of columns in second matrix
	- $(\textcolor{hotpink}{2}\times 3) \times (3 \times \textcolor{hotpink}{2})$
		- Outer numbers

## Source[^5]
- The multiplication of two matrices $A$ and $B$ according to the rule$$c_{i j}=\sum_{k=1}^{n} a_{i k} b_{k j}$$
## References
[^1]: [[(3) Matrices - Matrix Multiplication  - ExamSolutions#^724853]]
[^2]: http://www.csc.villanova.edu/~japaridz/Archive/1300/lect2.6/sld004.htm
[^3]: [[(3) Matrices - Matrix Multiplication  - ExamSolutions#^f01be6]]
[^4]: [[(3) Matrices - Matrix Multiplication  - ExamSolutions#^6b6aa8]]
[^5]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]