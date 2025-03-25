---
aliases:
  - SDLC
---
## Synthesis
- 
## Source [^1]
- A data link control protocol originally developed by IBM, based on the use of frames to delimit message boundaries, providing only link-layer functions. Frames consist of an 8-bit frame delimiter (or 'flag'), an 8-bit address, an 8-bit control field, a variable-length user information field, a 16-bit frame check sequence, and a final 8-bit frame delimiter. The flag consists of the special character$$01111110$$and is the only occasion on which six successive ones appear. Bit stuffing is used to ensure that where the user's information contains five contiguous ' 1 's, the system inserts an additional ' 0 ', which is removed at the receiver.
- The end-stations are designated as either a primary or a secondary station. There is only one primary station, which initiates and terminates link activity and is responsible for error recovery and for link sharing among multiple secondary stations. The address field has two special values: 0 , which is reserved for testing, and 255 , which indicates that this is a broadcast frame. The control field is used to carry acknowledgments that frames have been received correctly, or that an error has occurred and that a designated frame is to be retransmitted.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]