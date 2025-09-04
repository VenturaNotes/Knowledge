## Synthesis
- 
## Source [^1]
- A resource that can only be in use by at most one process at any one time. A common example is a section of code that deals with the allocation or release of a shared resource, where it is imperative that no more than one process at a time is allowed to alter the data that defines which processes have been allocated parts of the resource.
- Where several asynchronous processes are required to coordinate their access to a critical resource, they do so by controlled access to a semaphore. A process wishing to access the resource issues a P operation that inspects the value of the semaphore; the value indicates whether or not any other process has access to the critical resource. If some other process is using the resource then the process issuing the P operation will be suspended. A process issues a V operation when it has finished using the critical resource. The V operation can never cause suspension of the issuing process but by operating on the value of the semaphore may allow some other cooperating process to commence operation.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]