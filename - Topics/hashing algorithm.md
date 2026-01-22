---
aliases:
  - hash algorithm
tags:
  - in-progress
---
## Synthesis
- The specific set of rules or mathematical procedure used to convert data of arbitrary size into a fixed-size value (the [[hash value]]).
- Python's built-in hash() function is cryptographically secure and robust
## Source [^1]
- An algorithm that, for a given key $k$, yields a function $f(k)$; this in turn yields the starting point for a [[hash search]] for the key $k$. The function $f$ is called the hash function. A typical hash function is the remainder modulo $p$, where $p$ is a prime,$$f(k) \equiv k(\text{mod } p)$$where $k$ is interpreted as an integer. Another hash function uses a constant $A$ and defines $f(k)$ as the leading bits of the least significant half of the product $A k$. See also HASHING.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]