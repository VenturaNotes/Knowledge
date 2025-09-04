## Synthesis
- 
## Source [^1]
- Denoting a process that is restarted by the occurrence of an interrupt. When a process initiates an auxiliary action to be carried out by some other process (for example, when a device driver starts the hardware action that will output data to a disk drive), the initiating process may need to suspend its own activities until such time as the auxiliary action runs to completion. The initiating process may do this by running a loop of instructions that repeatedly tests whether the auxiliary action has been completed, then loops back to repeat the test if the action is not yet complete. No other process can run during this time, which is clearly wasteful. In an interrupt-driven process some other process is allowed to run, and the device responsible for the auxiliary action is able to signal with an interrupt that it has completed its work. The operating system will detect the occurrence of an interrupt, determine which process is now free to proceed, and schedule that process to be restarted. See also POLLING.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]