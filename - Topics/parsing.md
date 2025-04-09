## Synthesis
- 
## Source [^1]
- The process of deciding whether a string of input symbols is a sentence of a given language and if so determining the syntactic structure of the string as defined by a grammar (usually context-free) for the language. This is achieved by means of a program known as a [[parser]] or syntax analyzer. For example, a syntax analyzer of arithmetic expressions should report an error in the string$$1-+2$$since the juxtaposition of the minus and plus operators is invalid. On the other hand the string$$1-2-3$$is a valid arithmetic expression with structure specified by the statement that its subexpressions are$$1,2,3 \text { and } 1-2$$(Note that $2-3$ is not a subexpression.)
- The input to a parser is a string of tokens supplied by a lexical analyzer. Its output may be in the form of a parse tree or a derivation sequence. See also BOTTOM-UP PARSING, PRECEDENCE PARSING, TOP-DOWN PARSING.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]