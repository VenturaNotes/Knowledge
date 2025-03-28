## Synthesis
- 
## Source [^1]
- A context-free grammar that derives the same word by different derivation trees, or equivalently by different derivation sequences. A familiar programming language example is:

  

$$

\begin{aligned}

& \mathrm{S} \rightarrow \text { if } \mathrm{C} \text { then } \mathrm{S} \text { else } \mathrm{S} \\

& \mathrm{~S} \rightarrow \text { if } \mathrm{C} \text { then } \mathrm{S}

\end{aligned}

$$

  

where S and C stand for statement and condition. This grammar is ambiguous since the following compound statement

if c1 then if c2 then s2 else s1

has two interpretations, corresponding with two derivation trees, as shown in the diagram. See also inherENTLY amBiguOUS LANGUAGE.


- ![[Screenshot 2025-03-27 at 12.23.41 AM.png]]
  

Ambiguous grammar. Two derivation trees in an ambiguous grammar
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]