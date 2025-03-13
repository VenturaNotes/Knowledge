## Synthesis
- 
## Source [^1]
- (star closure, Kleene closure, iteration) An operation on formal languages that gives for any language $L$ the language $L^{*}$, defined by $$\{\Lambda\} \cup L \cup L L \cup L L L \cup \ldots$$ where $\Lambda$ is the empty word. Thus a word $w$ is in $L^{*}$ if and only if it has the form $$w_{1} w_{2} \ldots w_{n}$$with each $w_{i}$ in $L$, i.e. is a concatenation of words in $L$. 
- The Kleene-plus $\left(L^{+}\right)$of $L$, is defined by$$L \cup L \cup L L \cup \ldots$$Thus $L^{+}$comprises the nonempty strings of $L^{*}$.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]