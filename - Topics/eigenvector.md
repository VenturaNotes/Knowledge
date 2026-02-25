---
aliases:
  - eigenvectors
---
## Synthesis
### Description
- An eigenvector of a [[linear transformation]] (represented by a matrix) is a [[non-zero vector]] that, when the transformation is applied to it, only changes by a scalar factor. It does not change its direction, only its magnitude (and possibly its orientation if the scalar factor is negative). The scalar factor is called the [[eigenvalue]] corresponding to that eigenvector
	- #question If rotation occurs in this linear transformation, obviously there would be more changes than a scalar factor (as the new vector would not be collinear with the original). Then the vector would not be called an eigenvector. What would that vector be called then?
	- #question Are we saying the linear transformation is represented by a matrix? Could you give an example of this?
	- #question What is a linear transformation?
	- #question What would a transformation look like? 
	- #question Why is an eigenvector important?
	- An eigenvalue not changing direction means it remains on the same line through the origin
		- #question Must it lie through the origin
		- So if the scalar factor $\lambda$ is negative the vector's orientation is reversed ( points in opposite direction along same line), but still lies on the same one-dimensional subspace (the "line" or "direction"). 
			- For example, a vector $\begin{pmatrix} 1 \\ 0 \end{pmatrix}$ and its transformed version $\begin{pmatrix} -2 \\ 0 \end{pmatrix}$ (with $\lambda = -2$) both lie on the x-axis. They are [[collinear]], even though they point in opposite orientations.
			- #question What is a subspace? 
			- #question What does collinear mean? 
	- The reason we specify a non-zero vector is because it would trivially satisfy $A \mathbf{0} = \lambda \mathbf{0}$ for any matrix $A$ and any scalar $\lambda$, which wouldn't provide any meaningful information about the transformation
		- #question What kind of meaningful information does the eigenvector provide?
	- Eigenvectors are meant to describe specific directions that are preserved by the transformation
		- The eigenvector ($v$) defines the specific direction (a line through the origin) that is preserved by the transformation.
		- The eigenvalue ($\lambda$) is a scalar that tells you how much the eigenvector is scaled (stretched, shrunk, or flipped) along that direction.
			- Eigenvalue tells you what happens to vectors pointing in that direction
- Mathematically, for a square matrix $A$, a vector $v$ is an eigenvector if it satisfies the equation $Av = \lambda v$
	- $A$ is a square matrix
	- $v$ is the eigenvector 
	- $\lambda$ (lambda) is the eigenvalue (a scalar)
	- #question Where does this equation come from?
### Example
- Given 2x2 matrix $A$ and vector $v$:
	- $A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$
	- $v = \begin{pmatrix} 1 \\ 1 \end{pmatrix}$
- Apply matrix $A$ to vector $v$:
	- $Av = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix} \begin{pmatrix} 1 \\ 1 \end{pmatrix} = \begin{pmatrix} (2 \times 1) + (1 \times 1) \\ (1 \times 1) + (2 \times 1) \end{pmatrix} = \begin{pmatrix} 2 + 1 \\ 1 + 2 \end{pmatrix} = \begin{pmatrix} 3 \\ 3 \end{pmatrix}$
		- Uses [[matrix multiplication]]
- Resulting vector $\begin{pmatrix} 3 \\ 3 \end{pmatrix}$ is 3 times original vector $v = \begin{pmatrix} 1 \\ 1 \end{pmatrix}$:
	- $\begin{pmatrix} 3 \\ 3 \end{pmatrix} = 3 \begin{pmatrix} 1 \\ 1 \end{pmatrix}$
- Therefore
	- $v = \begin{pmatrix} 1 \\ 1 \end{pmatrix}$ is an eigenvector of matrix $A$.
	- $\lambda = 3$ is the corresponding [[eigenvalue]].
- The vector $v$ maintained its direction after the transformation by $A$. It was only scaled by a factor of 3.
	- A vector maintained its direction after the transformation if the resulting vector is a scalar multiple of the original vector
		- Given
			- Original vector: $v = \begin{pmatrix} 1 \\ 1 \end{pmatrix}$
			- Transformed vector: $Av = \begin{pmatrix} 3 \\ 3 \end{pmatrix}$
		- Since $\begin{pmatrix} 3 \\ 3 \end{pmatrix} = 3 \begin{pmatrix} 1 \\ 1 \end{pmatrix}$, the transformed vector is exactly 3 times the original vector. This means they are [[collinear]]; point in the same "direction" (lie on the same line through the origin). 
			- #question In linear transformations, a transformed vector is collinear with the original vector is generally not true. Is this statement true?
		- The only change is the magnitude (it's 3 times longer). If the transformed vector were not a scalar multiple of the original, its direction would have changed.
### Importance
- Eigenvectors reveal fundamental directions along which a linear transformation acts simply by scaling.
	- #question What is meant by fundamental directions?
- They represent the "stable" or "invariant" directions of a transformation. 
	- #question Is there a difference between stable and invariant?
- The directions and corresponding scaling factors (eigenvalues) provides crucial insights into the behavior of systems modeled by linear transformations
	- #question What are the "directions" called? Could you give an example of what the direction would be? I understand in linear transformations, the direction stays the same but how would you define a direction and what would it exactly be? 
	- #question Could you give an example of how an insight would be crucial?
- Examples
	- Eigenvectors help analyze stability, vibrations, and principal components of data
		- #question How are eigenvectors able to do this in physics, engineering, and data science? Give a mathematical example for each.
### Meaningful
- Eigenvectors provide information about the specific directions that are preserved by a linear transformation.
	- #question What do you mean by "directions" plural? How can there be multiple directions? Could you give an example? 
- Eigenvectors tell you which vectors when transformed only get stretched, shrunk, or flipped but not rotated or moved off their original line.
	- #question Is this based on the matrix they are transformed by?
	- #question Is it possible for it to get stretched and flipped at the same time? 
	- #question When does it not become an eigenvector? What is the scaling factor called in a non-linear transformation? 
- Eigenvectors and eigenvalues describe fundamental behavior of transformation
	- Eigenvector tells where the transformation acts
		- #question What is meant "where" here? Isn't it just the vector itself?
	- Eigenvalue tells you how much it scales in that direction 
- It's crucial for understanding the underlying structure and dynamics of systems modeled by linear transformations
	- #question Give a specific application why this matters 

### Equation
- $Av = \lambda v$ is the definition of an eigenvector and eigenvalue
	- When a linear transformation (represented by matrix $A$) is applied to a vector $v$, the result ($Av$) is simply a scalar multiple ($\lambda$) of the original vector $v$. T
	- Equation states that the transformed vector $Av$ is collinear with the original vector $v$, meaning it lies on the same line through the origin, only scaled.

## Source [^1]
- 
## References

[^1]: 