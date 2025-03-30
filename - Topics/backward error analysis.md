## Synthesis
- 
## Source [^1]
- (backward correction) Error correction that occurs in a channel through the detection of errors by the receiver: the receiver responds to any errors in a block by requesting the transmitter to retransmit the affected block. Backward correction requires a return channel, by contrast with forward error correction.
- There are two ways in which the return channel can be used to indicate errors: positive acknowledgment and negative acknowledgment. With positive acknowledgment, the receiver returns confirmation of each block received correctly, and the transmitter is prepared to retransmit a block that is not acknowledged within an appropriate time. With negative acknowledgment, the receiver returns a request to retransmit any block received erroneously, and the transmitter is prepared to retransmit such a block (implying that the transmitter retains a copy of every block sent, indefinitely).
- Since the return channel itself may be prone to errors, and to limit the amount of storage necessary at the transmitter, the positive acknowledgment and retransmission (PAR) technique is generally preferred. See also ERROR-DETECTING CODE.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]