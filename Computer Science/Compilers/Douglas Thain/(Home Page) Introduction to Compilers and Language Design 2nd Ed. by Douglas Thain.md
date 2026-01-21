---
Source:
  - zotero://open-pdf/library/items/9WTIQHYF?page=1&annotation=TEYRRUUP
Length: "247"
Progress: "15"
tags:
  - status/incomplete
  - type/textbook
Reviewed: false
---
## Note
- Revision Date: January 15, 2021
## (1) Introduction
### (1.1) What is a Compiler
- “A [[compiler]] translates a program in a [[source language]] to a program in a [[target language]]” ([Thain, p. 1](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=15&annotation=C9Q8T7UK))
- Most well known form of a compiler is one that translate a [[high level language]] like C to native [[assembly language]] of a machine to be executed.
- “there are compilers for other languages like [[C++]], [[Java]], [[C Sharp]], and [[Rust]], and many others.” ([Thain, p. 1](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=15&annotation=GDL9S6BT))
- Uses same techniques as traditional compilers
	- “a [[typesetting program]] like [[TEX]] translates a [[manuscript]] into a [[Postscript document]].” ([Thain, p. 1](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=15&annotation=7ME4D7PH))
	- “A [[graph-layout program]] like [[Dot]] consumes a list of nodes and edges and arranges them on a screen.” ([Thain, p. 1](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=15&annotation=V23LSFI2))
	- “[[web browser]] translates an [[HTML]] document into an interactive graphical display.” ([Thain, p. 1](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=15&annotation=A8NBD32P))
