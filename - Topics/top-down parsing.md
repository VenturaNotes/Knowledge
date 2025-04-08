## Synthesis
- 
## Source [^1]
- A strategy for parsing sentences of context-free grammars that attempts to construct a parse tree from the top down. The term includes techniques that may or may not involve backtracking.
- Beginning with a parse tree consisting of just the start symbol of the grammar, a topdown parser attempts to expand those leaf nodes labelled by nonterminals from left to right using the productions of the grammar. As leaves labelled by terminals are created they are matched against the input string. Should the match fail, new alternatives for the interior nodes are tried in a systematic way until the entire input string has been matched or no more alternatives are possible. A top-down parser without backtracking uses the information contained in the portion of the input string not yet matched to decide once and for all which alternatives to choose. The LL parsing technique is the most powerful example of the top-down strategy.
- Top-down parsing is often implemented as a set of recursive procedures, one for each nonterminal in the grammar, and is then called [[recursive descent parsing]].
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]