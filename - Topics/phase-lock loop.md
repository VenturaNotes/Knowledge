## Synthesis
- 
## Source [^1]
- (PLL) A circuit comprising a phase detector, low-pass filter, amplifier, and voltage-controlled oscillator (VCO). The phase detector compares the frequencies of an input signal and the output of the VCO. If the two frequencies are different, the phase detector produces a phase error signal at the difference frequency, which, after low-pass filtering and amplification, is used to drive the VCO in the direction of the input frequency. When the PLL is 'locked', the VCO frequency is the same as the input frequency, maintaining a constant phase difference. Under these conditions, the phase detector output is then a DC voltage driving the VCO at a constant frequency. This DC voltage is therefore a measure of the input frequency. Further, any frequency modulation present on the input signal will be present on the control voltage, so the PLL is acting as a demodulator for FM signals.
- The VCO output is a locally generated frequency equal to the input signal frequency, and therefore can provide a lower noise replica of the input signal. By placing a divider between the VCO output and the phase detector, a multiple of the input frequency can be generated in the VCO. This is the basic technique of frequency synthesizers.
## References

[^1]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]