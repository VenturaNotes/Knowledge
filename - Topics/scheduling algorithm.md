## Synthesis
- 
## Source [^1]
- The method used to determine which of several processes, each of which can safely have a resource allocated to it, will actually be granted use of the resource. The algorithm may take into account the priority of the user associated with the process, the requirement to maintain high utilization of system resources, and deadlines for the job.
- For example, in a priority time slicing system, the processes awaiting execution are organized in several queues with the higher-priority queues having a smaller time quantum. Whenever a processor becomes available for scheduling, the oldest process that is free to run in the highest-priority queue is started.
- If this process runs to the end of its quantum without generating an interrupt then it will be rescheduled into a lower-priority queue with a larger quantum. If, before the quantum has expired, the process generates an interrupt then it will be returned either to the same queue or possibly to a higher-priority queue with a shorter quantum. If the process is itself interrupted by some external event that allows the rescheduling of a higher-priority process (with a shorter quantum) then again the interrupted process is returned to the queue from which it originated.
- The net effect is that low-priority processes, with long quanta, are likely to be interrupted by the completion of input/output transactions on behalf of higher-priority processes, which will thus be freed for further processing.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]