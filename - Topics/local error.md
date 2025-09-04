## Synthesis
- 
## Source [^1]
- A measure of the accuracy over one step of a method for the numerical solution of ordinary differential equations. This is a useful concept in the practical implementation of numerical methods. If the step is described by the general formula$$\begin{aligned}& y_{n+1}=y_{n}+h \upvarphi\left(x_{n}, y_{n-1}, \ldots, y_{n-k} ; h\right) \\& x_{n+1}=x_{n}+h\end{aligned}$$then the local error is defined to be$$y_{n+1}-z\left(x_{n+1}\right)$$where $z(x)$ is the exact solution of the differential equation through the previous computed point, i.e. it satisfies $z\left(x_{n}\right)=y_{n}$.
- An estimate of the local error is normally obtained by using two different formulae on each step (see PREDICTOR-CORRECTOR METHODS). This estimate is kept below a user-specified tolerance, if necessary by rejecting steps and repeating with a reduced stepsize $h$. With further modifications this leads to efficient and reliable variable stepsize programs.
- The local error is related to the local truncation error (see DISCRETIZATION ERROR), which is defined in terms of the exact solution of the original problem rather than the current computed values used here.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]