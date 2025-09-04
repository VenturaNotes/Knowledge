## Synthesis
- 
## Source [^1]
- Communication systems in which messages are encoded by means of an inner code before being passed through a channel and then being decoded according to the inner code; this entire inner encoder-channel-decoder system is itself regarded as a channel (it is hoped less noisy than the original channel), and therefore has a further encoder and decoder placed before and after it; these implement an outer code. Alternatively, such a system may be considered as a channel with a compound encoder before it and a compound decoder after it, the compound encoder and decoder implementing a factorable code.
- To a good approximation, the inner code should be designed to correct any channel errors arising in the original channel, while the [[outer code]] should be designed to cope with decoder errors occurring in the inner decoder. Since these decoder errors tend to occur in bursts, the outer code is usually a burst-error-correcting code: the Reed-Solomon codes are often used for this purpose. The inner code is often a convolutional code.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]