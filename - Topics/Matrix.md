---
aliases:
  - matrices
---
## Synthesis
- 
## Source [^1]
- A matrix is in [[row echelon form]] (ref) when it satisfies the following conditions
	- (1) The first non-zero element in each row, called the [[leading entry]], is 1

## Source[^2]
- The use of square bracket notation and parentheses notation for matrices is interchangeable
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix} = \begin{bmatrix} a & b \\ c & d \end{bmatrix} $$
## Source[^3]
- The number of elements of a matrix is always finite
	- This is true because a matrix by definition has a specific number of rows and columns, meaning there is a [[countable]], finite number of elements within it[^5]
		- #question What is meant by countable?
- The number of elements of a matrix of order $mxn$ is $mn$ 
- The position of an element of a matrix is (row number, column number)

## Source[^4]
- The position of an element in a matrix is typically referred to using its index or indices
- For example, in matrix A, the element in the $i^{th}$ row and $j^{th}$ column is denoted as $A_{ij}$, and this is referred to as the element at position $(i, j)$ 
- #question I need to create a separate note for "index" of a matrix

## Source[^6]
- ![[Screenshot 2024-01-29 at 4.22.13 PM.png|300]]
	- The elements of a matrix are described with two subscripts or indices

## Source[^7]
- A two-dimensional array. In computing, matrices are usually considered to be special cases of $n$-dimensional arrays, expressed as arrays with two indices. The notation for arrays is determined by the programming language. The two dimensions of a matrix are known as its rows and columns; a matrix with $m$ rows and $n$ columns is said to be an $m \times n$ matrix.
- In mathematics (and in this dictionary), the conventional notation is to use a capital letter to denote a matrix in its entirety, and the corresponding lower-case letter, indexed by a pair of subscripts, to denote an element in the matrix. Thus the $i,j$th element of a matrix $A$ is denoted by $a_{i j}$, where $i$ is the row number and $j$ the column number.
- A deficient two-dimensional array, in which one of the dimensions has only one index value (and is consequently elided), is a special kind of matrix known either as a [[row vector]] (with the column elided) or column vector (with the row elided). The distinction between row and column shows that the two dimensions are still significant.
## Source[^8]
- n. 
- (1) (in histology) the substance of a tissue or organ in which more specialized structures are embedded; for example, the ground substance (extracellular matrix) of connective tissue. 
- (2) (in radiology) the division of an image into rows and columns with equally sized elements (pixels). The final image is completed by assigning a density to each of these elements. Increasing the number of pixels in the matrix improves the resolution of the final image. A typical value could be 256 rows $\times 256$ columns.
## References

[^1]: https://stattrek.com/matrix-algebra/echelon-form
[^2]: https://math.stackexchange.com/questions/9645/parenthesis-vs-brackets-for-matrices
[^3]: https://www.cuemath.com/algebra/elements-of-matrix/
[^4]: ChatGPT
[^5]: Google's Search Labs | AI Overview
[^6]: [[(1) Linear Algebra 1.1.1 Systems of Linear Equations]]
[^7]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^8]: [[(Home Page) Concise Medical Dictionary 10th Edition by Oxford Reference]]