## Synthesis
- 
## Source [^1]
- (pronounced `bitblit`) (bit-block transfer) An operation that, in its simplest form, can rapidly change the contents of a bitmap and thus the displayed image. Such operations are frequently required by window management systems. It can also be used for graphical operations such as area filling and image rotation.
- The operation has three operands$\textemdash$source, destination, and pattern$\textemdash$that are each rectangular arrays of bits. The pattern operand is usually smaller and is used periodically to create an operand of the same size as the other two. First the pattern and destination operands are combined by a bitblt operator. The result is combined with the source operand by a second bitblt operator and replaces the destination. The two bitblt operators may be any one of the 16 possible logic operations between two Boolean variables. The bitblt function is usually implemented in hardware with fast parallel circuitry.
- The pixelblt function extends the bitblt to shaded and color displays.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]