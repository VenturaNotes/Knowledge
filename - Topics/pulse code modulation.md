---
aliases:
  - PCM
---
## Synthesis
- 
## Source [^1]
- A technique used by codecs to convert an analogue signal into a digital bit stream. The amplitude (usually) of the analogue signal is sampled ( 8000 samples per second for voice-quality telephone lines with 4000 Hz bandwidth), and a digital code is selected to represent the sampled value. The digital code is transmitted to the receiving end, which uses it to generate an analogue output signal. Encoding techniques may be used to reduce the amount of data that is transmitted between the sender and the receiver, based on known characteristics of the analogue signal. For example, mu-law ($\boldsymbol{\mu}$-law) encoding converts the analogue signal to a digital code based on the logarithm of its value, rather than on a linear transformation.
- Differential PCM (DPCM) transmits the difference between the current sample and the previous sample. DPCM assumes that the difference requires fewer bits than the signal amplitude.
- Delta ( $\Delta$ ) PCM is a version of DPCM in which a single bit is used for each sample, representing a signal change of plus or minus one unit. A constant signal is represented as a series of plus or minus transitions.
- [[Predictive PCM]] extrapolates from the previous few samples what the next sample should be, and transmits the difference between the actual value and the predicted value.
- See also MODULATION.
## Source[^2]
- Pulse code modulation (PCM) involves converting an analog signal into binary code to transmit information from one communication device to another. It is the communication standard for many technologies used to make calls over the internet, such as Voice over IP (VoIP). Changing)a signal into binary code can make communicating via these technologies much more effective. PCM can improve the quality of calls made over the internet, for example.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[Home Page - Glossary by Capterra]]