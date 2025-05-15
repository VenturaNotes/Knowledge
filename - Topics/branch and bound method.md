## Synthesis
- 
## Source [^1]
- (of solving the knapsack problem) This procedure constructs a branching method that terminates each branch once the constraint limit has been reached and by allowing items to be added in an order which is determined at the start. This reduces considerably the number of combinations that have to be tried. The following simple example will be used to illustrate the detailed method.
- A knapsack has maximum weight of 15 , and the following items are available: $A$ has weight $(w) 5$ and value $(v) 10$, written $A(5,10)$ with $B(7,11), C(4,8)$ and $D(4,12)$.
- Method. Place the items in decreasing order of value per unit weight, i.e. $D, A, C, B$ ( $A$ and $C$ could be reversed). Then construct a vector $\left(x_{1}, x_{2}, x_{3}, x_{4}\right)$ where $x_{i}=0$ if the item is not being taken and $x_{i}=1$ if it is. Start with $(0,0,0,0)$. At each stage, if a branch has not been terminated, and there are $n$ zeros at the end of the vector, construct $n$ branches which change exactly one of those zeros to a one and for which the total weight does not exceed the limit so the first stage will have four branches $(1,0,0,0),(0,1,0,0),(0,0,1,0)$ and $(0$, $0,0,1)$. Calculate the total weight $(w)$ for each new branch created, and the value $(v)$, and repeat the process.
- ![[Screenshot 2025-05-13 at 12.29.21 PM.png]]
	- Example illustrating the branch and bound method
- From the figure we see that the optimal solution is to choose items $B, C, D$ with total weight 15 and value 31 .
## References

[^1]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]