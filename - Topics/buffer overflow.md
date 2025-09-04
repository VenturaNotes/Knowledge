## Synthesis
- 
## Source [^1]
- A common type of vulnerability where a program does not check the quantity of input before reading it into a fixed length array or buffer. In some cases the excess input will be discarded, but if the programming language does not enforce the bounds of the array then memory locations adjacent to the array may be overwritten, replacing their correct values. In the worst case this may allow the program counter to be altered, directing the computer to execute code placed in the buffer by the attacker.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]