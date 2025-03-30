---
aliases:
  - B-tree
  - b-tree
---
## Synthesis
- 
## Source [^1]
- (1) (balanced multiway search tree) of degree $n(\geq 2)$. A multiway search tree of degree $n$ in which the root node has degree $\geq 2$, every nonterminal node other than the root has degree $k$, where$$n / 2 \leq k \leq n$$and every leaf node occurs at the same level. Originally defined by R. Beyer and E. McCreight, the data structure provides an efficient dynamic retrieval device.
- An extension to a B-tree is a $\mathbf{B}+$ tree, which is used as a primary index to an indexed file. It comprises two parts: a sequential index containing an entry for every record in the file, and a B-tree acting as a multilevel index to the sequential index entries. B+ trees are used in VSAM. 
- (2) A binary tree with no nodes of degree one.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]