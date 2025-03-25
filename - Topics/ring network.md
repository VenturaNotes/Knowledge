---
aliases:
  - RING
---
## Synthesis
- 
## Source [^1]
- Each node connects to exactly two other nodes, forming a single continuous pathway for signals through each node - a ring
- ![[Screenshot 2025-01-22 at 4.32.06 AM.png|200]]
	- Ring network layout

## Source[^2]
- A network constructed as a loop of unidirectional links between network stations (nodes). It generally uses a bit-serial medium such as twisted pairs or coaxial cable. A master clock may be used to tell each station when to read and write bits, or the timing information may be encoded into the data as long as certain restrictions are met to prevent the ring from overflowing.
- Each station receives messages on its incoming link. Address and control information is present at the beginning of the message. Based on this information and the control procedure being used on the ring, the station must make two decisions: whether or not to make a copy of the message in its local memory, and whether to pass the message on via its outgoing link or delete the message from the ring. If a station determines that no message is being received on its incoming link, then it may have the option of inserting a message on its outgoing link.
- Several different control structures have been used on ring networks:
	- (a) token ring—a special bit pattern identifies control information: a station, upon receiving the control token, may insert a message into the ring and reissue the token;
	- (b) slotted ring-a series of 'slots' are continuously transmitted around the ring: a station detecting an unused slot may mark it 'in use' and fill it with a message;
	- (c) register insertion ring-a station loads a message into a shift register, then inserts the register into the ring when the ring is idle or at the end of any message; the register contents are shifted onto the ring. When the message returns to the register, the register may be removed from the ring.
## References

[^1]: https://en.wikipedia.org/wiki/Ring_network#:~:text=A%20ring%20network%20is%20a,the%20way%20handling%20every%20packet.
[^2]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]