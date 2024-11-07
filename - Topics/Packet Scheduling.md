## Synthesis
- 
## Source[^1]
- [[First In First Out Queue|FIFO]]
	- Packets are sent out in the order they're received
	- Same thing as First Come, First Served (FCFS)[^2]
- [[Priority]]
	- Packets are sent out based on priority (lower = sooner), and in the order they're received 
		- Higher priority comes sooner than lower priority even if lower priority comes first
- [[RoundRobin]]
	- Every iteration (starting at 1) the router sends out a packet with that class and iterates (eg: class 1 to class 2); if there is no packet in that class the router sends out the next available class.
## References

[^1]: https://gaia.cs.umass.edu/kurose_ross/interactive/scheduling.php
[^2]: https://www.sciencedirect.com/topics/computer-science/first-come-first-served#:~:text=The%20idea%20of%20first%2Din,%2Dserved%20(FCFS)%20queueing.