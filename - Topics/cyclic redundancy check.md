---
aliases:
  - cyclic redundancy code
  - CRC
---
## Synthesis
- 
## Source [^1]
- The most widely used error-detecting code. Extra digits are appended to each block in order to provide a means of checking the data for errors that may have occurred, say, during transmission or due to recording and readback processes: the digits are calculated from the contents of the block on input, and recalculated by the receiver or during readback
- A CRC is a type of polynomial code. In principle, each block, regarded as a polynomial A, is multiplied in the encoder by a generating polynomial G to form AG. This is affected during transmission or recording by the addition of an error polynomial E, to form $$AG + E$$In the decoder this is divided by the same generating polynomial G to give a residue, which is examined to see if it is zero. If it is nonzero, an error is recorded and appropriate action is taken (see BACKWARD ERROR CORRECTION). In practice, the code is made systematic by encoding A as $$Ax^r + R$$where $r$ is the degree of $G$ and $R$ is the residue on dividing $Ax^r$ by $G$. In either case, the only errors that escape detection are those for which E has G as a factor: the system designer chooses $G$ to make this as unlikely as possible. Usually, in the binary case, $G$ is the product of $(x + 1)$ and a primitive factor of suitable degree.
- A binary code for which $$G = x + 1$$is known as a simple parity check (or simple parity code). When applied across each character of, say, a magnetic tape record, this is called a horizontal check; when applied along each track of the record, it is called a vertical check. Simple checks (horizontal and/or vertical) are much less secure against burst errors than a nontrivial CRC with G of degree (typically) 16. The term longitudinal redundancy check (LRC) usually refers to a nontrivial CRC, but may apply to a simple vertical check.
## References

[^1]: [[Home Page - A Dictionary of Computer Science by Oxford Reference]]