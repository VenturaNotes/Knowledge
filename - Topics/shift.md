## Synthesis
- 
## Source [^1]
- 1. To change the interpretation of characters. The term is commonly used to mean a change from lower to upper case. 2. Any complete set of characters obtainable without shifting. Hence change shift is a synonym for shift (def. 1). 3. The movement of a bit pattern in a bit string. A left shift of $m(<n)$ bits will move the bit pattern in a string

  

$$

b_{1} b_{2} \ldots b_{n}

$$

  

leftward, giving

  

$$

b_{m+1} \ldots b_{n} ? \ldots ?

$$

  

Similarly, a [[right shift]] of $m$ bits converts

  

$$

\begin{aligned}

& b_{1} b_{2} \ldots b_{n} \\

& \text { ?...? } b_{1} b_{2} \ldots b_{m-m}

\end{aligned}

$$

  

The bits that are introduced (shown here as question marks) and the use of the bits that are shifted off the end of the string depend on the kind of shift: arithmetic, logical, or circular. In an [[arithmetic shift]] the bit strings are regarded as representations of binary integers; if the leading $m$ bits that are lost are all zero, a left shift of $m$ bits is equivalent to multiplication by $2^{m}$ and a right shift can be interpreted as integer division by $2^{m}$. In logical shifts the bits introduced are all zero. In circular shifts the bits shifted off at one end are introduced at the other.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]