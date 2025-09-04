---
aliases:
  - L-system
---
## Synthesis
- 
## Source [^1]
- A way of generating infinite sets of strings. L-systems are similar to grammars with the crucial difference that, whereas for grammars each step of derivation rewrites a single occurrence of a nonterminal, in an L-system all nonterminals are rewritten simultaneously. An L-system is therefore also known as a kind of [[parallel rewriting system]]. L-systems were first defined in 1968 by A. Lindenmeyer as a way of formalizing ways in which biological systems develop. They now form an important part of formal language theory.
- The subject has given rise to a large number of different classes of L-systems. The simplest are the DOL systems, in which all symbols are nonterminals and each has a single production. For example, with productions$$\begin{aligned}& A \rightarrow A B \\& B \rightarrow A\end{aligned}$$one derives starting from $A$ the sequence $$A \space A B \space A B A \space A B A A B \space A B A A B A B A \ldots$$
- This is called the sequence of the DOL-system, while the set of strings in the sequence is called the language. The growth-function gives the length of the $i$ th string in the sequence; in the example this is the Fibonacci function.
- Note that the productions define a homomorphism from $\{A, B\}^{*}$ to itself. A DOL-system consists therefore of an alphabet $\Sigma$, a homomorphism $h$ on $\Sigma^{*}$, and an initial $\Sigma$-word $w$. The sequence is then$$w \space h(w) \space h(h(w)) \ldots$$The letter D in DOL stands for deterministic, i.e. each symbol has just one production. An OL-system can have many productions for each symbol, and is thus a substitution rather than a homomorphism. Other classes are similarly indicated by the presence of various letters in the name: T means many homomorphisms (or many substitutions); E means that some symbols are terminals; P means that no symbol can be rewritten to the empty string; an integer $n$ in place of O means context-sensitivity$\textemdash$the rewriting of each symbol is dependent on the $n$ symbols immediately to the left of it in the string.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]