## Synthesis
- 
## Source [^1]
- The process of modifying a system to make some aspects of it work more efficiently or use fewer resources. In software development, this can involve improving the performance of the code or reducing its complexity to enhance maintainability.

## Source[^2]
- The process of finding the best possible solution to a problem. In mathematics, this often consists of maximizing or minimizing the value of a certain function, perhaps subject to given constraints. Compare CONSTRAINED OPTIMIZATION

## Source[^3]
- The process of finding the best solution to some problem, where 'best' accords to prestated criteria. The word is used in a number of contexts. 
- (1) In mathematics the word is generally used to describe the theory and practice of maximizing, or minimizing, a function (known as an objective function) of several variables that may be subject to a set of constraints. The special case of a linear objective function is the subject of linear programming. The case of nonlinear objective functions, with or without constraints, is treated in a quite well-developed field. The unconstrained optimization problem (usually expressed as minimization) is:$$\operatorname{minimize} f(\boldsymbol{x})$$where $f(\boldsymbol{x})$ is the given objective function of $n$ real variables,$$x=\left(x_{1}, x_{2}, \ldots, x_{n}\right)^{\mathrm{T}}$$A necessary condition for a minimum is that$$\partial f / \partial x_{i}=0, i=1,2, \ldots, n$$which is a system of nonlinear equations. Newton's method can be applied, but in practice this technique has been extensively modified to improve computational efficiency. Matrix-updating methods are a broad class of methods that involve a sophisticated means of computing approximations to the matrices required in Newton's method.
- For constrained problems, $\boldsymbol{x}$ must also satisfy a system (possibly nonlinear) of equations or inequalities. Some of the ideas and methods for unconstrained problems can be suitably modified to handle the constraints. A successful technique is sequential quadratic programming.
- Optimization problems are widespread in control theory, chemical engineering, and many other fields. 
- (2) In programming the word is usually applied to part of the code-generation phase of a compiler, denoting production of object code that is in some sense optimal, i.e. making best use of the resources provided by the target machine, or at least using these resources in a manner that is not blatantly wasteful. Programs can be space-efficient in the sense of occupying minimal storage, or time-efficient in the sense of executing in the minimum time.
- Compiler optimization is usually directed toward generating time-efficient programs, and takes three forms. Global optimization seeks to reorder the sequencing of a program so as to eliminate redundant computations (moving invariant operations outside loop bodies, coalescing loops, etc.). Register optimization adjusts the allocation of machine registers to variables and intermediate quantities in such a way as to minimize the number of occasions on which a register has to be stored and later reloaded. Local (peephole) optimization seeks to adapt the code to exploit particular features of the machine architecture and to remove local mishandling such as loading a register with a value that it already contains.
## References

[^1]: https://spdload.com/blog/software-development-glossary/
[^2]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]
[^3]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]