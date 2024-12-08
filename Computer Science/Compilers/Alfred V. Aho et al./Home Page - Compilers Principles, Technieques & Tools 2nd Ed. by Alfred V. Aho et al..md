---
Source:
  - zotero://open-pdf/library/items/3RVKPCZG?page=2&annotation=SGIAWWDC
Length: "1035"
Progress: "0"
tags:
  - status/incomplete
  - type/textbook
  - temp
---
## (1) Introduction
### (1.1) Language Processors
#### (1.1.1) Exercises for Section 1.1
### (1.2) The Structure of a Compiler
#### (1.2.1) Lexical Analysis
#### (1.2.2) Syntax Analysis
#### (1.2.3) Semantic Analysis
#### (1.2.4) Intermediate Code Generation
#### (1.2.5) Code Optimization
#### (1.2.6) Code Generation
#### (1.2.7) Symbol-Table Management
#### (1.2.8) Symbol-Table Management
#### (1.2.9) Compiler-Construction Tools
### (1.3) The Evolution of Programming Languages
#### (1.3.1) The Move to Higher-Level 
#### (1.3.2) Impacts on Compilers
#### (1.3.3) Exercises for Section 1.3
### (1.4) The Science of Building a Compiler
#### (1.4.1) Modeling in Compiler Design and Implementation
#### (1.4.2) The Science of Code Optimization
### (1.5) Applications of Compiler Technology
#### (1.5.1) Implementation of High-Level Programming Languages
#### (1.5.2) Optimizations for Computer Architectures
#### (1.5.3) Design of New Computer Architectures
#### (1.5.4) Program Translations
#### (1.5.5) Software Productivity Tools
### (1.6) Programming Language Basics
#### (1.6.1) The Static/Dynamic Distinction
#### (1.6.2) Environments and States
#### (1.6.3) Static Scope and Block Structure
#### (1.6.4) Explicit Access Control
#### (1.6.5) Dynamic Scope
#### (1.6.6) Parameter Passing Mechanisms
#### (1.6.7) Aliasing
#### (1.6.8) Exercises for Section 1.6
### (1.7) Summary of Chapter 1
### (1.8) References for Chapter 1

## (2) A Simple Syntax-Directed Translator

### (2.1) Introduction

### (2.2) Syntax Definition

#### (2.2.1) Definition of Grammars

#### (2.2.2) Derivations

#### (2.2.3) Parse Trees

#### (2.2.4) Ambiguity

#### (2.2.5) Associativity of Operators

#### (2.2.6) Precedence of Operators

#### (2.2.7) Exercises for Section 2.2

### (2.3) Syntax-Directed Translation

#### (2.3.1) Postfix Notation

#### (2.3.2) Synthesized Attributes

#### (2.3.3) Simple Syntax-Directed Definitions

#### (2.3.4) Tree Traversals

#### (2.3.5) Translation Schemes

#### (2.3.6) Exercises for Section 2.3

### (2.4) Parsing

#### (2.4.1) Top-Down Parsing

#### (2.4.2) Predictive Parsing

#### (2.4.3) When to Use ε-Productions

#### (2.4.4) Designing a Predictive Parser

#### (2.4.5) Left Recursion

#### (2.4.6) Exercises for Section 2.4

### (2.5) A Translator for Simple Expressions

#### (2.5.1) Abstract and Concrete Syntax

#### (2.5.2) Adapting the Translation Scheme

#### (2.5.3) Procedures for the Nonterminals

#### (2.5.4) Simplifying the Translator

#### (2.5.5) The Complete Program

### (2.6) Lexical Analysis

#### (2.6.1) Removal of White Space and Comments

#### (2.6.2) Reading Ahead

#### (2.6.3) Constants

#### (2.6.4) Recognizing Keywords and Identifiers

#### (2.6.5) A Lexical Analyzer

#### (2.6.6) Exercises for Section 2.6

### (2.7) Symbol Tables

#### (2.7.1) Symbol Table Per Scope

#### (2.7.2) The Use of Symbol Tables
### (2.8) Intermediate Code Generation

#### (2.8.1) Two Kinds of Intermediate Representations

#### (2.8.2) Construction of Syntax Trees

#### (2.8.3) Static Checking

#### (2.8.4) Three-Address Code

