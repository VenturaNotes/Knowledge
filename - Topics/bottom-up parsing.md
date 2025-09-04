## Synthesis
- 
## Source [^1]
- (shift-reduce parsing) A strategy for parsing sentences of a context-free grammar that attempts to construct a parse tree beginning at the leaf nodes and working 'bottom-up' toward the root.

  

Bottom-up (or shift-reduce) parsers work by 'shifting' symbols onto a stack until the top of the stack contains a right-hand side of a production. The stack is then 'reduced' by replacing the production's right-hand side by its left-hand side. This process continues until the string has been 'reduced' to the start symbol of the grammar.

  

The string of symbols to be replaced at each stage is called a handle. Bottom-up parsers that proceed from left to right in the input string must always replace the leftmost handle and, in so doing, they effectively construct a rightmost derivation sequence in reverse order. For example, a rightmost derivation of the string abcde might be

  

$$

\begin{aligned}

& S \Rightarrow A C D \Rightarrow A C d e \Rightarrow \\

& A c d e \Rightarrow a b c d e

\end{aligned}

$$

  

A bottom-up parser would construct this derivation in reverse, first reducing abcde to Acde, then to $A C d e$, then to $A C D$, and finally to the start symbol $S$. The handle at each

  

stage is respectively $a b, c, d e$, and $A C D$.

See also LR PARSING, PRECEDENCE PARSING.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]