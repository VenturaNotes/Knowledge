---
Source:
  - zotero://open-pdf/library/items/3RVKPCZG?page=2&annotation=SGIAWWDC
Length: "1035"
Progress: "0"
tags:
  - status/incomplete
  - type/textbook
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