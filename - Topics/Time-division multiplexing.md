---
aliases:
  - time division multiplexing
  - TDM
---
## Synthesis
- 
## Source [^1]
- Types of time-division multiplexing
	- [[Synchronous time-division multiplexing|Synchronous TDM]]
	- [[Asynchronous time-division multiplexing|Asynchronous TDM]]

## Source[^2]
- A method of sharing a transmission channel among multiple sources by allocating specific time slots to each source. Both synchronous and [[Asynchronous time-division multiplexing|Asynchronous TDM]] is used.
- [[Synchronous time-division multiplexing|Synchronous TDM]] does not require identity bits to be included in a message since the receiving device knows which device is transmitting at all times. The two main methods used in synchronous TDM to identify when a device's time slot occurs are polling and clocking. Polling requires a central device to interrogate each sending device when its time slot occurs. Clocking requires each device to have a synchronized clock and a prearranged sending sequence known to all devices. Polling and clocking waste time slots if a device has no data to send. More refined methods require devices to reserve their time slots ahead of time or allow devices to use time slots of other devices if they were unused on the previous cycle.
- Asynchronous TDM allows devices to send data as it is ready, without a prearranged ordering. Data must carry with it the identity of the sending device. Since devices may send data at the same time, collisions may occur, making the messages unreadable. Many networks that utilize asynchronous TDM use CSMA/CD (carrier sense multiple access with collision detection) to sense when messages have collided and must be retransmitted.
- TDM is used in baseband networking, and may also be used on channels of a broadband networking system.
- See also FREQUENCY DIVISION MULTIPLEXING, MULTIPLEXING.
## References

[^1]: https://nordvpn.com/cybersecurity/glossary/time-division-multiplexing/
[^2]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]