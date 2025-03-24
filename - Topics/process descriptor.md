## Synthesis
- 
## Source [^1]
- A set of information that defines the status of resources allocated to a process. When a system contains a number of processes, any of which may be active at any one time, there will be for each process a descriptor defining the status of that process. Within the descriptor the ready indicator shows whether the particular process is able to proceed, or whether it must await the completion of some other activity before it can be executed by the CPU. For processes that are unable to run, the process descriptor will indicate the reason for which that process is suspended and will contain pointers to relevant queues and semaphores. The process descriptor will also contain a copy of the contents of the processor registers that are to be reinstated when the process is restarted. When a process is running, the process descriptor will contain information (the resource descriptor) on the resources allocated to the process and on the permissible operations on these resources.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]