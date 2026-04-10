## Synthesis
- 
## Source [^1]
- (1) See STACK (def. 1). 
- (2) When using source code control, the process or command by which a software developer sends committed changes (see COMMIT) to the master repository. Compare PULL.
## Source[^2]
- An operation required in many systems to store a return address of a section of code when the normal sequence of instructions is changed. For example, when an interrupt occurs, a program's normal sequential flow will be changed but returned to at some subsequent time. On many computing systems a special section of memory, called the stack, is allocated for storing these return addresses. Placing addresses onto, and removing them from, the stack are normally achieved by the operations PUSH and POP. A special register, normally referred to as the stack pointer (SP), is used to address the stack.
- The PUSH instruction places a value, taken from a register, onto the stack. Thus:
	- PUSH A
- will cause the value in the A register to be left at the top-of-stack position determined by the current value of the stack pointer. The POP instruction reverses this effect. Thus:
	- POP B
- would load B with the value taken from the top of stack. The names PUSH and POP given to these instructions reflect the image of the stack as a spring-powered store of values; new items added to the top 'push down' the stack, while items taken off cause the values beneath to 'pop up'.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]