---
aliases:
  - mapping table
---
## Synthesis
- It's a mapping of characters to other characters or `None`
	- #question What does mapping to `None` look like?
- Used by string methods like `str.translate()` to perform character-by-character replacements. 
	- #question I would like to see an example
- `str.maketrans()` is a static method that creates such a translation table. It takes three optional arguments:
    1.  `x`: A string where each character in `x` will be replaced by the character at the same position in `y`.
    2.  `y`: A string of characters to replace with. Must be the same length as `x`.
    3.  `z`: A string of characters to be deleted from the original string.
- #question I would like to see an example for `str.maketrans()` and show the output in python
## Source [^1]
- (look-up table) A table of information stored within a processor or a peripheral that is used to convert encoded information into another form of code with the same meaning.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]