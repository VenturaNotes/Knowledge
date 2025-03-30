## Synthesis
- 
## Source [^1]
- A grammar in which each production has the form

  

$$

\alpha A \beta \rightarrow \alpha \gamma \beta

$$

  

where $A$ is a nonterminal and $\alpha, \beta$, and $\gamma$ are arbitrary words with $\gamma$ nonempty. If $\gamma$ was allowed to be empty then any type 0 (equivalently, recursively enumerable) language of the Chomsky hierarchy could be generated. To derive the empty word, a production

  

$$

S \rightarrow \Lambda

$$

  

must also be included, with $S$ not occurring in the right-hand side of any production. The term context-sensitive refers to the fact that $A$ can be rewritten to $\gamma$ only in the 'context' $\alpha \ldots \beta$.

  

In a length-increasing grammar each production has a right-hand side at least as long as its left-hand side (apart possibly from $S \rightarrow \Lambda$ ). Clearly any context-sensitive grammar is length-increasing, but it can also be shown that any length-increasing grammar is equivalent to a context-sensitive one. Context-sensitive grammars are a class of phrase-structure grammar.

  

# Compare CONTEXT-FREE GRAMMAR.

## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]