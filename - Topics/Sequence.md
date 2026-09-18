---
aliases:
  - Sequences
---
## Synthesis
- 
## Source [^1]
```
01 INPUT numberofwords
02 INPUT numberofchapters
03 CONST wordsperpage = 300
04 numberofpages = RoundDown(numberofwords / wordsperpage)
05 numberofpages = numberofwords + numberofchapters
06 OUTPUT number of pages
```
- This program uses sequence

## Source[^2]
- (1) A function whose domain is the set of positive integers (or sometimes the set of nonnegative integers). The image set can thus be listed $s_{1}, s_{2}, \ldots$ where $s_{i}$ is the value of the function given argument $i$. A finite sequence (or list) is a function whose domain is$$\{1,2, \ldots, n\} \text { for } n \geq 1$$and hence whose image set can be listed$$s_{1}, s_{2}, \ldots, s_{n}$$
- (2) The listing of the image set of a sequence. Hence it is another name for string.
## Source[^3]
- A finite sequence consists of $n$ terms $a_1, a_2, \dots, a_n$, in a given order, where $n$ is the length of the sequence. An infinite sequence consists of terms $a_1, a_2, a_3, \dots$, one corresponding to each positive integer. Sometimes, it is more convenient to denote the terms of a sequence by $a_0, a_1, a_2, \dots$. Addition and scalar multiplication of sequences are defined componentwise, and so the set of sequences forms a vector space (see $c, l^p$). See also LIMIT (of a sequence), SERIES.
## References

[^1]: https://computerscienced.co.uk/site/ocr-computer-science-gcse-j277/2-2-programming-fundamentals-quizzes/2-2-programming-fundamentals-quiz-10-questions/
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]