---
aliases:
  - interrupt I/O
---
## Synthesis
- 
## Source [^1]
- A way of controlling input/output activity in which a peripheral or terminal that needs to make or receive a data transfer sends a signal that causes a program interrupt to be set. At a time appropriate to the priority level of the I/O interrupt, relative to the total interrupt system, the processor enters an interrupt service routine (ISR). The function of the routine will depend upon the system of interrupt levels and priorities that is implemented in the processor.
- In a single-level single-priority system there is only a single I/O interrupt-the logical OR of all the connected I/O devices. The associated interrupt service routine polls the peripherals to find the one with the interrupt status set.
- In a multilevel single-priority system there is a single interrupt signal line and a number of device identification lines. When a peripheral raises the common interrupt line it also sets its unique code on the identification lines. This system is more expensive to implement but speeds the response.
- In a single-level multiple-priority system the interrupt lines of the devices are logically connected to a single processor interrupt in such a way that an interrupt from a highpriority device masks that of lower-priority devices. The processor polls the devices, in priority order, to identify the interrupting device.
- A multilevel multiple-priority system has both the property of masking interrupts according to priority and of immediate identification via identification lines.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]