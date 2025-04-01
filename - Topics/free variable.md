## Synthesis
- 
## Source [^1]
- In an expression, a variable whose value must be known in order for the whole expression to be evaluated. The idea depends on distinguishing different ways in which variables can occur in expressions; it arises in connection with all variable-binding operators, such as the logical quantifiers and function symbols. It can also be seen as a formalization of the idea of global and local variables in programs.

  

For example, in the following lambda expression,

  

$$

\lambda f \cdot g(f(\lambda x \cdot x), x, y)

$$

  

the variable $x$ occurs three times. The first occurrence, since it immediately follows a $\lambda$, introduces a new 'binding' of $x$, and is therefore called a binding occurrence. The second occurrence of $x$ falls inside the 'scope' of this binding and is therefore called a bound occurrence. The third $x$ is not within the scope of any such binding and is therefore called a free occurrence. Equally, the variable $f$ has a binding occurrence and a bound occurrence, while $g$ and $y$ just have one free occurrence each. Since only $x, y$, and $g$ have free occurrences, they are referred to as the free variables of the expression. The value of the whole expression then depends on what values are given to these free occurrences.

  

Note that freeness depends on the expression under consideration; thus, although $f$ does not occur free in the whole expression above, it does so in the subexpression

  

$$

g(f(\lambda x \cdot x), x, y)

$$
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]