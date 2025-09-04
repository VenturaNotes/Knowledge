## Synthesis
- 
## Source [^1]
- (Veitch diagram) A graphical means for representing Boolean expressions so that the manner in which they can be simplified or minimized is made apparent. It may be regarded as a pictorial representation of a truth table or as an extension of the Venn diagram. The method was proposed by E. W. Veitch and modified slightly by M. Karnaugh. The Karnaugh maps for expressions involving one, two, three, and four variables are shown in the diagram. When $n=2$, for instance, the 00 square represents the term $a^{\prime} b^{\prime}$ (where ' denotes negation), the 11 square represents $a b$, and so on.
- Terms that differ in precisely one variable can be combined. Such terms will appear as adjacent squares on a Karnaugh map and so can readily be identified. For example, the terms $a b c$ and $a b c^{\prime}$ can be combined since$$a b c \vee a b c^{\prime}=a b$$
- These two terms should each occupy one square on the $n=3$ map and appear side by side, i.e. share a common edge. However, so too should the $a^{\prime} b^{\prime} c$ and the $a b^{\prime} c$ squares. This complication can be overcome by stipulating that the two edges marked with dashes should be identified or joined together, i.e. the Karnaugh map for $n=3$ should be drawn on one side of a ring of paper. When $n=4$ the situation is even more complex: the two edges marked with dashes are identified, as are the dotted edges. The map can then be viewed as drawn on the outside of a torus.
- Karnaugh maps are useful for expressions of perhaps up to six variables. When $n>6$, the maps become unwieldy and too complex. Alternative methods of simplification, such as the Quine-McCluskey algorithm, are then preferable.
- ![[Screenshot 2025-03-12 at 11.42.58 PM.png]]
	- Karnaugh maps
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]