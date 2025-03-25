## Synthesis
- 
## Source [^1]
- The code responsible for controlling use of a shared resource. Access to a shared resource must be subject to two requirements. It is essential to ensure that any process about to be granted use of a resource will not itself suffer damage, and that it will not cause damage to other processes. This can be thought of as establishing the correctness of the scheduling. Quite separately from this, where it is feasible to allow any of several processes to access a resource, then it is necessary to make a choice between them. This choice will generally have a bearing on the efficiency with which system resources are utilized, and is determined by the scheduling algorithm.
- When used without further qualification, the word scheduler refers to controlling the use of the processors. Scheduling of jobs is usually carried out in two stages. The high-level scheduler collects together a particular job mix that is to be executed at any one time, according to criteria that are thought to allow the system to be optimally used. The scheduling among these jobs on a very fine time scale is the province of the low-level scheduler (or dispatcher), which thus allocates processors to processes.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]