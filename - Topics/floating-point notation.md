## Synthesis
- 
## Source [^1]
- A representation of real numbers that enables both very small and very large numbers to be conveniently expressed. A floating-point number has the general form

  

$$

\pm m \times R^{e}

$$

  

where $m$ is called the mantissa, $R$ is the radix (or base) of the number system, and $e$ is the exponent.

  

In the context of computing, a more common name for the mantissa is the [[significand]].

  

IEEE Standard 754 defines the most commonly used representations for real numbers on computers. It defines 32-bit (single precision) and 64-bit (double precision) as follows.

  

The first bit is a sign bit, denoting the sign of the significand. This is followed by a fixed number of bits representing the exponent, which is in turn followed by another fixed number of bits representing the magnitude of the significand.

  

The exponent is often represented using excess-n notation. This means that a number, called the characteristic (or [[biased exponent]]), is stored instead of the exponent itself. To derive the characteristic for a floating-point number from its exponent, the bias (or excess factor) $n$ is added to the exponent. For example, for an 8-bit characteristic, exponents in the range -128 to +127 are represented in excess-128 notation by characteristics in the range 0 to 255 .

  

IEEE 754 specifies an 8-bit single-precision exponent, with a bias of 127, and an 11-bit double-precision exponent, with a bias of 1023. A nonzero floating-point number is normalized if the leading digit in its significand is nonzero. Since the only possible nonzero digit in base 2 is 1 , the leading nonzero digit in the significand need not be explicitly represented. This means that the 23-bit significand in the IEEE 754 singleprecision floating-point representation effectively provides 24 bits of resolution, and the 52-bit double-precision significand provides 53 bits of resolution.

  

Although normalized floating-point numbers are most frequently used, unnormalized representations are also needed to represent numbers close to zero.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]