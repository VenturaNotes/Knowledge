---
aliases:
  - EBNF
---
## Synthesis
- 
## Source [^1]
- A notation for defining the syntax of a programming language based on BNF (Backus normal form). EBNF overcomes the main disadvantages of BNF, which are that repetition has to be expressed by a recursive definition and that options and alternatives require auxiliary definitions, by incorporating a notation to specify repetition and alternation. For example, compare the BNF definitions shown in Fig. 1 with the equivalent EBNF definitions in Fig. 2. EBNF uses $\{\ldots\}$ to denote repetition, $\mid$ to denote alternatives, (...) to group constituents, and \[...\] to denote options. Another significant difference is in the way literals are distinguished from syntactic categories. In BNF, literals are plain and syntactic categories are enclosed in angle brackets; in EBNF, syntactic categories are plain and literals are enclosed in quotation marks. This allows EBNF to define its own syntax.
- Extended BNF
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]