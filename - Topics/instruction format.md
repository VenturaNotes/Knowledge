---
aliases:
  - instruction formats
---
## Synthesis
- 
## Source [^1]
- An instruction is normally made up of a combination of an operation code and some way of specifying an operand, most commonly by its location or address in memory though nonmemory reference instructions can exist. Some operation codes deal with more than one operand; the locations of these operands may be specified using any of the many addressing schemes.

  

Classically, the number of address references has been used to specify something about the architecture of a particular computer. In some instruction formats and machine architectures, the number of operand references may be fixed; in others the number is variable. In the former case descriptions of formats include one-address, twoaddress, three-address, and (now rarely) four-address. An example (symbolically) of a one-address instruction is

add x i.e.

add contents of address $x$

to contents of accumulator;

sum remains in accumulator.

An example of a three-address instruction is

add x,y,zi.e.

add contents of address $x$

to contents of address $y$;

sum is placed in location z .

In some cases the last address is the address of the next instruction to be executed. The ability to specify this address was important when rotating (drum) main memories were prominent. Thus a two-address instruction such as

add x,y i.e.

add contents of address $x$

to contents of address $y$;

sum is placed at address $y$,

may become

add x,y,z i.e.

add contents of address $x$

to contents of address $y$;

sum is placed at address $y$;

next instruction is taken

from address z .

The last may be called either a three-address instruction or a two-plus-one-address

  

instruction. In a similar way the term one-plus-one address instruction represents a one-address instruction together with the address where the next instruction is to be found. In these two cases the instructions do not come from sequential addresses; an instruction counter, if present, is bypassed.

  

The figure shows three examples of possible/typical instruction formats.

In early computers instruction formats were forced into a fixed word size, that of the computer. An instruction format consisted of two fields: one containing the operation code and the other containing the address(es). As additional features of address modification became available, it was necessary to add special bit positions in the instruction word to specify functions such as indirect addressing, use of index registers, use of base registers in relative addressing, etc. Still other bits were sometimes used to allow for reference to parts of a data word; this was usually as fractions of the word, as character positions, more recently as byte positions.

  

As registers became common, distinct operation codes were used to refer to register locations; these locations could be specified in many fewer bits than normal addresses, and variable-length instruction formats were developed. See also STACK PROCESSING, ZERO-ADDRESS INSTRUCTION.

![[A Dictionary of Computer Science [part 6]_img_6.jpeg]]

  

Complex one-address instruction
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]