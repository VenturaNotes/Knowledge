---
aliases:
  - REs
  - regular expression
  - RE
---
## Synthesis
- 
## Source [^1]
- An expression built from finite formal languages (i.e. finite sets of strings) using the operations of union, concatenation, and Kleene star. For example, the following two regular expressions each denote the set of all strings of alternating as and $b$ s:$$\begin{aligned}& \{a, \Lambda\}\{\text {ba}\}^{*}\{\Lambda, b\} \\& \{b a\}^{*} \cup\{a\}\{\text {ba}\}^{*} \cup\{\text {ba}\}^{*}\{b\} \cup \\& \{a\}\{\text {ba}\}^{*}\{b\}\end{aligned}$$where $\Lambda$ is the empty string. A language is regular if and only if it is representable by a regular expression. Thus the class of regular languages is the smallest one that contains all finite languages and is closed under concatenation, union, and star-the so-called [[regular operations]]. These three operations correspond to 'sequence', 'choice', and 'iteration' in structured iterative programs.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]