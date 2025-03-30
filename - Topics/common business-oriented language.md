---
aliases:
  - Cobol
  - COBOL
---
## Synthesis
- 
## Source [^1]
- A programming language that was developed by CODASYL and is a de facto standard for commercial data processing. Cobol first came into use in 1960; the current version Cobol 2002 is an ANSI standard adopted by ISO and replaces the earlier standards Cobol 68, Cobol 74, and Cobol 85.
- A Cobol program is divided into four divisions, of which the most important are the DATA division and the PROCEDURE division. In the DATA division the programmer defines the working storage and the files to be used by specifying their record structure. The PROCEDURE division is made up of statements, grouped into sentences, paragraphs, and sections. These statements define manipulation of data from the current record(s) of one or more files. The notation is English-like, e.g. $$\begin{align}&\text{IF X = Y MOVE A TO B;}\\&\text{IF GREATER ADD A TO Z;}\\&\text{OTHERWISE MOVE C TO D.}\end{align}$$File input-output is defined in terms of complete records, so the typical program reads a record from its input file, processes it, and writes a record to its output file, repeating this sequence until the whole file is processed. A powerful feature allows the data definition to specify editing that will take place as a side-effect of output, such as suppressing nonsignificant zeros.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]