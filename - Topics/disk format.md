## Synthesis
- 
## Source [^1]
- The format of information recorded on magnetic (or optical) disk, allowing a system to recognize, control, and verify the data. There are two levels at which formats are defined.

(a) The way in which the data stream is divided into separately addressable portions, called sectors, with address marks and data marks to differentiate between the different types of information within the sector, and with a cyclic redundancy check or error-correcting code also provided.

(b) The way in which the binary information is encoded as a pattern of magnetic flux reversals.

  

Since recordings on disks are made as a serial bit stream on a single track at a time, special provision has to be made to allow the read electronics to acquire and maintain bit and byte synchronization. Bit synchronization is achieved when the read electronics can provide a data clock (known as the [[read clock]]) of the correct phase so that the data can be encoded. All modern fixed disk drives make use of a phase-locked loop (PLL) to generate the read clock from the data stream; currently the most common encoding scheme is RLL (see diagram). Very early floppy disk drives did not need a PLL because the encoding scheme used was FM (see below), which is self-clocking. Byte synchronization is achieved with the aid of address marks or data marks, as appropriate.

  

The common methods of encoding are as follows.

[[Run-length limited encoding]] (RLL) is a form of NRZ (nonreturn to zero) recording in which groups of bits are mapped into larger groups before recording. A frequently used method known as 2-7 (at least 2 zeros between ones and no more than 7 zeros between ones) uses the ' n to 2 n ' mapping table shown in the diagram. The restriction of 2 zeros between ones allows increased packing density and reduced intersymbol interference of the magnetic pattern, and that of no more than 7 zeros between ones eases the design of the phase-locked loop. Other similar codes are GCR (group code recording), which breaks the data stream into 4-bit groups and maps these into 5-bit groups, EIR (error-indicating recording), a form of 4 to 6 mapping that uses only the groups with odd parity, i.e. 3 or 5 ones, and 3PM (three-phase modulation), which has a minimum sequence of 2 zeros and a maximum of 11 zeros.

  

Frequency modulation (FM; F2F) is a form of self-clocking recording. The beginning of each bit cell is marked by a clock pulse recorded as a change in the direction of the magnetic flux. If the cell is to represent a binary 1 a second pulse or transition is written at the centre of the cell, otherwise there is no further change until the start of the next cell. If the frequency of the clock is $F$ then a stream of 1 s will result in a frequency of $2 F$ (hence F2F recording). In this form of recording the minimum separation between transitions is half of one cell and the maximum is one cell.

  

In modified frequency modulation (MFM) a binary 1 is always represented by a transition at the centre of a bit cell but there is not always a transition at the boundary of the cell. A transition is written at the start of a bit cell only if it is to represent a binary 0 and does not follow a binary 1 . Thus the minimum separation between transitions is one cell and the maximum is two cells. For the same spacing of flux transitions the MFM method allows twice as many bits to be encoded in a unit distance; it is thus sometimes referred to as a double-density recording.

  

| possible data sequences | | | | | code sequence |

| :--: | :--: | :--: | :--: | :--: | :--: |

| 10 | | | | | 0100 |

| 11 | | | | | 1000 |

| 01 | $\rightarrow$ | 001 | | | 100100 |

| | | 011 | | | 001000 |

| 00 | $\rightarrow$ | 000 | | | 000100 |

| | | 001 | $\rightarrow$ | 0010 | 00100100 |

| | | | | 0011 | 00001000 |

  

Disk format. RLL mapping table of the $2-7$ method

Modified modified frequency modulation ( $\mathrm{M}^{2} \mathrm{FM}$ ) is a modified form of MFM that deletes flux transitions between two 0 s if they are followed by a 1.

  

Optical disk formats are broadly similar to those of magnetic disk, except that the tracks usually take the form of a continuous spiral and the path of this is often determined by a groove pressed into the disk surface during manufacture (see also CD-ROM FORmAT STANDARDS).

  

See also FORMATTER.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]