- “[[Compilers]] exist not only to translate programs, but also to improve them.” ([Thain, p. 1](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=15&annotation=S55DGJXX))
	- Finds errors at [[compile time]] (user won't need to encounter them during [[runtime]])
- A [[strict language]] results in more [[compile time|compile-time]] errors (but more likely that program is correct)
	- [[Ada]] language is infamous for compile-time errors but trusted enough to run safety-critical systems such as [[Boeing 777 aircraft]]
- An [[interpreter]] reads in a program and then executes it directly without emitting a translation
	- Sometimes known as [[virtual machine]]
		- [[Python]] and [[Ruby]] typically executed by interpreter ([[source code]] read directly)
- Possible to exchange compilers and interpreters
	- [[Java compilers]] translate [[Java source code]] into [[Java bytecode]] (abstract form of [[assembly language]]). 
	- “Some implementations of the [[Java Virtual Machine]] work as interpreters that execute one instruction at a time” ([Thain, p. 1](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=15&annotation=WTLKGJAK))
		- Others work by translating [[bytecode]] into [[local machine code]] and running the machine code directly ([[just in time compiling]])
### (1.2) Why should you study compilers
- [[Compiler]] translates program to [[machine language]]
- Can create tools for debugging and translating
	- By writing a [[parser]] for a language, you can write all manner of supporting tools to debug programs. An [[integrated development environments|integrated development environment]] like [[Eclipse]] incorporates parsers for languages like Java (highlight syntax, find errors without compiling, connect code to documentation as you write)
- Can create new language
	- Many problems easier when expressed in a custom language ([[domain specific language]] or little language)
		- be able to implement little languages and avoid pitfalls of language design
- Contribute to existing compilers
	- Standards development results in
		- new language features
		- optimization research improves programs
		- new [[microprocessors]] are created
		- new [[operating systems]] are developed
	- The above development require continuous improvement of existing compilers
### (1.3) What's the best way to learn about compilers
- Write your own compiler from beginning to end
- Only need four or five independent stages
### (1.4) What language should I use
- “use the [[C]] programming language and the [[X86 assembly language]]” ([Thain, p. 2](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=16&annotation=R8FW5Q4P))
- “[[Java]] is simple, consistent, and portable, albeit not high performance.” ([Thain, p. 2](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=16&annotation=ALVT4PA8))
- “[[Python]] is easy to learn and has great library support, but is [[weakly typed]].” ([Thain, p. 2](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=16&annotation=QN7EZ48D))
- “[[Rust]] offers exceptional [[static type-safety]], but is not (yet) widely used.” ([Thain, p. 2](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=16&annotation=B35TEUDX))
- Possible to write a compiler in nearly any language
- Best to learn C, write compiler in C and compile a C-like language producing assembly for a widely-used processor like [[X86]] or [[Advanced RISC Machine|ARM]]
	- Important since it's widely in use
- “[[C]] is the most widely-used [[portable language]] for [[low-level coding]] ([[compilers]], and [[libraries]], and [[kernels]])” ([Thain, p. 3](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=17&annotation=ZRZMD3JS))
	- “challenges related to [[type safety]] and [[pointer]] use” ([Thain, p. 3](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=17&annotation=RZ6P2US8))
		- Manageable for a project the size of a compiler
- “[[X86]] has been the most widely-deployed computer architecture in desktops, servers, and laptops for several decades.” ([Thain, p. 3](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=17&annotation=CSIWT6ML))
	- “considerably more complex than other architectures like [[MIPS]] or [[SPARC]] or [[Advanced RISC Machine|ARM]]” ([Thain, p. 3](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=17&annotation=LMTME9Y5))
	- “[[Advanced RISC Machine|ARM]] is quickly catching up as a popular architecture in the mobile, embedded, and low power space,” ([Thain, p. 3](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=17&annotation=YQ2G6MJ6))
- “If you are using this as part of a class, your instructor may very well choose a different [[compilation language]] and different [[target assembly]], and that's fine too.” ([Thain, p. 3](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=17&annotation=ALZBJA7A))
### (1.5) How is this book different from others
- “Most books on compilers are very heavy on the abstract theory of [[scanners]], [[parsers]], [[type systems]], and [[register allocation]], and rather light on how the design of a language affects the compiler and the runtime.” ([Thain, p. 3](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=17&annotation=NURH7DKM))
- This one focuses on process of engineering a compiler, tradeoffs in language design, and considerations for [[interpretation]] and [[translation]]
### (1.6) What other books should I read
- #archive 
	- "Crafting a Compiler"
	- "A Retargetable C Compiler: Design and Implementation"
	- "Compilers: Principles, Techniques, and Tools"
## (2) A Quick Tour
### (2.1) The Compiler Toolchain
- “A [[compiler]] is one component in a [[toolchain]] of programs used to create [[executables]] from [[source code]].” ([Thain, p. 5](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=19&annotation=VMF4537V))
	- When compiling a program, a whole sequence of programs are invoked in background.
- Programs typically used in a [[Unix System]] for compiling C source code to assembly code
	- ![[Screenshot 2023-09-11 at 9.24.35 AM.png]]
		- A Typical [[Compiler Toolchain]]
			- [[Source]] $\to$ [[preprocessed]] $\to$ [[compiler]] $\to$ [[Assembly]] $\to$ [[Assembler]] $\to$ [[Object Code]] $\to$ [[Static Linker]] $\to$ [[Executable]] $\to$ [[Dynamic Linker]] $\to$ [[Running Process]]
		- (1) “[[preprocessor]] prepares the [[source code]] for the [[compiler proper]].” ([Thain, p. 5](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=19&annotation=NX8AQFY5)) ^4wix79
			- In C/C++, consuming all [[directives]], starting with # symbol. 
				- \#include directive causes preprocessor to open named file and insert its contents into the source code
				- \#define directive causes the preprocessor to substitute a value wherever a [[macroinstruction|macro]] name is encountered
					- Not all languages rely on a preprocessor
		- (2) “The [[compiler proper]] consumes the clean output of the preprocessor.” ([Thain, p. 5](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=19&annotation=RVHNJKPM))
			- “It scans and parses the source code, performs [[typechecking]] and other semantic routines, optimizes the code, and then produces assembly language as the output.” ([Thain, p. 5](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=19&annotation=523XX446))
				- This part of toolchain is main focus of book
		- (3) “The [[assembler]] consumes the assembly code and produces [[object code]]” ([Thain, p. 6](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=20&annotation=G7YSSGL4))
			- “[[Object code]] is “almost executable” in that it contains raw machine language instructions in the form needed by the [[Central Processing Unit|CPU]].” ([Thain, p. 6](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=20&annotation=6E6RCTXE))
			- “object code does not know the final memory addresses in which it will be loaded, and so it contains gaps that must be filled in by the [[linker]].” ([Thain, p. 6](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=20&annotation=KX5Q8VCQ))
		- (4) “The [[linker]] consumes one or more object files and library files and combines them into a complete, executable program.” ([Thain, p. 6](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=20&annotation=XHA3JALG))
			- “selects the final memory locations where each piece of code and data will be loaded, and then “links” them together by writing in the missing address information.” ([Thain, p. 6](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=20&annotation=SDEZQUBV))
			- “an object file that calls the printf function does not initially know the address of the function.” ([Thain, p. 6](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=20&annotation=3Q3EYTXU))
				- “An empty (zero) address will be left where the address must be used.” ([Thain, p. 6](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=20&annotation=CJDH393A))
			- “Once the linker selects the memory location of printf, it must go back and write in the address at every place where printf is called.” ([Thain, p. 6](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=20&annotation=VXDFYQXM))
		- In Unix-like operating systems, [[preprocessor]], [[compiler]], [[assembler]], and [[linker]] are named cpp, cc1, as, ld” ([Thain, p. 6](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=20&annotation=CWY9SKK2))
		- “The user-visible program cc simply invokes each element of the toolchain in order to produce the final executable.” ([Thain, p. 6](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=20&annotation=5B9QHZXI))
### (2.2) Stages Within a Compiler
- Book focuses on [[compiler proper]]
- ![[Screenshot 2023-09-11 at 12.26.51 PM.png]]
	- Stages of [[Unix Compiler]]
		- [[Character Stream]] $\to$ [[Scanner]] $\to$ [[Tokens]] $\to$ [[Parser]] $\to$ [[Abstract Syntax Tree]] $\to$ [[Semantic Routines]] $\to$ [[Intermediate Representation]] $\to$ [[Code Generator]] $\to$ [[Assembly Code]]
	- (1) “The [[scanner]] consumes the plain text of a program, and groups together individual characters to form complete [[tokens]].” ([Thain, p. 6](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=20&annotation=33GKT6EC))
		- “much like grouping characters into words in a natural language.” ([Thain, p. 6](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=20&annotation=NJ79FICG))
	- (2) “The [[parser]] consumes tokens and groups them together into complete statements and expressions, much like words are grouped into sentences in a natural language.” ([Thain, p. 7](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=21&annotation=23HMWEGX))
		- “parser is guided by a [[grammar]] which states the formal rules of composition in a given language.” ([Thain, p. 7](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=21&annotation=XDUML4I3))
		- “output of the parser is an [[abstract syntax tree]] (AST) that captures the grammatical structures of the program.” ([Thain, p. 7](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=21&annotation=84YYD5KL))
			- “remembers where in the source file each construct appeared, so it is able to generate targeted error messages, if needed.” ([Thain, p. 7](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=21&annotation=LG5XFXUX))
	- (3) “The [[semantic routines]] traverse the AST and derive additional meaning (semantics) about the program from the rules of the language and the relationship between elements of the program.” ([Thain, p. 7](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=21&annotation=BGS56SR2))
		- Example
			- Can determine x + 10 is a float expression because declaration of x earlier was a float and applying the language rule of addition between int and float values yields a float
		- “After the semantic routines, the AST is often converted into an [[intermediate representation]] (IR) which is a simplified form of assembly code suitable for detailed analysis.” ([Thain, p. 7](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=21&annotation=8X9RCMCA))
			- Many forms of IR
	- (4) “One or more [[optimizers]] can be applied to the intermediate representation, in order to make the program smaller, faster, or more efficient.” ([Thain, p. 7](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=21&annotation=9E5EJADN))
		- “each optimizer reads the program in IR format, and then emits the same IR format, so that each optimizer can be applied independently, in arbitrary order.” ([Thain, p. 7](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=21&annotation=IAEEEY45))
	- (5) “[[code generator]] consumes the optimized IR and transforms it into a concrete assembly language program.” ([Thain, p. 7](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=21&annotation=XNLW7WR6))
		- “must perform [[register allocation]] to effectively manage the limited number of [[hardware registers]], and [[instruction selection]] and [[sequencing]]to order assembly instructions in the most efficient form.” ([Thain, p. 7](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=21&annotation=WPCQPPLC))
### (2.3) Example Compilation
- Compiling fragment of code into [[assembly]]
	- $height = (width+56)* factor(foo)$
- “The first stage of the [[compiler]] (the [[scanner]]) will read in the text of the [[source code]] character by character, identify the boundaries between symbols, and emit a series of [[tokens]].” ([Thain, p. 7](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=21&annotation=X9H5L8EU))
	- “Each [[Tokens|token]] is a small data structure that describes the nature and contents of each symbol” ([Thain, p. 7](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=21&annotation=U9YRFHHP))
		- ![[Screenshot 2023-09-11 at 12.34.49 PM.png]]
			- At this stage each token not clear
			- Fact and foo are simply known to be [[identifiers]], even though one is a [[procedure|function]] and the other is the name of a [[variable]]
			- Since we don't know type of width, it could be [[integer addition]], [[floating point addition]], [[string concatenation]], or something else.
- “next step is to determine whether this sequence of tokens forms a valid program” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=Q57AF532))
	- “[[parser]] does this by looking for patterns that match the [[grammar]] of a language.” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=DRATJQ7G))
	- Example of compiler that understands a language with following grammar
		- ![[Screenshot 2023-09-11 at 12.37.44 PM.png|300]]
			- “Each line of the grammar is called a [[rule]], and explains how various parts of the language are constructed.” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=YK3DYPA6))
				- “Rules 1-3 indicate that an [[expression]] can be formed by joining two expressions with operators.” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=CYDAV3S8))
				- “Rule 4 describes a function call.” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=BTTXF42A))
				- “Rule 5 describes the use of parentheses.” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=E8MF4JUF))
				- “rules 6 and 7 indicate that identifiers and integers are [[atomic expressions]].” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=WFEMN6WA))
			- This example grammar has ambiguities
	- “The [[parser]] looks for sequences of tokens that can be replaced by the left side of a rule in our grammar.” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=PSRX3V6W))
		- “Each time a rule is applied, the [[parser]] creates a node in a tree, and connects the sub-expressions into the [[abstract syntax tree]] (AST).” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=NYIY2EZA))
			- “AST shows the structural relationships between each symbol” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=68D65ZLP))
			- addition performed on width and 56. Function call is applied to factor and foo
	- “With this data structure in place, we are now prepared to analyze the meaning of the program.” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=UQLJME67))
