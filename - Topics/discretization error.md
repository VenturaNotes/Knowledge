## Synthesis
- 
## Source [^1]
- The error in a numerical method that has been constructed by the discretization of a 'continuous' problem. The term is widely used in the context of solving differential equations. A distinction must be made between global and local errors.

  

For example, in Euler's method (see DISCRETIZATION) the global error, or global discretization error, is the error in the discrete solution to the problem, specifically

  

$$

y_{n}-y\left(x_{n}\right)

$$

  

The local discretization error is the amount by which the continuous solution fails to satisfy the discrete formula:

  

$$

(1 / h)\left(y\left(x_{n+1}\right)-y\left(x_{n}\right)\right)-f\left(x_{n}, y\left(x_{n}\right)\right)

$$

  

Speaking generally, estimates of local errors are used in choosing the grid spacing $h$ hence providing a means of indirectly controlling the global error.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]