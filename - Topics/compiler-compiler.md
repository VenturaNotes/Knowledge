## Synthesis
- 
## Source [^1]
- A program that accepts the syntactic and semantic description of a programming language and generates a compiler for that language. The syntax is expressed in BNF or a derivative thereof, and must conform to the rules dictated by the parsing technique to be used in the generated compiler. The semantics of the language are usually described by associating a code-generation procedure with each syntactic construct, and arranging to call the procedure whenever the associated construct is recognized by the parser. Thus the user still has to design the run-time structures to be used, and decide how each syntactic construct is to be mapped into machine operations. Then he/she has to write the code-generating procedures. A compiler-compiler is therefore a useful tool to aid the compiler writer, but nothing more. 
- Strictly speaking a compiler-compiler includes a parser generator as a component part, but the two terms are often used synonymously. See also LEX, YACC.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]