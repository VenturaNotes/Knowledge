---
aliases:
  - BOM
---
## Synthesis
- 
## Source [^1]
- The Unicode codepoint U+FEFF when occurring at the start of a file. Its purpose is to give file-reading software a means of determining which of several popular Unicode encoding schemes the file is using. Additionally, for some encodings it indicates whether the most- or least-significant byte comes first. If the software detects a byte pattern at the start of the file that represents this codepoint in a recognized encoding, it assumes that the rest of the file also uses this encoding. The file's content is considered to start at the position following the byte-order mark.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]