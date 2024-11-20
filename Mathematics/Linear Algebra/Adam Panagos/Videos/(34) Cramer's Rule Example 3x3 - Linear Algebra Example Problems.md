[Video](https://www.youtube.com/watch?v=iiQRuh6PbTY)

- ![[Screenshot 2024-11-19 at 7.33.16 PM.png]]
	- [[Cramer's Rule]]
		- This process of taking the [[coefficient matrix]], replacing one of the columns with `b` vector and then taking a ratio of determinants to solve for the unknown
		- It lets you solve for each unknown one at a time by doing simple determinant computations and taking a ratio of determinants
		- Obviously, can't use this technique if the determinant of the coefficient matrix is 0. But if the determinant is zero, then we know we'd have problems with solving that system anyway because there isn't a solution
	- Use Cramer's rule to find the solution of the following system of equations:
		- Create matrix format first
		- Need compute the determinant to use Cramer's rule
		- First column needs to be replaced by the `b` vector