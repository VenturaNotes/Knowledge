---
aliases:
  - variables
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
- Line 4 consists of a variable
	- A variable is a location in memory to store a value that may change (as the program is running)

## Source[^2]
- A storage location paired with an associated symbolic name, which contains some known or unknown quantity of information referred to as a value. Variables are fundamental in programming for storing and manipulating data.
## References

[^1]: https://computerscienced.co.uk/site/ocr-computer-science-gcse-j277/2-2-programming-fundamentals-quizzes/2-2-programming-fundamentals-quiz-10-questions/
[^2]: https://spdload.com/blog/software-development-glossary/