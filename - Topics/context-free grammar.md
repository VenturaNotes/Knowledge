## Synthesis
- 
## Source [^1]
- A grammar in which the left-hand side of each production is a single nonterminal, i.e. productions have the form

  

$$

A \rightarrow \alpha

$$

  

(read as 'rewrite $A$ as $\alpha^{\prime}$ '), where $\alpha$ is a string of terminals and/or nonterminals. These productions apply irrespective of the context of $A$. For brevity one writes

  

$$

A \rightarrow \alpha_{1}\left|\alpha_{2}\right| \ldots \mid \alpha_{n}

$$

  

to indicate the separate productions

  

$$

A \rightarrow \alpha_{1}, A \rightarrow \alpha_{2}, \ldots, A \rightarrow \alpha_{n}

$$

  

As an example, the following generates a simple class of arithmetic expressions typified by $(a+b) \times c$ :

  

$$

\begin{aligned}

& \mathrm{E} \rightarrow \mathrm{~T} \mid \mathrm{T}+\mathrm{E} \mid(\mathrm{E}) \\

& \mathrm{T} \rightarrow \mathrm{E} \mid \mathrm{E} \times \mathrm{T} \mid a \mid b \mid c

\end{aligned}

$$

  

The BNF notation used in defining the syntax of programming languages is simply a context-free grammar.

  

Context-free grammars are a class of phrase-structure grammar (PSG). GPSG represents the principal attempt at constructing context-free grammars capable of characterizing the grammars of natural language.

  

Compare CONTEXT-SENSITIVE GRAMMAR.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]