---
aliases:
  - ACK
---
## Synthesis
- 
## Source[^1]
- ACK packets acknowledge the receipt of data segments

## Source[^2]
- (1) A message that describes the status of one or more messages sent in the opposite direction. A [[positive acknowledgment]] (ACK) confirms that the previous messages were received correctly. A [[negative acknowledgment]] (NAK) indicates that the previous messages were not received correctly and should be retransmitted. In some protocols, acknowledgments are also used as a simple form of flow control: sending an ACK implies that another message may be sent in the same direction as the message being acknowledged.
- Different layers of a protocol hierarchy may have their own acknowledgment systems operating simultaneously. For example, an end-to-end transport protocol may be used to send a message reliably from one host to another in a packet switching network. When the message reaches its destination, an acknowledgment will be generated and sent in the opposite direction. Both the original message and its acknowledgment will cause data link layer acknowledgments to be generated as they travel from node to node in the network. See also BACKWARD ERROR CORRECTION. 
- (2) Output to the operator or user of a graphics system that indicates that some input has been received. See also PROMPT, ECHOING, FEEDBACK.
## Source[^3]
- In some digital communication protocols, ACK -- short for 'acknowledgement' -- refers to a signal that a device sends to indicate that data has been received successfully.
## References

[^1]: ChatGPT
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: https://www.techtarget.com/searchnetworking/definition/ACK