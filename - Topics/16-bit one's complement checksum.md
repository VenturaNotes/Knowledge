## Synthesis
- A checksum algorithm that adds up all the 16-bit words in the data (including the UDP header), taking the one's complement of the sum (invert all the bits), and appending it to the UDP header as the checksum value
- The receiver recalculates the checksum using the received data and compares it to the checksum value in the header to detect errors
## Source [^1]
- 
## References

[^1]: