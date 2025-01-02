---
Source:
  - zotero://open-pdf/library/items/R2WDRE52?page=3&annotation=WJYHXNZN
Length: "421"
Progress: "0"
tags:
  - status/incomplete
  - type/textbook
Reviewed: false
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

## (1) Introduction
### (1.1) Gols and Approach
### (1.2) What Are Compilers and Interpreters?
### (1.3) Comparing Compilers and Interpreters
### (1.4) Why Study Compiler Writing?
### (1.5) Conceptual Design
### (1.6) Syntax and Semantics
### (1.7) Lexical, Syntax, and Semantic Analyses
## (2) Framework I: Compiler and Interpreter
### (2.1) Goals and Approach
### (2.2) Language-Independent Framework Components
### (2.3) Parser
### (2.4) Pascal-Specific Front End Components
### (2.5) Initial Back End Implementations
### (2.6) Program 2: Program Listings
## (3) Scanning
### (3.1) Goals and Approach
### (3.2) Program 3: Pascal Tokenizer
### (3.3) Syntax Error Handling
### (3.4) How to Scan for Tokens
### (3.5) A Pascal Scanner
### (3.6) Pascal Tokens
## (4) The Symbol Table
### (4.1) Goals and Approach
### (4.2) Symbol Table Conceptual Design
### (4.3) Symbol Table Interfaces
### (4.4) A Symbol Table Factory
### (4.5) Symbol Table Implementation
### (4.6) Program 4: Pascal Cross-Referencer I
## (5) Parsing Expressions and Assignment Statements
### (5.1) Goals and Approach
### (5.2) Syntax Diagrams
### (5.3) Intermediate Code Conceptual Design
### (5.4) Intermediate Code Interfaces
### (5.5) An Intermediate Code Factory
### (5.6) Intermediate Code Implementation
### (5.7) Parsing Pascal Statements and Expressions
### (5.8) Program 5: Pascal Syntax Checker I
## (6) Interpreting Expressions and Assignment Statements
### (6.1) Goals and Approach
### (6.2) Runtime Error Handling
### (6.3) Executing Assignment Statements and Expressions
### (6.4) Program 6: Simple Interpreter I
## (7) Parsing Control Statements
### (7.1) Goals and Approach
### (7.2) Syntax Diagrams
### (7.3) Error Recovery
### (7.4) Program 7: Syntax Checker II
### (7.5) Control Statement Parsers
### (7.6) Parsing Pascal Control Statements
## (8) Interpreting Control Statements
### (8.1) Goals and Approach
### (8.2) Program 8: Simple Interpreter II
### (8.3) Interpreting Control Statements
## (9) Parsing Declarations
### (9.1) Goals and Approach
### (9.2)  Pascal Declarations
### (9.3) Types and the Symbol Table
### (9.4)  Scope and the Symbol Table Stack
### (9.5) Parsing Pascal Declarations
### (9.6) Program 9: Pascal Cross-Referencer II
## (10) Type Checking
### (10.1) Goals and Approach
### (10.2) Type Checking
### (10.3) Program 10: Pascal Syntax Checker III
## (11) Parsing Programs, Procedures, and Functions
### (11.1) Goals and Approach
### (11.2) Program, Procedure, and Function Declarations
### (11.3) Parsing a Program Declaration
### (11.4) Parsing Procedure and Function Declarations
### (11.5) Program 11: Pascal Syntax Checker IV
## (12) Interpreting Pascal Programs
### (12.1) Goals and Approach
### (12.2) Runtime Memory Management
### (12.3) Executing Statements and Expressions
### (12.4) Executing Procedure and Function Calls
### (12.5) Program 12-1: Pascal Interpreter
## (13) An Interactive Source-Level Debugger
### (13.1) Goals and Approach
### (13.2) Machine-Level vs. Source-Level Debugging
### (13.3) Debugger Architecture
### (13.4) A Simple Command Language
### (13.5) Program 13-1: Command-Line Source-Level Debugger
## (14) Framework II: An Integrated Development Environment (IDE)
### (14.1) Goals and Approach
### (14.2) The Pascal IDE
### (14.3) Program 14: Pascal IDE
### (14.4) The IDE Process and the Debugger Process
## (15) Jasmin Assembly Language and Code Generation for the Java Virtual Machine
### (15.1) Goals and Approach
### (15.2) Organization of the Java Virtual Machine
### (15.3) The Jasmin Assembly Language

## (16) Compiling Programs, Assignment Statements, and Expressions
### (16.1) Goals and Approach
### (16.2) Compiling Programs
### (16.3) Code Generator Subclasses
### (16.4) Compiling Procedures and Functions
### (16.5) Compiling Assignment Statements and Expressions
### (16.6) The Pascal Runtime Library
### (16.7) Program 16-1: Pascal Compiler I
## (17) Compiling Procedure and Function Calls and String Operations
### (17.1) Goals and Approach
### (17.2) Compiling Procedure and Function Calls
### (17.3) The Pascal Runtime Library
### (17.4) Compiling Strings and String Assignments
### (17.5) Program 17-1: Pascal Compiler II
## (18) Compiling Control Statements, Arrays, and records
### (18.1) Goals and Approach
### (18.2) Compiling Control Statements
### (18.3) Compiling Arrays and Subscripted Variables
### (18.4) Compiling Records and Record Fields
### (18.5) Program 18-1: Pascal Compiler III
## (19) Additional Topics
### (19.1) Scanning
### (19.2) Syntax Notation
### (19.3) Parsing
### (19.4) Code Generation
### (19.5) Runtime Memory Management
### (19.6) Compiling Object-Oriented Languages
### (19.7) Compiler-Compilers


## References

[^1]: https://resources.infosecinstitute.com/topics/management-compliance-auditing/u-s-cyber-policy-course-and-legal-aspects/#:~:text=Single%2Dstepping%20is%20one%20of,returning%20control%20to%20the%20debugger.
[^2]: https://datatrained.com/post/type-checking-in-compiler-design/#:~:text=Type%20checking%20in%20compiler%20design%20is%20an%20essential%20aspect%20of,with%20its%20context%20of%20use.