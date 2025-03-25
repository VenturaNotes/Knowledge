## Synthesis
- 
## Source [^1]
- A method of handling memory in a system dealing with a number of simultaneously active processes. When a process becomes active, all its associated workspace and code is brought into main memory. As soon as the process is unable to continue for any reason, typically because the user associated with the process is providing input, the entire workspace and code of the process is copied out onto backing store, retaining only a small buffer capable of receiving input from the user. When user input ceases and the process is able to continue running, the workspace and code are rolled back into main memory. When the process requires to output results to the user or is awaiting further input from the user, it is rolled out onto backing store. See also SWAPPING.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]