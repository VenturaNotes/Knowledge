## Synthesis
- 
## Source [^1]
- Values are not calculated until they are needed

## Source[^2]
- lazy evaluation An execution mechanism in which an object is evaluated only at the time when, and to the extent that, it is needed. This allows programs to manipulate objects, such as lengthy or infinite lists, whose evaluation would otherwise be needlessly timeconsuming or indeed fail to terminate at all. An illustration is the problem of comparing two trees, $t_{1}$ and $t_{2}$, to test whether the leaves of $t_{1}$, read from left to right, form the same list as the leaves of $t_{2}$. The simplest solution is first to construct the two leaf-lists and then to compare them element by element. Lazy evaluation allows this program to interleave the construction of the two leaf-lists and then test for equality. The program can then terminate as soon as the lists are found to differ, without having unnecessarily constructed both lists in toto. See also STRICTNESS.
## References

[^1]: Gemini Pro
[^2]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]