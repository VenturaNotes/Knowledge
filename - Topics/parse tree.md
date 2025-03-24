## Synthesis
- 
## Source [^1]
- (syntax tree) A tree defining the syntactic structure of a sentence in a context-free language. The interior nodes are labelled by nonterminals of the context-free grammar; the descendants of a node labelled by $A$, say, spell from left to right the righthand side of some production having left-hand side $A$. The leaf nodes of a parse tree may be terminals or nonterminals. If all the leaves are terminals then they spell from left to right a sentence of the language.
- ![[Screenshot 2025-03-23 at 12.19.32 AM.png|300]]
	- Parse tree.
- An example of a parse tree is shown in the diagram. It is assumed that the grammar in question has productions$$A \rightarrow B C, B \rightarrow b, C \rightarrow c c$$Note that it is conventional for the top of the tree to be its root and the bottom to be its leaves.
- An early stage in compiling a program usually consists of generating a parse tree in which the constructs that make up the program are expressed in terms of the syntax of the programming language.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]