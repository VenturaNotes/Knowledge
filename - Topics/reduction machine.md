## Synthesis
- 
## Source [^1]
- A machine that evaluates expressions by successively reducing all component subexpressions until only simple terms representing data values remain. For each expression that is not a simple data value, a set of rules define what should be substituted when that expression appears. The machine operates by matching each subexpression of the expression currently being evaluated with its appropriate rule, and substituting as specified by that rule. This process of expression substitution continues until only simple data values remain, representing the value of the original expression.
- All subexpressions can be matched and substituted concurrently, and thus there is the potential for a high degree of parallelism. A major objective of reduction machines is to exploit this parallelism.
- Reduction machines represent one of the major examples of non von Neumann architecture, and are of considerable research interest. Traditional imperative programming languages are unsuited to reduction machines, so declarative languages are employed.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]