## Synthesis
- 
## Source [^1]
- (dangling pointer) The memory access error that arises when a pointer contains the address of a variable that has been deallocated in memory (i.e. whose memory address has been removed from the program or is not contained at the address referenced by the pointer). For illustration, consider a block-structured language in which the block defines the scope of the variables therein declared. Consider then a pointer variable, $p$, with a global scope. If $p$ is assigned within the block the reference to (i.e. the memory address of) a local variable, x , it will still hold that reference at the end of the block. Any attempt to use the pointer $p$$\textemdash$still containing a reference to $x$$\textemdash$after the block will constitute a dangling reference.

## Source[^2]
### Rust
- A reference that points to deallocated memory (memory that has been freed)
	- #question What would this look like in Rust (if possible?)
- Rusts has a borrow checker which prevents dangling references
	- #question What is a borrow checker, how does it work, and what does an example look like? 
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) 500+ Rust Interview Questions by Applyre]]