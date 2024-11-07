---
Source:
  - zotero://open-pdf/library/items/R2WDRE52?page=3&annotation=WJYHXNZN
Length: "421"
Progress: "0"
tags:
  - status/incomplete
  - type/textbook
---
## (0) Introduction
- “If you want to learn the theory right now, then this is not your book.” ([Mak, 2009, p. 8](zotero://select/library/items/3RSRIJQI)) ([pdf](zotero://open-pdf/library/items/R2WDRE52?page=8&annotation=F9W4LDFX))
- “The first edition of this book used C as the implementation language, the second edition used C++, and this third edition uses Java.” ([Mak, 2009, p. 8](zotero://select/library/items/3RSRIJQI)) ([pdf](zotero://open-pdf/library/items/R2WDRE52?page=8&annotation=FGGY9SXG))
### (0.1) What You'll Learn in this Book
- “write an interpreter that can execute programs” ([Mak, 2009, p. 8](zotero://select/library/items/3RSRIJQI)) ([pdf](zotero://open-pdf/library/items/R2WDRE52?page=8&annotation=N49L673F))
- After adding debugger
	- You can set breakpoints
	- display the call stack
	- View/modify variables
	- Single stepping
		- "allows a reverse engineer to execute a single instruction at a time before returning control to the debugger" [^1]
- Add an IDE
- “You'll learn to write a compiler that generates object code for the Java Virtual Machine (JVM).” ([Mak, 2009, p. 8](zotero://select/library/items/3RSRIJQI)) ([pdf](zotero://open-pdf/library/items/R2WDRE52?page=8&annotation=WQVSS4XX))
	- “You’ll be able to run compiled programs on multiple platforms” ([Mak, 2009, p. 8](zotero://select/library/items/3RSRIJQI)) ([pdf](zotero://open-pdf/library/items/R2WDRE52?page=8&annotation=G7RYRK74))
- Programming language will be Pascal
	- “high-level procedure-oriented programming language” ([Mak, 2009, p. 8](zotero://select/library/items/3RSRIJQI)) ([pdf](zotero://open-pdf/library/items/R2WDRE52?page=8&annotation=JCWAA3UI))
### (0.2) A Software Engineering Approach
- “Design patterns, Unified Modeling Language (UML) diagrams, and other modern object-oriented design practices” ([Mak, 2009, p. 8](zotero://select/library/items/3RSRIJQI)) ([pdf](zotero://open-pdf/library/items/R2WDRE52?page=8&annotation=HE7B9MKH))
- “The approach that I strongly believe in is: Develop software incrementally.” ([Mak, 2009, p. 8](zotero://select/library/items/3RSRIJQI)) ([pdf](zotero://open-pdf/library/items/R2WDRE52?page=8&annotation=RGTKEHYK))
### (0.3) How the Book is Organized
- Interpreter
	- Chapter 1 - Introduction
	- Chapter 2 - Framework of compiler and interpreter
	- Chapter 3 - Scanning (Translation tasks)
	- Chapter 4 - Symbol Table
	- Chapter 5 - Parsing expressions and assignment statements
	- Chapter 6 - Interprets Expressions and assignment statements
	- Chapter 7 - Parses Control Statements
	- Chapter 8 - Interprets Control Statements
	- Chapter 9 - Parses Declarations
	- Chapter 10 - Type Checking
		- Verifying the types of expressions used in a program or source code [^2]
	- Chapter 11 - Parses Procedures, Functions, and entire Pascal Programs
	- Chapter 12 - Completes Interpreter and executes entire Pascal programs
- Debugger
	- Chapter 13 - Source-level debugger
	- Chapter 14 - Wraps GUI around command-line debugger to create IDE
- Compiler
	- Chapter 15 - Architecture of JVM and Jasmin
		- Java Virtual Machine
		- Jasmin is the assembly language that the compiler will emit for the JVM
	- Chapter 16 - Compiles programs, assignment statements, and expressions 
	- Chapter 17 - Compiles procedures, function calls, and string operations
	- Chapter 18 - Compiles control statements, arrays, and records
- Chapter 19 - compiler writing topics such as code optimization, table-driven scanners and parsers

### (0.4) Where to Get the Program Code
- "http://www.apropos-logic.com/wci/" ([Mak, 2009, p. 9](zotero://select/library/items/3RSRIJQI)) ([pdf](zotero://open-pdf/library/items/R2WDRE52?page=9&annotation=3Q89ETLI))

## References

[^1]: https://resources.infosecinstitute.com/topics/management-compliance-auditing/u-s-cyber-policy-course-and-legal-aspects/#:~:text=Single%2Dstepping%20is%20one%20of,returning%20control%20to%20the%20debugger.
[^2]: https://datatrained.com/post/type-checking-in-compiler-design/#:~:text=Type%20checking%20in%20compiler%20design%20is%20an%20essential%20aspect%20of,with%20its%20context%20of%20use.