- “[[semantic routines]] traverse the AST and derive additional meaning by relating parts of the program to each other, and to the definition of the programming language.” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=MHUN6ENL))
	- “[[typechecking]], in which the type of each expression is determined, and checked for consistency with the rest of the program.” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=TPDH8TUK))
		- To keep things simple, will assume all variables are plain integers
- “To generate [[linear intermediate code]], we perform a [[post-order traversal]] of the [[Abstract Syntax Tree|AST]] and generate an [[Intermediate Representation|IR]] instruction for each node in the tree.” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=XT7N6CB2))
	- “A typical [[Intermediate Representation|IR]] looks like an [[abstract assembly language]], with load/store instructions, arithmetic operations, and an infinite number of registers.” ([Thain, p. 8](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=22&annotation=KBQZQL2H))
- Example [[Abstract Syntax Tree|AST]]
	- ![[Screenshot 2023-09-11 at 12.46.30 PM.png|200]]
- Example [[Intermediate Representation|IR]]
	- ![[Screenshot 2023-09-11 at 12.46.54 PM.png]]
		- “intermediate representation is where most forms of optimization occur.” ([Thain, p. 9](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=23&annotation=FHGF8S3B))
		- “Dead code is removed, common operations are combined, and code is generally simplified to consume fewer resources and run more quickly.” ([Thain, p. 9](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=23&annotation=3YAF8LCS))
		- “intermediate code must be converted to the desired assembly code.” ([Thain, p. 9](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=23&annotation=B6FKK456))
- Example of [[Assembly Code]]
	- ![[Screenshot 2023-09-11 at 12.48.26 PM.png]]
		- “X86 assembly code that is one possible translation of the IR given above.” ([Thain, p. 9](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=23&annotation=Y7Q679GG))
		- “assembly instructions do not necessarily correspond one-to-one with IR instructions.” ([Thain, p. 9](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=23&annotation=LSIMFPT3))
- “well-engineered [[compiler]] is highly [[modular]], so that common code elements can be shared and combined as needed.” ([Thain, p. 9](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=23&annotation=F8MPASX3))
	- “To support multiple languages, a [[compiler]] can provide distinct scanners and parsers, each emitting the same intermediate representation” ([Thain, p. 9](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=23&annotation=XVCTYC47))
	- “Different optimization techniques can be implemented as independent modules (each reading and writing the same IR) so that they can be enabled and disabled independently.” ([Thain, p. 9](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=23&annotation=N9KJQH68))
- “A [[retargetable compile]] contains multiple [[Code Generator|code generators]], so that the same IR can be emitted for a variety of microprocessors.” ([Thain, p. 10](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=24&annotation=CK6HPL2Z))
### (2.4) Exercises
- They exist but not in book #archive
## (3) Scanning
### (3.1) Kinds of Tokens
- “[[Scanning]] is the process of identifying [[tokens]] from the raw text source code of a program.” ([Thain, p. 11](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=25&annotation=MZ8CJJFT))
	- “identifying tokens in source code requires the language designer to clarify many fine details, so that it is clear what is permitted and what is not.” ([Thain, p. 11](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=25&annotation=3K39CXDJ))
- “Most languages will have tokens in these categories:” ([Thain, p. 11](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=25&annotation=PMMGFNJ8))
	- “[[Keywords]] are words in the language structure itself, like while or class or true.” ([Thain, p. 11](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=25&annotation=SX48GGZ5))
		- “must be chosen carefully to reflect the natural structure of the language, without interfering with the likely names of variables and other identifiers.” ([Thain, p. 11](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=25&annotation=87Y6HTXM))
	- “[[Identifiers]] are the names of variables, functions, classes, and other code elements chosen by the programmer.” ([Thain, p. 11](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=25&annotation=4VX32Z36))
		- “identifiers are arbitrary sequences of letters and possibly numbers. Some languages require identifiers to be marked with a [[sentinel]] (like the dollar sign in Perl) to clearly distinguish identifiers from [[keywords]].” ([Thain, p. 11](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=25&annotation=22UWZWHQ))
	- “[[Numbers]] could be formatted as [[integers]], or [[floating point values]], or [[fraction|fractions]], or in alternate [[bases (math)|bases]] such as [[binary]], [[octal]] or [[hexadecimal]].” ([Thain, p. 11](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=25&annotation=8ULGM63G))
		- Formats should be distinguished
	- “[[Strings (Computer Science)|Strings]] are literal character sequences that must be clearly distinguished from keywords or identifiers.” ([Thain, p. 11](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=25&annotation=3U24Y22W))
		- typically quoted with single or double quotes
		- “must have some facility for containing quotations, newlines, and unprintable characters.” ([Thain, p. 11](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=25&annotation=BJVIXKBM))
	- “[[Comments]] and [[whitespace]] are used to format a program to make it visually clear, and in some cases (like Python) are significant to the structure of a program.” ([Thain, p. 11](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=25&annotation=2MEL9TKL))
- When designing compiler, first job “state precisely what characters are permitted in each type of token” ([Thain, p. 11](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=25&annotation=7JUDMZLE))
	- Example of informal method
		- ““An identifier consists of a letter followed by any number of letters and numerals.”, and then assigning a [[symbolic constant]] (TOKEN_IDENTIFIER) for that kind of token.” ([Thain, p. 12](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=26&annotation=JPLTNVL2))
	- “informal approach is often ambiguous, and a more rigorous approach is needed.” ([Thain, p. 12](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=26&annotation=77WDR4SE))
- Simple hand made [[scanner]]
	- ![[Screenshot 2023-09-11 at 1.21.46 PM.png|400]]
		- “shows how one might write a scanner by hand, using simple coding techniques.” ([Thain, p. 12](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=26&annotation=S8YUHAQ9))
### (3.2) A Hand-Made Scanner
- “we only consider just a few tokens: * for multiplication, ! for logical-not, != for not-equal, and sequences of letters and numbers for identifiers.” ([Thain, p. 12](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=26&annotation=9KXKMY79)) 
	- “The basic approach is to read one character at a time from the input stream `(fgetc(fp)) `and then classify it” ([Thain, p. 12](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=26&annotation=NLJVH97R))
		- “if the scanner reads a \* character, it immediately returns TOKEN MULTIPLY, and the same would be true for addition, subtraction, and so forth.” ([Thain, p. 12](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=26&annotation=Z4N2H23P))
	- “some characters are part of multiple tokens.” ([Thain, p. 12](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=26&annotation=M4TZ56B9))
		- ! could represent a logical-not operation or != sequence represents not-equal-to. Single-character tokens easy while multiple-character tokens more difficult
	- “Upon reading !, the scanner must immediately read the next character. If the next character is =, then it has matched the sequence != and returns TOKEN NOT EQUAL.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=Y32EIGSN))
		- If character following ! is something else, non-matching character needs to be put back on the [[input stream]] using `ungetc` because it's not part of current token. Scanner returns TOKEN_NOT and will consume put-back character on next call to `scan_token`
- “In a similar way, once a letter has been identified by isalpha(c), then the scanner keeps reading letters or numbers, until a non-matching character is found.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=XMP4FXGB))
	- “The non-matching character is put back, and the scanner returns TOKEN IDENTIFIER.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=TXYUIJG7))
	- “an unexpected item doesn't match the current objective, so it must be put back for later. This is known more generally as [[backtracking]].” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=GSUDJC5D))
- “a [[hand-made scanner]] is rather verbose.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=GV2LV2AA))
	- “a small language with a limited number of tokens, a hand-made scanner can be an appropriate solution.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=FPFQTSVI))
- “complex language with a large number of tokens, we need a more formalized approach to defining and scanning tokens.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=AB3G6Q8V))
	- “scanner itself can be the performance bottleneck in a compiler, since every single character must be individually considered.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=AUVIEM4H))
		- “The formal tools of [[regular expressions]] and [[finite automata]] allow us to state very precisely what may appear in a given token type.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=62TQL7HP))
			- “automated tools can process these definitions, find errors or ambiguities, and produce compact, high performance code.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=QKAUE95L))
### (3.3) Regular Expressions
- “[[Regular expressions]] (REs) are a language for expressing patterns.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=S5YP4VKV))
	- “first described in the 1950s by [[Stephen Kleene]] as an element of his foundational work in automata theory and computability.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=J6TXDHYD))
		- “REs are found in slightly different forms in [[programming languages]] (Perl), [[standard libraries]] (PCRE), [[text editors]] (vi), [[command-line tools]] (grep), and many other places.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=T2RIB2HS))
