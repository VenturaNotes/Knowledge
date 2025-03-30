## Synthesis
- 
## Source [^1]
- A method of implementing a memory management system. The available memory is partitioned into blocks whose sizes are always exact powers of two. A request for $m$ bytes of memory is satisfied by allocating a block of size $2^{p+1}$ where$$2^{p}<m \leq 2^{p+1}$$if no block of this size is available then a larger block is subdivided, more than once if necessary, until a block of the required size is generated. When memory is freed it is combined with a free adjacent block (if one exists) to produce a larger block, always preserving the condition that block sizes are exact powers of two.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]