#### (2.8.5) Exercises for Section 2.8

### (2.9) Summary of Chapter 2

## (3) Lexical Analysis

### (3.1) The Role of the Lexical Analyzer

#### (3.1.1) Lexical Analysis Versus Parsing

#### (3.1.2) Tokens, Patterns, and Lexemes

#### (3.1.3) Attributes for Tokens

#### (3.1.4) Lexical Errors

#### (3.1.5) Exercises for Section 3.1

### (3.2) Input Buffering

#### (3.2.1) Buffer Pairs

#### (3.2.2) Sentinels

### (3.3) Specification of Tokens

#### (3.3.1) Strings and Languages

#### (3.3.2) Operations on Languages

#### (3.3.3) Regular Expressions

#### (3.3.4) Regular Definitions

#### (3.3.5) Extensions of Regular Expressions

#### (3.3.6) Exercises for Section 3.3

### (3.4) Recognition of Tokens

#### (3.4.1) Transition Diagrams

#### (3.4.2) Recognition of Reserved Words and Identifiers

#### (3.4.3) Completion of the Running Example

#### (3.4.4) Architecture of a Transition-Diagram-Based Lexical Analyzer

#### (3.4.5) Exercises for Section 3.4

### (3.5) The Lexical-Analyzer Generator Lex

#### (3.5.1) Use of Lex

#### (3.5.2) Structure of Lex Programs

#### (3.5.3) Conflict Resolution in Lex

#### (3.5.4) The Lookahead Operator

#### (3.5.5) Exercises for Section 3.5

### (3.6) Finite Automata

#### (3.6.1) Nondeterministic Finite Automata

#### (3.6.2) Transition Tables

#### (3.6.3) Acceptance of Input Strings by Automata

#### (3.6.4) Deterministic Finite Automata

#### (3.6.5) Exercises for Section 3.6

