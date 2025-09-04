## Synthesis
- 
## Source [^1]
- (1) (lock primitive) An indivisible operation that allows a process to ensure that it alone has access to a particular resource. On a single-processor system the indivisible nature of the operation can be guaranteed by turning off interrupts during the action, ensuring that no process switch can occur. On a multiprocessing system it is essential to have available a test and set instruction that, in a single uninterruptible sequence, can test whether a register's contents are zero, and if they are will make the contents nonzero. The same effect can be achieved by an exchange instruction. See also SEMAPHORE, UNLOCK. 
- (2) See LOCKS AND KEYS.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]