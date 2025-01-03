---
Source:
  - https://youtube.com/watch?v=eXL8m865QeM
Reviewed: false
---
---
- Echelon Form of a Matrix
	- A matrix is in echelon form if it satisfies these three conditions:
		- (1) Any rows of all zeroes are below any other rows
		- (2) Each leading entry of a row is in a column to the right of the leading entry in the row above it
		- (3) All entries in a column below a leading entry are zeros
---
- Row Operations
	- [[Scaling]]: Multiplying a row by a non-zero constant
	- [[Replacement]]: Replace an row by the sum of itself and a multiple of another row
	- [[Interchange|Swapping]]: Swap the positions of two rows
---
- ![[Screenshot 2023-04-15 at 11.41.24 PM.png]]
- Example
	- Use row operations to find an echelon form for this matrix
---
- Pivots and Pivot Columns
	- When a matrix is in echelon form, the leading entry of each row in that matrix is called a [[pivot]]
	- Even though matrices can have different echelon forms, the pivots will always be in the same locations
	- A column that contains a pivot is called a [[pivot column]]
---
- Row-Reducing a Matrix (for echelon form)
	- (1) Begin with the first nonzero column. This is a pivot column and the pivot position is at the top.
	- (2) If necessary, swap rows to get a nonzero entry into the pivot position
	- (3) Use the "replacement" row operation to create zeros in all positions below the pivot
	- (4) Move to the next pivot column and repeat this process
---
- ![[Screenshot 2023-04-16 at 2.05.17 PM.png]]
- Another Example
	- Use row operations to find an echelon form for this matrix
---
- [[(3) Linear Algebra - Lecture 3 - Echelon Form#^5a33ff|Reduced Echelon Form]]
- Row-Reducing a Matrix (for reduced echelon form)
	- (1) Begin with the first nonzero column. This is a pivot column and the pivot position is at the top.
	- (2) If necessary, swap rows to get a nonzero entry into the pivot position.
	- <mark style="background: #FFF3A3A6;">(3) Use "scaling" to make the pivot equal 1</mark>, then use the "replacement" row operation to create zeros in all positions <mark style="background: #FFF3A3A6;">above and</mark> below the pivot.
	- (4) Move to the next pivot column and repeat this process.
	- Note
		- The underlined portion is the difference between echelon form and reduced echelon form
---
- ![[Screenshot 2023-04-16 at 4.32.46 PM.png]]
- One More Example
	- Use row operations to find the reduced echelon form for this matrix:
