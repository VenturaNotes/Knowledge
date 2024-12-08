---
Source:
  - zotero://open-pdf/library/items/SB7DXRQN?page=2&annotation=XNH36H75
Length: "849"
Progress: "0"
tags:
  - status/incomplete
  - type/textbook
  - temp
---
## A Word About Programming Exercises
- “We have found that students entering the course understand assembly-language programming, so they have no problem understanding how a scheduler or a register allocator should work.” ([Cooper, 2023, p. xxiii](zotero://select/library/items/4VVKN9J3)) ([pdf](zotero://open-pdf/library/items/SB7DXRQN?page=24&annotation=W68IDIYL))
## About the Authors
## About the Cover
## Preface
## (1) Overview of Compilation
### (1.1) Introduction
### (1.2) Compiler Structure
### (1.3) Overview of Translation
#### (1.3.1) The Front End
#### (1.3.2) The Optimizer
#### (1.3.3) The Back End
### (1.4) Engineering
### (1.5) Summary and Perspective
### (1.6) Chapter Notes
### (1.7) Exercises
## (2) Scanners
### (2.1) Introduction
### (2.2) Recognizing Words
#### (2.2.1) A Formalism for Recognizers
#### (2.2.2) Recognizing More Complex Words
### (2.3) Regular Expressions
#### (2.3.1) Formalizing the Notation
#### (2.3.2) Examples of Regular Expressions
#### (2.3.3) Closure Properties of REs
### (2.4) From Regular Expression to Scanner
#### (2.4.1) Nondeterministic Finite Automata
#### (2.4.2) RE to NFA: Thompson's Construction
#### (2.4.3) NFA to DFA: The Subset Construction
#### (2.4.4) DFA to Minimal DFA
#### (2.4.5) Using a DFA as a Scanner
### (2.5) Implementing Scaners
#### (2.5.1) Table-Driven Scanners
#### (2.5.2) Direct-Coded Scanners
#### (2.5.3) Hand-Coded Scanners
#### (2.5.4) Practical Implementation Issues
### (2.6) Advanced Topics
#### (2.6.1) DFA to Regular Expression
#### (2.6.2) Closure-Free Regular Expressions
#### (2.6.3) An Alternative DFA Minimization Algorithm
### (2.7) Summary and Perspective
### (2.8) Chapter Notes
### (2.9) Exercises
## (3) Parsers
### (3.1) Introduction
### (3.2) Expressing Syntax
#### (3.2.1) Why Not Use Regular Expressions?
#### (3.2.2) Context-Free Grammars
#### (3.2.3) More Complex Examples
#### (3.2.4) Encoding Meaning into Structure
#### (3.2.5) Discovering a Derivation for an Input String
### (3.3) Top-Down Parsing
#### (3.3.1) Transforming a Grammar
#### (3.3.2) Top-Down Recursive-Descent Parsers
#### (3.3.3) Table-Driven LL(1) Parsers
### (3.4) Bottom-Up Parsing
#### (3.4.1) The LR(1) Parsing Algorithm
#### (3.4.2) Building LR(1) Tables
#### (3.4.3) Errors in the Table Construction
### (3.5) Practical Issues
#### (3.5.1) Error Recovery
#### (3.5.2) Unary Operators
#### (3.5.3) Handling Context-Sensitive Ambiguity
### (3.6) Advanced Topics
#### (3.6.1) Optimizing a Grammar
#### (3.6.2) Reducing the Size of LR(1) Tables
### (3.7) Summary and Perspective
### (3.8) Chapter Notes
### (3.9) Exercises
## (4) Intermediate Representations
### (4.1) Introduction
### (4.2) An IR Taxonomy
### (4.3) Graphical IRs
#### (4.3.1) Syntax-Related Trees
#### (4.3.2) Graphs
### (4.4) Linear IRs
#### (4.4.1) Stack-Machine Code
#### (4.4.2) Three-Address Code
#### (4.4.3) Representing Linear Codes
#### (4.4.4) Building the CFG from Linear Code
### (4.5) Symbol Tables
#### (4.5.1) Name Resolution
#### (4.5.2) Table Implementation
### (4.6) Name Spaces
#### (4.6.1) Name Spaces in the IR
#### (4.6.2) Static Single-Assignment Form
### (4.7) Placement of Values in Memory
#### (4.7.1) Memory Models
#### (4.7.2) Keeping Values in Registers
#### (4.7.3) Assigning Values to Data Areas
### (4.8) Summary and Perspective
### (4.9) Chapter Notes
### (4.10) Exercises
## (5) Syntax-Driven Translation
### (5.1) Introduction
### (5.2) Background
### (5.3) Syntax-Driven Translation
#### (5.3.1) A First Example
#### (5.3.2) Translating Expressions
#### (5.3.3) Translating Control-Flow Statements
### (5.4) Modeling the Naming Environment
#### (5.4.1) Lexical Hierarchies
#### (5.4.2) Inheritance Hierarchies
#### (5.4.3) Visibility
#### (5.4.4) Performing Compile-Time Name Resolution
### (5.5) Type Information
#### (5.5.1) Uses for Types in Translation
#### (5.5.2) Components of a Type System
#### (5.5.3) Type Inference for Expressions
### (5.6) Storage Layout
#### (5.6.1) Storage Classes and Data Areas
#### (5.6.2) Layout Within a Virtual Address Space
#### (5.6.3) Storage Assignment
#### (5.6.4) Fitting Storage Assignment into Translation
#### (5.6.5) Alignment Restrictions and Padding
### (5.7) Advanced Topics
#### (5.7.1) Grammar Structure and Associativity
#### (5.7.2) Harder Problems in Type Inference
#### (5.7.3) Relative Offsets and Cache Performance
### (5.8) Summary and Perspective
### (5.9) Chapter Notes
### (5.10) Exercises
## (6) Implementing Procedures
### (6.1) Introduction
### (6.2) Background
### (6.3) Runtime Support for Naming
#### (6.3.1) Runtime Support for Algol-Like Languages
#### (6.3.2) Runtime Support for Object-Oriented Languages
### (6.4) Passing Values Between Procedures
#### (6.4.1) Passing Parameters
#### (6.4.2) Returning Values
#### (6.4.3) Establishing Addressability for Nonlocal Variables
### (6.5) Standardized Linkages
### (6.6) Advanced Topics
#### (6.6.1) Explicit Heap Management
#### (6.6.2) Implicit Deallocation
### (6.7) Summary and Perspective
### (6.8) Chapter Notes
### (6.9) Exercises
## (7) Code Shape
### (7.1) Introduction
### (7.2) Aritmetic Operators
#### (7.2.1) Function Calls in an Expression
#### (7.2.2) Mixed-Type Expressions
#### (7.2.3) Reducing Demand for Registers
### (7.3) Access Methods for Values
#### (7.3.1) Access Methods for Scalar Variables
#### (7.3.2) Access Methods for Aggregates
#### (7.3.3) Range Checks
### (7.4) Boolean and Relational Operators
#### (7.4.1) Hardware Support for Relational Expressions
#### (7.4.2) Variations in Hardware Support
### (7.5) Control-Flow Constructs
#### (7.5.1) Conditional Execution
#### (7.5.2) Loops and Iteration
#### (7.5.3) Case Statements
### (7.6) Operations on Strings
#### (7.6.1) String Length
#### (7.6.2) String Assignment
#### (7.6.3) String Concatenation
#### (7.6.4) Optimization of String Operations
### (7.7) Procedure Calls
#### (7.7.1) Evaluating Actual Parameters
#### (7.7.2) Saving and Restoring Registers
### (7.8) Summary and Perspective
### (7.9) Chapter Notes
### (7.10) Exercises
## (8) Introduction to Optimization
### (8.1) Introduction
### (8.2) Background
#### (8.2.1) Examples
#### (8.2.2) Considerations for Optimization
#### (8.2.3) Opportunities for Optimization
### (8.3) Scope of Optimization
### (8.4) Local Optimization
#### (8.4.1) Local Value Numbering
#### (8.4.2) Tree-Height Balancing
### (8.5) Regional Optimization
#### (8.5.1) Superlocal Value Numbering
#### (8.5.2) Loop Unrolling
### (8.6) Global Optimization
#### (8.6.1) Finding Uninitialized Variables
#### (8.6.2) Global Code Placement
### (8.7) Interprocedural Optimization
#### (8.7.1) Inline Substitution
#### (8.7.2) Procedure Placement
#### (8.7.3) Pragmatics of Interprocedural Optimization
### (8.8) Summary and Perspective
### (8.9) Chapter Notes
### (8.10) Exercises
## (9) Data-Flow Analysis
### (9.1) Introduction
### (9.2) Iterative Data-Flow Analysis
#### (9.2.1) Dominance
#### (9.2.2) Live-Variable Analysis
#### (9.2.3) Limitations on Data-Flow Analysis
#### (9.2.4) Other Data-Flow Problems
### (9.3) Static Single-Assignment Form
#### (9.3.1) A Naive Method for Building SSA Form
#### (9.3.2) Dominance Frontiers
#### (9.3.3) Placing phi-Functions 
#### (9.3.4) Renaming
#### (9.3.5) Translation out of SSA Form
#### (9.3.6) Using SSA Form
### (9.4) Interprocedural Analysis
#### (9.4.1) Call-Graph Construction
#### (9.4.2) Interprocedural Constant Propagation
### (9.5) Advanced Topics
#### (9.5.1) Structural Data-Flow Analysis and Reducibility
#### (9.5.2) Speeding up the Iterative Dominance Framework
### (9.6) Summary and Perspective
### (9.7) Chapter Notes
### (9.8) Exercises
## (10) Scalar Optimization
### (10.1) Introduction
### (10.2) Dead Code Elimination
#### (10.2.1) Eliminating Useless Code
#### (10.2.2) Eliminating Useless Control Flow
#### (10.2.3) Eliminating Unreachable Code
### (10.3) Code Motion
#### (10.3.1) Lazy Code Motion
#### (10.3.2) Code Hoisting
### (10.4) Specialization
#### (10.4.1) Tail-Call Optimization
#### (10.4.2) Leaf-Call Optimization
#### (10.4.3) Parameter Promotion
### (10.5) Redundancy Elimination
#### (10.5.1) Value Identity Versus Name Identity
#### (10.5.2) Dominator-Based Value Numbering
### (10.6) Enabling Other Transformations
#### (10.6.1) Superblock Cloning
#### (10.6.2) Procedure Cloning
#### (10.6.3) Loop Unswitching
#### (10.6.4) Renaming
### (10.7) Advanced Topics
#### (10.7.1) Combining Optimizations
#### (10.7.2) Strength Reduction
#### (10.7.3) Choosing an Optimization Sequence
### (10.8) Summary and Perspective
### (10.9) Chapter Notes
### (10.10) Exercises
## (11) Instruction Selection
### (11.1) Introduction
### (11.2) Background
#### (11.2.1) The Impact of ISA Design on Selection
#### (11.2.2) Motivating Example
#### (11.2.3) Ad-Hoc Matching
### (11.3) Selection via Peephole Optimization
#### (11.3.1) Peephole Optimization
#### (11.3.2) The Simplifier
#### (11.3.3) The Matcher
### (11.4) Selection via Tree-Pattern Matching
#### (11.4.1) Representing Trees
#### (11.4.2) Rewrite Rules
#### (11.4.3) Computing Tilings
#### (11.4.4) Tools
### (11.5) Advanced Topics
#### (11.5.1) Learning Peephole Patterns
#### (11.5.2) Generating Instruction Sequences
### (11.6) Summary and Perspective
### (11.7) Chapter Notes
### (11.8) Exercises
## (12) Instruction Scheduling
### (12.1) Introduction
### (12.2) Background
#### (12.2.1) Architectural Features That Affect Performance
#### (12.2.2) The Instruction Scheduling Problem
### (12.3) Local Scheduling
#### (12.3.1) The Algorithm
#### (12.3.2) Renaming
#### (12.3.3) Building the Dependence Graph
#### (12.3.4) Computing Priorities
#### (12.3.5) List Scheduling
#### (12.3.6) Forward Versus Backward List Scheduling
### (12.4) Regional Scheduling
#### (12.4.1) Superlocal Scheduling
#### (12.4.2) Trace Scheduling
#### (12.4.3) Cloning for Context
### (12.5) Advanced Topics
#### (12.5.1) The Strategy Behind Software Pipelining
#### (12.5.2) An Algorithm for Software Pipelining
#### (12.5.3) A Final Example
### (12.6) Summary and Perspective
### (12.7) Chapter Notes
### (12.8) Exercises
## (13) Register Allocation
### (13.1) Introduction
### (13.2) Background
#### (13.2.1) A Name Space for Allocation: Live Ranges
#### (13.2.2) Interference
#### (13.2.3) Spill Code
#### (13.2.4) Register Classes
### (13.3) Local Register Allocation
#### (13.3.1) Renaming in the Local Allocator
#### (13.3.2) Allocation and Assignment
### (13.4) Global Allocation via Coloring
#### (13.4.1) Find Global Live Ranges
#### (13.4.2) Build an Interference Graph
#### (13.4.3) Coalesce Copy Operations
#### (13.4.4) Estimate Global Spill Costs
#### (13.4.5) Color the Graph
#### (13.4.6) Insert Spill and Restore Code
#### (13.4.7) Handling Overlapping Register Classes
### (13.5) Advanced Topics
#### (13.5.1) Variations on Coalescing
#### (13.5.2) Variations on Spilling
#### (13.5.3) Other Forms of Live Ranges
### (13.6) Summary and Perspective
### (13.7) Chapter Notes
### (13.8) Exercises
## (14) Runtime Optimization
### (14.1) Introduction
### (14.2) Background
#### (14.2.1) Execution Model
#### (14.2.2) Compilation Triggers
#### (14.2.3) Granularity of Optimization
#### (14.2.4) Sources of Improvement
#### (14.2.5) Building a Runtime Optimizer
### (14.3) Hot-Trace Optimization
#### (14.3.1) Flow of Execution
#### (14.3.2) Linking Traces
### (14.4) Hot-Method Optimization
#### (14.4.1) Hot-Methods in a Mixed-Mode Environment
#### (14.4.2) Hot-Methods in a Native-Code Environment
### (14.5) Advanced Topics
#### (14.5.1) Levels of Optimization
#### (14.5.2) On-Stack Replacement
#### (14.5.3) Code Cache Management
#### (14.5.4) Managing Changes to the Source Code
### (14.6) Summary and Perspective
### (14.7) Chapter Notes
### (14.8) Exercises
## (Appendix A) ILOC
### (A.1) Introduction
### (A.2) Naming Conventions
### (A.3) Computational Operations
### (A.4) Data Movement Operations
### (A.5) Control-Flow Operations
### (A.6) Opcode Summary Tables
## (Appendix B) Data Structures
### (B.1) Introduction
### (B.2) Representing Sets
#### (B.2.1) Representing Sets as Ordered Lists
#### (B.2.2) Representing Sets as Bit Vectors
#### (B.2.3) Representing Sparse Sets
#### (B.2.4) The Role of Hash Tables
### (B.3) IR Implementation
#### (B.3.1) Graphical Intermediate Representations
#### (B.3.2) Linear Intermediate Forms
### (B.4) Implementing Hash Tables
#### (B.4.1) Choosing a Hash Funciton
#### (B.4.2) Open Hashing
#### (B.4.3) Open Addressing
#### (B.4.4) Storing Symbol Records
### (B.5) A Flexible Symbol-Table Design
### (B.6) Appendix Notes