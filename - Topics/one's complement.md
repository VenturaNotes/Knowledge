## Synthesis
- Given 3 16-bit words:
	- A = 1101101010111101
	- B = 1010101010101010
	- C = 1111000011110000
- Adding words together would give
	- A + B + C = 100111011001010111 [^1] in binary
- Take the one's complement (invert all bits)
	- 011000100110101000 [^2]
- Then append this one's complement checksum (011000100110101000) to the header
## Source[^3]
- The one's complement of a value is obtained by simply changing the
	- 1's to 0's
	- 0's to 1's
- Example
	- 110010101 $\to$ 001101010
## References

[^1]: https://planetcalc.com/911/
[^2]: https://www.browserling.com/tools/invert-binary
[^3]: [[(Home Page) Python MCQ by Sanfoundry]]