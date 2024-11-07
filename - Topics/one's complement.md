## Synthesis
- 
## Source[^1]
- Given 3 16-bit words:
	- A = 1101101010111101
	- B = 1010101010101010
	- C = 1111000011110000
- Adding words together would give
	- A + B + C = 100111011001010111 [^2] in binary
- Take the one's complement (invert all bits)
	- 011000100110101000 [^3]
- Then append this one's complement checksum (011000100110101000) to the header

## References

[^1]: ChatGPT
[^2]: https://planetcalc.com/911/
[^3]: https://www.browserling.com/tools/invert-binary