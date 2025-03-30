## Synthesis
- 
## Source [^1]
- (dangling pointer) The memory access error that arises when a pointer contains the address of a variable that has been deallocated in memory (i.e. whose memory address has been removed from the program or is not contained at the address referenced by the pointer). For illustration, consider a block-structured language in which the block defines the scope of the variables therein declared. Consider then a pointer variable, $p$, with a global scope. If $p$ is assigned within the block the reference to (i.e. the memory address of) a local variable, x , it will still hold that reference at the end of the block. Any attempt to use the pointer $p$$\textemdash$still containing a reference to $x$$\textemdash$after the block will constitute a dangling reference.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]