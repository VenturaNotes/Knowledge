## Synthesis
- 
## Source [^1]
- A method of dealing with the effects of a loss of the incoming power supply. The system is equipped with a power-line monitor, which detects any longterm deviation in the supply-line voltage from acceptable limits, and causes a power-fail interrupt when deviations occur. The service routine for this interrupt stores the process descriptors for all processes in nonvolatile memory and then halts all activity. When the supply-line voltage is restored, the system restarts and can reinstate all processes from the previously stored process descriptors.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]