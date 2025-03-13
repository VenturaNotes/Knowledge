---
aliases:
  - JPEG
---
## Synthesis
- 
## Source [^1]
- (1) (Joint Photographic Expert Group) The committee-a joint CCITT and ISO/IEC group-that works on the storage and transmission of still images and developed the ISO 10918 standard (see def. 2).
- (2) The ISO 10918 standard, Digital Compression and Coding of Continuous Still Images, developed by JPEG for image compression of single digital images. The goal was to develop a general-purpose compression standard to meet the needs of almost all continuous-tone still-image applications, reducing either the bandwidth needed to transmit the image or the amount of memory needed to store it.
- In its simplest mode of operation, JPEG can be thought of as compressing an image broken into 8 by 8 blocks of pixels. Each 8 by 8 block is processed by a pipeline of processes: discrete cosine transform to produce a representation of the sample as a collection of DCT coefficients, which are then quantized and entropy encoded (Huffman or arithmetic coding options exist). Decoding is the reverse of this process.
- In addition, JPEG defines a lossless compression mode based on a simple predictive method. There is also a hierarchical encoding mode of operation that provides a pyramidal encoding at multiple resolutions, each differing by a factor of two in the horizontal direction, vertical direction, or both, from its adjacent encoding.
- JPEG also makes provision for representing multiple-component images (color, spectral bands or channels), where each component consists of a rectangular array of samples.
- See also MPEG.
- http://www.w3.org/Graphics/JPEG/itu-t81.pdf
	- The JPEG standard (CCITT recommendation T.81)
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]