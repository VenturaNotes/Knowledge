---
aliases:
  - A/D converter
  - ADC
  - analogue to digital converter
---
## Synthesis
- 
## Source [^1]
- A device that can accept an analogue, i.e. continuous, signal whose amplitude lies within a given range, and produce an equivalent digital signal, i.e. an $n$-bit parallel binary word that represents this analogue signal. The analogue signal is 'examined' at discrete fixed intervals of time by means of a sampling process in order to produce the digital signal. Analogue signals originating from devices such as analogue sensors or tachogenerators may thus be converted into a form that can then be processed by, say, a microprocessor.

  

The resolution of an A/D converter gives the smallest change in analogue input that can be discriminated by the device. If the resolution of an $n$-bit $\mathrm{A} / \mathrm{D}$ converter is $\Delta V$, then its range is either

  

$$

0 \text { to } \Delta V\left(2^{n}-1\right)

$$

  

or

  

$$

\pm \Delta V\left(2^{n-1}-1\right)

$$

  

according as it is unsigned or signed. In practice, the value of $n$ is usually $8,10,12,14$, or 16 . Since the resolution is finite, the conversion process introduces quantization noise (see DISCRETE AND CONTINUOUS SYSTEMS). A/D converters are available in integrated circuit form. See also D/A CONVERTER.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]