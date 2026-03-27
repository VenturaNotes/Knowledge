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
## Source[^2]
- (Joint Photographic Experts Group) A standardized image compression mechanism, named after the committee that originally wrote the standard. It was designed for compression of natural real-world scenes captured as full-color or grey-scale images. JPEG uses lossy compression to achieve significantly reduced storage requirements compared with lossless compression. It is designed to exploit known limitations of the human eye, namely less accurate perception of small colour variations compared to small brightness variations. An attractive feature is that the degree of 'lossiness', and hence the file size, can be changed by adjusting the compression parameters. The term JPEG strictly applies to the transformation of an image into a stream of bytes; the JPEG file interchange format (JFIF) specifies how to produce a file from the stream and is generally used for most JPEGs.
- https://jpeg.org/
	- Website of the Joint Photographic Experts Group (JPEG)
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Electronics and Electrical Engineering 5th Edition by Oxford Reference]]