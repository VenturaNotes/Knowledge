## Synthesis
- 
## Source [^1]
- A signal to a processor indicating that an asynchronous event has occurred. The current sequence of instructions is temporarily suspended (interrupted), and a sequence appropriate to the interruption is started in its place. Interrupts can be broadly classified as being associated with one of the following.
	- (a) Events occurring on peripheral devices. A processor having initiated a transfer on a peripheral device on behalf of one process may start some other process. When the transfer terminates, the peripheral device will cause an interrupt. See also INTERRUPT I/O.
	- (b) Voluntary events within processes. A process wishing to use the services of the operating system may use a specific type of interrupt, a supervisor call ([[SVC]]), as a means of notifying the supervisor.
	- (c) Involuntary events within processes. A process that attempts an undefined or prohibited action will cause an interrupt that will notify the supervisor.
	- (d) Action by operators. An operator wishing to communicate with the supervisor may cause an interrupt.
	- (e) Timer interrupts. Many systems incorporate a timer that causes interrupts at fixed intervals of time as a means of guaranteeing that the supervisor will be entered periodically.
- See also INTERRUPT HANDLER.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]