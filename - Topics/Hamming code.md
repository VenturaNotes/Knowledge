## Synthesis
- 
## Source [^1]
- A digital code that helps in the process of error correction. The transmission line of a serial communications system can be susceptible to noise pulses that flip bits to incorrect values. There is a need for altered digital transmission data to be identified and perhaps corrected. Hamming code is one such mechanism. A message of four bits is embedded in a transmission of seven bits. The three extra redundant bits, known as check bits, provide enough information that a one-bit error anywhere in the seven bits can be corrected.
- In the encoding process, the message bits may be designated $\mathrm{M}_3\mathrm{M}_2\mathrm{M}_1\mathrm{M}_0$ and the check bits $\mathrm{C}_2\mathrm{C}_1\mathrm{C}_0$. Three functions have to be identified relating to the Ms and equating to the Cs:$$C _ {2} = f _ {2} \left(M _ {3}, M _ {2}, M _ {1}\right); C _ {1} = f _ {1} \left(M _ {3}, M _ {2}, M _ {0}\right); C _ {0} = f _ {0} \left(M _ {3}, M _ {1}, M _ {0}\right)$$
- There are many Boolean functions $f$ that could be chosen here, and Hamming chose the following: have each $C_i$ be the bit that makes the parity - the sum of the bits, either even or odd - of the string $\{C_i, M_x, M_y, M_z\}$ always the same. Then $C_i$ becomes 0 or 1, whichever is needed to make the number of 1s in the set $\{C_i, M_x, M_y, M_z\}$ even (assuming even parity). The table shows the Hamming code for four-bit data.
- ![[Pasted image 20260326120855.png|300]]
	- Hamming code for 4-bit data
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]