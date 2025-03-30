## Synthesis
- 
## Source [^1]
- A programming technique used to compensate for the slow and possibly erratic rate at which a peripheral device produces or consumes data. If the device communicates directly with the program, the program is constrained to run in synchronism with the device; buffering allows program and device to operate independently. Consider a program sending output to a slow device. A memory area (the buffer) is set aside for communication: the program places data in the buffer at its own rate, while the device takes data from the buffer at its own rate. Although the device may be slow, the program does not have to stop unless the buffer fills up; at the same time the device runs at full speed unless the buffer empties. A similar technique is used for input. See also DOUBLE BUFFERING.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]