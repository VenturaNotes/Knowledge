## Synthesis
- 
## Source [^1]
- The two laws of a Boolean algebra that provide a method of expressing the complement of a complex expression in terms of the complements of individual components:$$\begin{aligned}& (x \vee y)^{\prime}=x^{\prime} \wedge y^{\prime} \\& (x \wedge y)^{\prime}=x^{\prime} \vee y^{\prime}\end{aligned}$$The pair is self-dual. The term de Morgan's laws is often used to describe instances of these laws as they apply in particular cases, e.g. to sets or to logical expressions. The laws are named for Augustus de Morgan.
## Source[^2]
- Two mathematical laws of Boolean algebra that provide a means of expressing the complement (i.e. negation) of an expression in terms of the complements of individual elements of the expression:$$\overline{A + B + C + D + \dots} = \overline{A} \cdot \overline{B} \cdot \overline{C} \cdot \overline{D} \cdot \dots$$$$\overline{A \cdot B \cdot C \cdot D \cdot \dots} = \overline{A} + \overline{B} + \overline{C} + \overline{D} + \dots$$where + and $\cdot$ are the operators AND and OR and a horizontal bar denotes a complement. The laws provide a conversion between NAND and NOR gates (see LOGIC CIRCUIT), and also enable a designer to move between positive and negative logic forms.
## Source[^3]
- (logical version) These are the logical equivalent of the set-theoretic version. They capture the fact that for it not to be true that a family of statements all hold only one need be false. Given a family of statements $P_i$, where $i \in I$, then$$\neg(\exists i \in I P_i) \iff$$
	- [ ] Is this incomplete?
---
- (set theoretic version) For sets $A$ and $B$, $(A \cup B)' = A' \cap B'$ and $(A \cap B)' = A' \cup B'$, where ' denotes complement. These are De Morgan's laws. These laws extend naturally to more than two sets:$$\left(\bigcup_{i \in I} A_i\right)' = \bigcap_{i \in I} A_i', \left(\bigcap_{i \in I} A_i\right)' = \bigcup_{i \in I} A_i'.$$
	- #errata Seems to not have been written properly in textbook
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]
[^3]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]