- “use [[regular expressions]] as a compact and formal way of specifying the tokens accepted by the scanner of a compiler, and then automatically translate those expressions into working code.” ([Thain, p. 13](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=27&annotation=9PI2HY87))
- Formal definition of regular expressions
	- “A [[Regular Expressions|regular expression]] `s` is a string which denotes `L(s)`, a set of strings drawn from an alphabet $\Sigma$. L(s) is known as the "[[language]] of s"” ([Thain, p. 14](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=28&annotation=XCIZ22UK))
	- L(s) is defined inductively with the following base cases
		- If a $\in$ $\Sigma$, then a is a [[Regular Expressions|regular expression]] and L(a) = {a}.
		- $\epsilon$ is a regular expression and $L(\epsilon)$ contains only the empty string.
	- Then for any regular expressions s and t:
		- (1) $s|t$ is a RE such that $L(s|t) = L(s) \cup L(t)$
		- (2) $st$ is a RE such that L(`st`) contains all strings formed by the concatenation of a string in L(s) followed by a string in L(t)
		- (3) $s^*$ is a RE such that $L(s^*)$ = L(s) concatenated zero or more times
	- Rule #3 is known as the [[Kleene closure]] and has the highest precedence.
	- Rule #2 is known as [[concatenation]]
	- Rule #1 has the lowest precedence and is known as [[alternation]]
	- “Parentheses can be added to adjust the order of operations in the usual way.” ([Thain, p. 14](zotero://select/library/items/576GCKS7)) ([pdf](zotero://open-pdf/library/items/9WTIQHYF?page=28&annotation=HX9RSYD9))
- A finite [[Regular Expressions|RE]] can indicate an infinite set
	- Example of Regular Expression (s) and Language L(s)
		- ![[Screenshot 2023-09-12 at 5.44.53 PM.png]]
- Helper operations built on top of the basic syntax can be useful
	- s? indicates s is optional
		- (s| $\epsilon$)
	- s+ indicates s is repeated one or more times
		- $ss*$
	- \[a-z] indicates any character in that range
		- (a|b|...|z)
	- \[\^\x] indicates any character except one
		- $\Sigma - x$
		- #archive
### (3.4) Finite Automata
#### (3.4.1) Deterministic Finite Automata
#### (3.4.2) Nondeterministic Finite Automata
### (3.5) Conversion Algorithms
#### (3.5.1) Converting REs to NFAs
#### (3.5.2) Converting NFAs to DFAs
#### (3.5.3) Minimizing DFAs
### (3.6) Limits of Finite Automata
### (3.7) Using a Scanner Generator
### (3.8) Practical Considerations
### (3.9) Exercises
### (3.10) Further Reading
## (4) Parsing
### (4.1) Overview
### (4.2) Context Free Grammars
#### (4.2.1) Deriving Sentences
#### (4.2.2) Ambiguous Grammars
### (4.3) LL Grammars
#### (4.3.1) Eliminating Left Recursion
#### (4.3.2) Eliminating Common Left Prefixes
#### (4.3.3) First and Follow Sets
#### (4.3.4) Recursive Descent Parsing
#### (4.3.5) Table Driven Parsing
### (4.4) LR Grammars
#### (4.4.1) Shift-Reduce Parsing
#### (4.4.2) The LR(0) Automaton
#### (4.4.3) SLR Parsing
#### (4.4.4) LR(1) Parsing
#### (4.4.5) LALR Parsing
### (4.5) Grammar Classes Revisited
### (4.6) The Chomsky Hierarchy
### (4.7) Exercises
### (4.8) Further Reading
## (5) Parsing in Practice
### (5.1) The Bison Parser Generator
### (5.2) Expression Validator
### (5.3) Expression Interpreter
### (5.4) Expression Trees
### (5.5) Exercises
### (5.6) Further Reading
## (6) The Abstract Syntax Tree
### (6.1) Overview
### (6.2) Declarations
### (6.3) Statements
### (6.4) Expressions
### (6.5) Types
### (6.6) Putting it All Together
### (6.7) Building the AST
### (6.8) Exercises
## (7) Semantic Analysis
### (7.1) Overview of Type Systems
### (7.2) Designing a Type System
### (7.3) The B-Minor Type System
### (7.4) The Symbol Table
### (7.5) Name Resolution
### (7.6) implementing Type Checking
### (7.7) Error Messages
### (7.8) Exercises
### (7.9) Further Reading
## (8) Intermediate Representations
### (8.1) Introduction
### (8.2) Abstract Syntax Tree
### (8.3) Directed Acyclic Graph
### (8.4) Control Flow Graph
### (8.5) Static Single Assignment Form
### (8.6) Linear IR
### (8.7) Stack Machine IR
### (8.8) Examples
#### (8.8.1) GIMPLE - GNU Simple Representation
#### (8.8.2) LLVM - Low Level Virtual Machine
#### (8.8.3) JVM - Java Virtual Machine
### (8.9) Exercises
### (8.10) Further Reading
## (9) Memory Organization
### (9.1) Introduction
### (9.2) Logical Segmentation
### (9.3) Heap Management
### (9.4) Stack Management
#### (9.4.1) Stack Calling Convention
#### (9.4.2) Register Calling Convention
### (9.5) Locating Data
### (9.6) Program Loading
### (9.7) Further Reading
## (10) Assembly Language
### (10.1) Introduction
### (10.2) Open Source Assembler Tools
### (10.3) X86 Assembly Language
#### (10.3.1) Registers and Data Types
#### (10.3.2) Addressing Modes
#### (10.3.3) Basic Arithmetic
#### (10.3.4) Comparisons and Jumps
#### (10.3.5) The Stack
#### (10.3.6) Calling a Function
#### (10.3.7) Defining a Leaf Function
#### (10.3.8) Defining a Complex Function
### (10.4) ARM Assembly
#### (10.4.1) Registers and Data Types
#### (10.4.2) Addressing Modes
#### (10.4.3) Basic Arithmetic
#### (10.4.4) Comparisons and Branches
#### (10.4.5) The Stack
#### (10.4.6) Calling a Function
#### (10.4.7) defining a Leaf Function
#### (10.4.8) Defining a Complex Function
#### (10.4.9) 64-bit Differences
### (10.5) Further Reading
## (11) Code Generation
### (11.1) Introduction
### (11.2) Supporting Functions
### (11.3) Generating Expressions
### (11.4) Generating Statements
### (11.5) Conditional Expressions
### (11.6) Generating Declarations
### (11.7) Exercises
## (12) Optimization
### (12.1) Overview
### (12.2) Optimization in Perspective
### (12.3) High Level Optimizations
#### (12.3.1) Constant folding
#### (12.3.2) Strength Reduction
#### (12.3.3) Loop Unrolling
#### (12.3.4) Code Hoisting
#### (12.3.5) function Inlining
#### (12.3.6) Dead Code Detection and Elimination
### (12.4) Low-Level Optimizations
#### (12.4.1) Peephole Optimizations
#### (12.4.2) Instruction Selection
### (12.5) Register Allocation
#### (12.5.1) Safety of Register Allocation
#### (12.5.2) Priority of Register Allocation
#### (12.5.3) Conflicts Between Variables
#### (12.5.4) Global Register Allocation
### (12.6) Optimization Pitfalls
### (12.7) Optimization Interactions
### (12.8) Exercises
### (12.9) Further Reading
## (A) Sample course Project
### (A.1) Scanner Assignment
### (A.2) Parser Assignment
### (A.3) Pretty-Printer Assignment
### (A.4) Typechecker Assignment
### (A.5) Optional: Intermediate Representation
### (A.6) Code Generator Assignment
### (A.7) Optional: Extend the Language
## (B) The B-Minor Language
### (B.1) Overview
### (B.2) Tokens
### (B.3) Types
### (B.4) Expressions
### (B.5) Declarations and Statements
### (B.6) Functions
### (B.7) Optional Elements
## (C) Coding Conventions