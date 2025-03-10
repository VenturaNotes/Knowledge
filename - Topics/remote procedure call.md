---
aliases:
  - RPC
---
## Synthesis
- 
## Source [^1]
- A procedure call in which the actual execution of the body of the procedure takes place on a physically distinct processor from that on which the procedure call takes place. In general the system invoking the procedure call is separate from the one executing it. Further the two systems and the communication channel linking them are all liable to fail in the period between the start of the procedure call and the final completion of execution and return of any results from the processor executing the procedure body to that executing the procedure call.
- These factors have given rise to a number of different proposals for the course of action to be followed in the event of one or other of the systems failing; essentially to have the procedure body executed either at least once (by retry) or at most once. These proposals tend to reflect the different priorities attached to the effect on the total system in the event of part of it failing.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]