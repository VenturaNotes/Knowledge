## Synthesis
- 
## Source [^1]
- In digital communications, the representation of a signal for transmission down a communications channel. Coding, the process of transforming the input message or signal into digital form, follows a defined set of rules; these rules form the codes. Most digital codes result in a signal having two levels $\textendash$ binary one and binary zero. Once coded, the signal is transmitted across the channel, and when received it is decoded to restore the original message or signal. The general process of coding as it relates to digital communication is shown in Fig. a (see also ENCRYPTION; MULTIPLEX OPERATION; MODULATION).
- ![[Screenshot 2026-03-10 at 12.35.57 AM.png]]
	- (a) Digital coding and communications
	- Parts
		- Input signal
		- Code
		- Encrypt
		- Multiplex
		- Modulate
		- Demodulate
		- Demultiplex
		- Decrypt
		- Decode
		- Output signal
- One of the simplest codes is the Baudot code shown in Fig. b. This code has 5 bits and so is capable of handling $2^{5}$ or 32 bits of information or 32 different input symbols. It is able to transmit the 26 letters of the alphabet plus all the numbers and common special characters by use of a pair of special codes that switch from one set of characters to the other: a 11111 symbol is transmitted indicating that all the symbols that follow are letters until a 11011 symbol is transmitted, which indicates that all the symbols that follow are special characters.
- ![[Screenshot 2026-03-10 at 12.37.19 AM.png|400]]
	- (b) Baudot code
	- Parts
		- Letters: 11111
		- Figures, punctuation marks etc.: 11011
- The separation between any two symbols in a code is called the code distance; for example, the code distance between symbols 01001 and 01100 is two, indicated by two bits having changed. The coding weight is defined as the number of nonzero bits of the symbol.
- When a digital signal is to be transmitted down a channel it is frequently divided into blocks of data bits (also called information bits or message bits). Each block consists of a fixed number $(k)$ of bits and represents one of $2^{k}$ different input characters. Before transmission these data bits have added to them a header and a tail; the tail often contains error-detection bits such as parity checking bits or parity checking codes. Such codes are known as block codes. The ratio of the number of data bits in each block to the total number of bits in the block is called the code rate. The use of codes and error-detecting and error-correcting bits gives coded digital transmission a coding gain compared with uncoded digital transmission.
- Some types of coding refer to how the signal is transmitted down the channel; examples are the Manchester code, the name given to biphase pulse code modulation (see PULSE MODULATION), and the trellis code, which employs bandwidth expansion to achieve a reduction in transmission errors. Others are codes that intentionally introduce unused symbols to permit error correction as well as error detection. Examples of such linear block codes include Golay codes, which use one half of the available symbols, and BCH (Bose-Chadhuri-Hocquenghem) codes, which are a set of codes that allow multiple error correction.
- In many situations the sequence of bits to be transmitted will contain a lengthy run of a specific symbol. Rather than code each symbol it is more efficient to describe the run with an efficient substitution code, such codes being called run-length codes; for example, a run of spaces (common in text) is substituted by a control character followed by the number of spaces. With NRZ (nonreturn to zero) codes, the signal line does not return to zero between a succession of '1' bits.
- Enhanced error-correction performance can be achieved by coding an already coded message. The result is a concatenated code, an example of which is the cross-interleave Reed-Solomon code (CIRC), a coding system used in compact disc digital audio systems.
- If the channel down which the digital signal is to be sent suffers time-dependent distortion such as results from multipath interference, the effect can be reduced by interleaving the coded message before transmission and deinterleaving upon reception. An example of interleaving is shown in Fig. c.
- ![[Screenshot 2026-03-10 at 12.44.28 AM.png]]
	- (c) Interleaving
	- Parts
		- Original coded message comprising 4 symbols, A, B, C, and D
		- Interleaved coded message of the same 4 symbols
- In spread-spectrum systems, the input signal is modulated onto a high-speed digital signal called a PN (pseudonoise) sequence $\textendash$ a long pseudorandom sequence of symbols $\textendash$ which achieves the wide band-spreading characteristic of spread-spectrum signals. A large number of different PN sequences can be used to transmit simultaneously many different information signals down a single wideband channel; this is achieved by means of CDMA, code division multiple access (see DIGITAL COMMUNICATIONS). When the PN sequences do not align with each other they are said to be orthogonal codes.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]