### (3.7) From Regular Expressions to Automata
#### (3.7.1) Conversion of an NFA to a DFA
#### (3.7.2) Simulation of an NFA
#### (3.7.3) Efficiency of NFA Simulation
#### (3.7.4) Construction of an NFA from a Regular Expression
#### (3.7.5) Efficiency of String-Processing Algorithms
#### (3.7.6) Exercises for Section 3.7
### (3.8) Design of a Lexical-Analyzer Generator
#### (3.8.1) The Structure of the Generated Analyzer
#### (3.8.2) Pattern Matching Based on NFA's
#### (3.8.3) DFA's for Lexical Analyzers
#### (3.8.4) Implementing the Lookahead Operator
#### (3.8.5) Exercises for Section 3.8
### (3.9) Optimization of DFA-Based Pattern Matchers
#### (3.9.1) Important States of an NFA
#### (3.9.2) Functions Computed From the Syntax Tree
#### (3.9.3) Computing nullable, firstpos, and lastpos
#### (3.9.4) Computing followpos
#### (3.9.5) Converting a Regular Expression Directly to a DFA
#### (3.9.6) Minimizing the Number of States of a DFA
#### (3.9.7) State Minimization in Lexical Analyzers
#### (3.9.8) Trading Time for Space in DFA Simulation
#### (3.9.9) Exercises for Section 3.9
### (3.10) Summary of Chapter 3
### (3.11) References for Chapter 3
## (4) Syntax Analysis
### (4.1) Introduction
#### (4.1.1) The Role of the Parser
#### (4.1.2) Representative Grammars
#### (4.1.3) Syntax Error Handling
#### (4.1.4) Error-Recovery Strategies
### (4.2) Context-Free Grammars
#### (4.2.1) The Formal Definition of a Context-Free Grammar
#### (4.2.2) Notational Conventions
#### (4.2.3) Derivations
#### (4.2.4) Parse Trees and Derivatives
#### (4.2.5) Ambiguity
#### (4.2.6) Verifying the Language Generated by a Grammar
#### (4.2.7) Context-Free Grammars Versus Regular Expressions
#### (4.2.8) Exercises for Section 4.2
### (4.3) Writing a Grammar
#### (4.3.1) Lexical Versus Syntactic Analysis
#### (4.3.2) Eliminating Ambiguity
#### (4.3.3) Elimination of Left Recursion
#### (4.3.4) Left Factoring
#### (4.3.5) Non-Context-Free Language Constructs
#### (4.3.6) Exercises for Section 4.3
### (4.4) Top-Down Parsing
#### (4.4.1) Recursive-Descent Parsing
#### (4.4.2) FIRST and FOLLOW
#### (4.4.3) LL(1) Grammars
#### (4.4.4) Nonrecursive Predictive Parsing
#### (4.4.5) Error Recovery in Predictive Parsing
#### (4.4.6) Exercises for Section 4.4
### (4.5) Bottom-Up Parsing
#### (4.5.1) Reductions
#### (4.5.2) Handle Pruning
#### (4.5.3) Shift-Reduce Parsing
#### (4.5.4) Conflicts During Shift-Reduce Parsing
#### (4.5.5) Exercises for Section 4.5
### (4.6) Introduction to LR Parsing: Simple LR
#### (4.6.1) Why LR Parsers?
#### (4.6.2) Items and the LR(0) Automaton
#### (4.6.3) The LR-Parsing Algorithm
#### (4.6.4) Constructing SLR-Parsing Tables
#### (4.6.5) Viable Prefixes
#### (4.6.6) Exercises for Section 4.6
### (4.7) More Powerful LR Parsers
#### (4.7.1) Canonical LR(1) Items
#### (4.7.2) Constructing LR(1) Sets of Items
#### (4.7.3) Canonical LR(1) Parsing Tables
#### (4.7.4) Constructing LALR Parsing Tables
#### (4.7.5) Efficient Construction of LALR Parsing Tables
#### (4.7.6) Compaction of LR Parsing Tables
#### (4.7.7) Exercises for Section 4.7
### (4.8) Using Ambiguous Grammars
#### (4.8.1) Precedence and Associativity to Resolve Conflicts
#### (4.8.2) The "Dangling-Else" Ambiguity
#### (4.8.3) Error Recovery in LR Parsing
#### (4.8.4) Exercises for Section 4.8
### (4.9) Parser Generators
#### (4.9.1) The Parser Generator Yacc
#### (4.9.2) Using Yacc with Ambiguous Grammars
#### (4.9.3) Creating Yacc Lexical Analyzers with Lex
#### (4.9.4) Error Recovery in Yacc
#### (4.9.5) Exercises for Section 4.9
### (4.10) Summary of Chapter 4
### (4.11) References for Chapter 4
## (5) Syntax-Directed Translation
### (5.1) Syntax-Directed Definitions
#### (5.1.1) Inherited and Synthesized Attributes
#### (5.1.2) Evaluating an SDD at the Nodes of a Parse Tree
#### (5.1.3) Exercises for Section 5.1
### (5.2) Evaluation Orders for SDD's
#### (5.2.1) Dependency Graphs
#### (5.2.2) Ordering the Evaluation of Attributes
#### (5.2.3) S-Attributed Definitions
#### (5.2.4) L-Attributed Definitions
#### (5.2.5) Semantic Rules with Controlled Side Effects
#### (5.2.6) Exercises for Section 5.2
### (5.3) Applications of Syntax-Directed Translation
#### (5.3.1) Construction of Syntax Trees
#### (5.3.2) The Structure of a Type
#### (5.3.3) Exercises for Section 5.3
### (5.4) Syntax-Directed Translation Schemes
#### (5.4.1) Postfix Translation Schemes
#### (5.4.2) Parser-Stack Implementation of Postfix SDT's
#### (5.4.3) SDT's With Actions Inside Productions
#### (5.4.4) Eliminating Left Recursion Form SDT's
#### (5.4.5) SDT's for L-Attributed Definitions
#### (5.4.6) Exercises for Section 5.4
### (5.5) Implementing L-Attributed SDD's
#### (5.5.1) Translation During Recursive-Descent Parsing
#### (5.5.2) On-The-Fly Code Generation
#### (5.5.3) L-Attributed SDD's and LL Parsing
#### (5.5.4) Bottom-Up Parsing the L-Attributed SDD's
#### (5.5.5) Exercises for Section 5.5
### (5.6) Summary of Chapter 5
### (5.7) References for Chapter 5
## (6) Intermediate-Code Generation
### (6.1) Variants of Syntax Trees
#### (6.1.1) Directed Acyclic Graphs for Expressions
#### (6.1.2) The Value-Number Method for Constructing DAG's
#### (6.1.3) Exercises for Section 6.1
### (6.2) Three-Address Code
#### (6.2.1) Addresses and Instructions
#### (6.2.2) Quadruples
#### (6.2.3) Triples
#### (6.2.4) Static Single-Assignment Form
#### (6.2.5) Exercises for Section 6.2
### (6.3) Types and Declarations
#### (6.3.1) Type Expressions
#### (6.3.2) Type Equivalence
#### (6.3.3) Declarations
#### (6.3.4) Storage Layout for Local Names
#### (6.3.5) Sequences of Declarations
#### (6.3.6) Fields in Records and Classes
#### (6.3.7) Exercises for Section 6.3
### (6.4) Translation of Expressions
#### (6.4.1) Operations Within Expressions
#### (6.4.2) Incremental Translation
#### (6.4.3) Addressing Array Elements
#### (6.4.4) Translation of Array References
#### (6.4.5) Exercises for Section 6.4
### (6.5) Type Checking
#### (6.5.1) Rules for Type Checking
#### (6.5.2) Type Conversions
#### (6.5.3) Overloading of Functions and Operators
#### (6.5.4) Type Inference and Polymorphic Functions
#### (6.5.5) An Algorithm for Unification
#### (6.5.6) Exercises for Section 6.5
### (6.6) Control Flow
#### (6.6.1) Boolean Expressions
#### (6.6.2) Short-Circuit Code
#### (6.6.3) Flow-of-Control Statements
#### (6.6.4) Control-Flow Translation of Boolean Expressions
#### (6.6.5) Avoiding Redundant Gotos
#### (6.6.6) Boolean Values and Jumping Code
#### (6.6.7) Exercises for Section 6.6
### (6.7) Backpatching
#### (6.7.1) One-Pass Code Generation Using Backpatching
#### (6.7.2) Backpatching for Boolean Expressions
#### (6.7.3) Flow-of-Control Statements
#### (6.7.4) Break-, Continue-, and Goto-Statements
#### (6.7.5) Exercises for Section 6.7
### (6.8) Switch-Statements
#### (6.8.1) Translation of Switch-Statements
#### (6.8.2) Syntax-Directed Translation of Switch-Statements
#### (6.8.3) Exercises for Section 6.8
### (6.9) Intermediate Code for Procedures
### (6.10) Summary of Chapter 6
### (6.11) References for Chapter 6
## (7) Run-Time Environments
### (7.1) Storage Organization
#### (7.1.1) Static Versus Dynamic Storage Allocation
### (7.2) Stack Allocation of Space
#### (7.2.1) Activation Trees
#### (7.2.2) Activation Records
#### (7.2.3) Calling Sequences
#### (7.2.4) Variable-Length Data on the Stack
#### (7.2.5) Exercises for Section 7.2
### (7.3) Access to Nonlocal Data on the Stack
#### (7.3.1) Data Access Without Nested Procedures
#### (7.3.2) Issues With Nested Procedures
#### (7.3.3) A Language With Nested Procedure Declarations
#### (7.3.4) Nesting Depth
#### (7.3.5) Access Links
#### (7.3.6) Manipulating Access Links
#### (7.3.7) Access Links for Procedure Parameters
#### (7.3.8) Displays
#### (7.3.9) Exercises for Section 7.3
### (7.4) Heap Management
#### (7.4.1) The Memory Manager
#### (7.4.2) The Memory Hierarchy of a Computer
#### (7.4.3) Locality in Programs
#### (7.4.4) Reducing Fragmentation
#### (7.4.5) Manual Deallocation Requests
#### (7.4.6) Exercises for Section 7.4
### (7.5) Introduction to Garbage Collection
#### (7.5.1) Design Goals for Garbage Collectors
#### (7.5.2) Reachability
#### (7.5.3) Reference Counting Garbage Collectors
#### (7.5.4) Exercises for Section 7.5
### (7.6) Introduction to Trace-Based Collection
#### (7.6.1) A Basic Mark-and-Sweep Collector
#### (7.6.2) Basic Abstraction
#### (7.6.3) Optimizing mark-and-Sweep
#### (7.6.4) Mark-and-Compact Garbage Collectors
#### (7.6.5) copying collectors
#### (7.6.6) Comparing Costs
#### (7.6.7) Exercises for Section 7.6
### (7.7) Short-Pause Garbage Collection
#### (7.7.1) Incremental Garbage Collection
#### (7.7.2) Incremental Reachability Analysis
#### (7.7.3) Partial-Collection Basics
#### (7.7.4) Generational Garbage Collection
#### (7.7.5) The Train Algorithm
#### (7.7.6) Exercises for Section 7.7
### (7.8) Advanced Topics in Garbage Collection
#### (7.8.1) Parallel and Concurrent Garbage Collection
#### (7.8.2) Partial Object Relocation
#### (7.8.3) Conservative Collection for Unsafe Languages
#### (7.8.4) Weak References
#### (7.8.5) Exercises for Section 7.8
### (7.9) Summary of Chapter 7
### (7.10) References for Chapter 7
## (8) Code Generation
### (8.1) Issues in the Design of a Code Generator
#### (8.1.1) Input to the Code Generator
#### (8.1.2) The Target Program
#### (8.1.3) Instruction Selection
#### (8.1.4) Register Allocation
#### (8.1.5) Evaluating Order
### (8.2) The Target Language
#### (8.2.1) A Simple Target Machine Model
#### (8.2.2) Program and Instruction Costs
#### (8.2.3) Exercises for Section 8.2
### (8.3) Addresses in the Target Code
#### (8.3.1) Static Allocation
#### (8.3.2) Stack Allocation
#### (8.3.3) Run-Time Addresses for Names
#### (8.3.4) Exercises for Section 8.3
### (8.4) Basic Blocks and Flow Graphs
#### (8.4.1) Basic Blocks
#### (8.4.2) Next-Use Information
#### (8.4.3) Flow Graphs
#### (8.4.4) Representation of Flow Graphs
#### (8.4.5) Loops
#### (8.4.6) Exercises for Section 8.4
### (8.5) Optimization of Basic Blocks
#### (8.5.1) The DAG Representation of Basic Blocks
#### (8.5.2) Finding Local Common Subexpressions
#### (8.5.3) Dead Code Elimination
#### (8.5.4) The Use of Algebraic Identities
#### (8.5.5) Representation of Array References
#### (8.5.6) Pointer Assignments and Procedure Calls
#### (8.5.7) Reassembling Basic Blocks From DAG's
#### (8.5.8) Exercises for Section 8.5
### (8.6) A Simple Code Generator
#### (8.6.1) Register and Address Descriptors
#### (8.6.2) The Code-Generation Algorithm
#### (8.6.3) Design of the Function getReg
#### (8.6.4) Exercises for Section 8.6
### (8.7) Peephole Optimization
#### (8.7.1) Eliminating Redundant Loads and Stores
#### (8.7.2) Eliminating Unreachable Code
#### (8.7.3) Flow-of-Control Optimizations
#### (8.7.4) Algebraic Simplification and Reduction in Strength
#### (8.7.5) Use of Machine Idioms
#### (8.7.6) Exercises for Section 8.7
### (8.8) Register Allocation and Assignment
#### (8.8.1) Global Register Allocation
#### (8.8.2) Usage Counts
#### (8.8.3) Register Assignment for Outer Loops
#### (8.8.4) register Allocation by Graph Coloring
#### (8.8.5) Exercises for Section 8.8
### (8.9) Instruction Selection by Tree Rewriting
#### (8.9.1) Tree-Translation Schemes
#### (8.9.2) Code Generation by Tiling an Input Tree
#### (8.9.3) Pattern Matching by Parsing
#### (8.9.4) Routines for Semantic Checking
#### (8.9.5) General Tree Matching
#### (8.9.6) Exercises for Section 8.9
### (8.10) Optimal Code Generation for Expressions
#### (8.10.1) Ershov Numbers
#### (8.10.2) Generating Code From Labeled Expression Trees
#### (8.10.3) Evaluating Expressions with an Insufficient Supply of Registers
#### (8.10.4) Exercises for Section 8.10
### (8.11) Dynamic Programming Code-Generation
#### (8.11.1) Contiguous Evaluation
#### (8.11.2) The Dynamic Programming Algorithm
#### (8.11.3) Exercises for Section 8.11
### (8.12) Summary of Chapter 8
### (8.13) References for Chapter 8
## (9) Machine-Independent Optimizations
### (9.1) The Principal Sources of Optimization
#### (9.1.1) Causes of Redundancy
#### (9.1.2) A Running Example: Quicksort
#### (9.1.3) Semantics-Preserving Transformations
#### (9.1.4) Global Common Subexpressions
#### (9.1.5) Copy Propagation
#### (9.1.6) Dead-Code Elimination
#### (9.1.7) Code Motion
#### (9.1.8) Induction Variables and Reduction in Strength
#### (9.1.9) Exercises for Section 9.1
### (9.2) Introduction to Data-Flow Analysis
#### (9.2.1) The Data-Flow Abstraction
#### (9.2.2) The Data-Flow Analysis Schema
#### (9.2.3) Data-Flow Schemas on Basic Blocks
#### (9.2.4) Reaching Definitions
#### (9.2.5) Live-Variable Analysis
#### (9.2.6) Available Expressions
#### (9.2.7) Summary
#### (9.2.8) Exercises for Section 9.2
### (9.3) Foundations of Data-Flow Analysis
#### (9.3.1) Semilattices
#### (9.3.2) Transfer Functions
#### (9.3.3) The Iterative Algorithm for General Frameworks
#### (9.3.4) Meaning of a Data-Flow Solution
#### (9.3.5) Exercises for Section 9.3
### (9.4) Constant Propagation
#### (9.4.1) Data-Flow Values for the Constant-Propagation Framework
#### (9.4.2) The Meet for the Constant-Propagation Framework
#### (9.4.3) Transfer Functions for the Constant-Propagation Framework
#### (9.4.4) Monotonicity of the Constant-Propagation Framework
#### (9.4.5) Nondistributivity of the Constant-Propagation Framework
#### (9.4.6) Interpretation of the Results
#### (9.4.7) Exercises for Section 9.4
### (9.5) Partial-Redundancy Elimination
#### (9.5.1) The Sources of Redundancy
#### (9.5.2) Can All Redundancy Be Eliminated?
#### (9.5.3) The Lazy-Code-Motion Problem
#### (9.5.4) Anticipation of Expressions
#### (9.5.5) The Lazy-Code-Motion Algorithm
#### (9.5.6) Exercises for Section 9.5
### (9.6) Loops in Flow Graphs
#### (9.6.1) Dominators
#### (9.6.2) Depth-First Ordering
#### (9.6.3) Edges in a Depth-First Spanning Tree
#### (9.6.4) Back Edges and Reducibility
#### (9.6.5) Depth of a Flow Graph
#### (9.6.6) Natural Loops
#### (9.6.7) Speed of Convergence of Iterative Data-Flow Algorithms
#### (9.6.8) Exercises for Section 9.6
### (9.7) Region-Based Analysis
#### (9.7.1) Regions
#### (9.7.2) Region Hierarchies for Reducible Flow Graphs
#### (9.7.3) Overview of a Region-Based Analysis
#### (9.7.4) Necessary Assumptions About Transfer Functions
#### (9.7.5) An Algorithm for Region-Based Analysis
#### (9.7.6) Handling Nonreducible Flow Graphs
#### (9.7.7) Exercises for Section 9.7
### (9.8) Symbolic Analysis
#### (9.8.1) Affine Expressions of Reference Variables
#### (9.8.2) Data-Flow Problem Formulation
#### (9.8.3) Region-Based Symbolic Analysis
#### (9.8.4) Exercises for Section 9.8
### (9.9) Summary of Chapter 9
### (9.10) References for Chapter 9
## (10) Instruction-Level Parallelism
### (10.1) Processor Architectures
#### (10.1.1) Instruction Pipelines and Branch Delays
#### (10.1.2) Pipelined Execution
#### (10.1.3) Multiple Instruction Issue
### (10.2) Code-Scheduling Constraints
#### (10.2.1) Data Dependence
#### (10.2.2) Finding Dependences Among Memory Accesses
#### (10.2.3) Tradeoff Between Register Usage and Parallelism
#### (10.2.4) Phase Ordering Between Register Allocation and Code Scheduling
#### (10.2.5) Control Dependence
#### (10.2.6) Speculative Execution Support
#### (10.2.7) A Basic Machine Model
#### (10.2.8) Exercises for Section 10.2
### (10.3) Basic-Black Scheduling
#### (10.3.1) Data-Dependence Graphs
#### (10.3.2) List Scheduling of Basic Blocks
#### (10.3.3) Prioritized Topological Orders
#### (10.3.4) Exercises for Section 10.3
### (10.4) Global Code Scheduling
#### (10.4.1) Primitive Code Motion
#### (10.4.2) Upward Code Motion
#### (10.4.3) Downward Code Motion
#### (10.4.4) Updating Data Dependencies
#### (10.4.5) Global Scheduling Algorithms
#### (10.4.6) Advanced Code Motion Techniques
#### (10.4.7) Interaction with Dynamic Schedulers
#### (10.4.8) Exercises for Section 10.4
### (10.5) Software Pipelining
#### (10.5.1) Introduction
#### (10.5.2) Software Pipelining of Loops
#### (10.5.3) Register Allocation and Code Generation
#### (10.5.4) Do-Across Loops
#### (10.5.5) Goals and Constraints of Software Pipelining
#### (10.5.6) A Software-Pipelining Algorithm
#### (10.5.7) Scheduling Acyclic Data-Dependence Graphs
#### (10.5.8) Scheduling Cyclic Dependence Graphs
#### (10.5.9) Improvements to the Pipelining Algorithms
#### (10.5.10) Modular Variable Expansion
#### (10.5.11) Conditional Statements
#### (10.5.12) Hardware Support for Software Pipelining
#### (10.5.13) Exercises for Section 10.5
### (10.6) Summary of Chapter 10
### (10.7) References for Chapter 10
## (11) Optimizing for Parallelism and Locality
### (11.1) Basic Concepts
#### (11.1.1) Multiprocessors
#### (11.1.2) Parallelism in Applications
#### (11.1.3) Loop-Level Parallelism
#### (11.1.4) Data Locality
#### (11.1.5) Introduction to Affine Transform Theory
### (11.2) Matrix Multiply: An In-Depth Example
#### (11.2.1) The Matrix-Multiplication Algorithm
#### (11.2.2) Optimizations
#### (11.2.3) Cache Interference
#### (11.2.4) Exercises for Section 11.2
### (11.3) Iteration Spaces
#### (11.3.1) Constructing Iteration Spaces from Loop Nests
#### (11.3.2) Execution Order for Loop Nests
#### (11.3.3) Matrix formulation of Inequalities
#### (11.3.4) Incorporating Symbolic Constants
#### (11.3.5) Controlling the Order of Execution
#### (11.3.6) Changing Axes
#### (11.3.7) Exercises for Section 11.3
### (11.4) Affine Array Indexes
#### (11.4.1) Affine Accesses
#### (11.4.2) Affine and Nonaffine Accesses in Practice
#### (11.4.3) Exercises for Section 11.4
### (11.5) Data Reuse
#### (11.5.1) Types of Reuse
#### (11.5.2) Self Reuse
#### (11.5.3) Self-Spatial Reuse
#### (11.5.4) Group Reuse
#### (11.5.5) Exercises for Section 11.5
### (11.6) Array Data-Dependence Analysis
#### (11.6.1) Definition of Data Dependence of Array Accesses
#### (11.6.2) Integer Linear Programming
#### (11.6.3) The GCD Test
#### (11.6.4) Heuristics for Solving Integer Linear Programs
#### (11.6.5) Solving General Integer Linear Programs
#### (11.6.6) Summary
#### (11.6.7) Exercises for Section 11.6
### (11.7) Finding Synchronization-Free Parallelism
#### (11.7.1) An Introductory Example
#### (11.7.2) Affine Space Partitions
#### (11.7.3) Space-Partition Constraints
#### (11.7.4) Solving Space-Partition Constraints
#### (11.7.5) A Simple Code-Generation Algorithm
#### (11.7.6) Eliminating Empty Iterations
#### (11.7.7) Eliminating Tests from Innermost Loops
#### (11.7.8) Source-Code Transforms
#### (11.7.9) Exercises for Section 11.7
### (11.8) Synchronization Between Parallel Loops
#### (11.8.1) A Constant Number of Synchronizations
#### (11.8.2) Program-Dependence Graphs
#### (11.8.3) Hierarchical Time
#### (11.8.4) The Parallelization Algorithm
#### (11.8.5) Exercises for Section 11.8
### (11.9) Pipelining
#### (11.9.1) What is Pipelining?
#### (11.9.2) Successive Over-Relaxation (SOR): An Example
#### (11.9.3) Fully Permutable Loops
#### (11.9.4) Pipelining Fully Permutable Loops
#### (11.9.5) General Theory
#### (11.9.6) Time-partition Constraints
#### (11.9.7) Solving Time-Partition Constraints by Farkas' Lemma
#### (11.9.8) Code Transformations
#### (11.9.9) Parallelism with Minimum Synchronization
#### (11.9.10) Exercises for Section 11.9
### (11.10) Locality Optimizations
#### (11.10.1) Temporal Locality of Computed Data
#### (11.10.2) Array Contraction
#### (11.10.3) Partition Interleaving
#### (11.10.4) Putting it All Together
#### (11.10.5) Exercises for Section 11.10
### (11.11) Other Uses of Affine Transforms
#### (11.11.1) Distributed memory machines
#### (11.11.2) Multi-Instruction-Issue Processors
#### (11.11.3) Vector and SIMD Instructions
#### (11.11.4) Prefetching
### (11.12) Summary of Chapter 11
### (11.13) References for Chapter 11
## (12) Interprocedural Analysis
### (12.1) Basic Concepts
#### (12.1.1) Call Graphs
#### (12.1.2) Context Sensitivity
#### (12.1.3) Call Strings
#### (12.1.4) Cloning-Based Context-Sensitive Analysis
#### (12.1.5) Summary-Based Context-Sensitive Analysis
#### (12.1.6) Exercises for Section 12.1
### (12.2) Why Interprocedural Analysis
#### (12.2.1) Virtual Method Invocation
#### (12.2.2) Pointer Alias Analysis
#### (12.2.3) Parallelization
#### (12.2.4) Detection of Software Errors and Vulnerabilities
#### (12.2.5) SQL Injection
#### (12.2.6) Buffer Overflow
### (12.3) A Logical Representation of Data Flow
#### (12.3.1) Introduction to Datalog
#### (12.3.2) Datalog Rules
#### (12.3.3) Intensional and Extensional Predicates
#### (12.3.4) Execution of Datalog Programs
#### (12.3.5) Incremental Evaluation of Datalog Programs
#### (12.3.6) Problematic Datalog Rules
#### (12.3.7) Exercises for Section 12.3
### (12.4) A Simple Pointer-Analysis Algorithm
#### (12.4.1) Why is Pointer Analysis Difficult
#### (12.4.2) A Model for Pointers and References
#### (12.4.3) Flow Insensitivity
#### (12.4.4) The Formulation in Datalog
#### (12.4.5) Using Type Information
#### (12.4.6) Exercises for Section 12.4
### (12.5) Context-Insensitive Interprocedural Analysis
#### (12.5.1) Effects of a Method Invocation
#### (12.5.2) Call Graph Discovery in Datalog
#### (12.5.3) Dynamic Loading and Reection
#### (12.5.4) Exercises for Section 12.5
### (12.6) Context-Sensitive Pointer Analysis
#### (12.6.1) Contexts and Call Strings
#### (12.6.2) Adding Context to Datalog Rules
#### (12.6.3) Additional Observations About Sensitivity
#### (12.6.4) Exercises for Section 12.6
### (12.7) Datalog Implementation by BDD's
#### (12.7.1) Binary Decision Diagrams
#### (12.7.2) Transformations on BDD's
#### (12.7.3) Representing Relations by BDD's
#### (12.7.4) Relational Operations as BDD Operations
#### (12.7.5) Using BDD's for Points-to Analysis
#### (12.7.6) Exercises for Section 12.7
### (12.8) Summary of Chapter 12
### (12.9) References for Chapter 12
## (A) A Complete Front End
### (A.1) The Source Language
### (A.2) Main
### (A.3) Lexical Analyzer
### (A.4) Symbol Tables and Types
### (A.5) Intermediate Code for Expressions
### (A.6) Jumping Code for Boolean Expressions
### (A.7) Intermediate Code for Statements
### (A.8) Parser
### (A.9) Creating the Front End
## (B) Finding Linearly Independent Solutions