## Synthesis
- 
## Source [^1]
- A relationship between processes such that each has some part (the critical section) that must not be executed while the critical section of another is being executed. There is thus exclusion of one process by another. In certain regions of an operating system, for example those dealing with the allocation of nonsharable resources, it is imperative to ensure that only one process is executing the relevant code at any one time. This can be guaranteed by the use of semaphores: at entry to the critical region of code a semaphore is set; this inhibits entry to the code by any other process until the semaphore is reset as the last action by the process that first entered the critical region.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]