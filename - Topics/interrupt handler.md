---
aliases:
  - IH
---
## Synthesis
- 
## Source [^1]
- A section of code to which control is transferred when a processor is interrupted. The interrupt handler then decides on what action should be taken. For instance, a first level interrupt handler (FLIH) is the part of an operating system that provides the initial communication between a program or a device and the operating system. When an interrupt occurs, the current state of the system is stored and the appropriate FLIH is executed: it leaves a message for the operating system and then returns, restoring the system to its original state and allowing the original task to continue as though nothing had happened. The operating system will periodically check for new messages and perform the appropriate actions.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]