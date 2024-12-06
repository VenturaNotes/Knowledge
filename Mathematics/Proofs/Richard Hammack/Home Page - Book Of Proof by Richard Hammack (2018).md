---
Source:
  - zotero://open-pdf/library/items/A2RTCHQH?page=1&annotation=NFH9HRCB
Length: "380"
Progress: "19"
tags:
  - status/incomplete
  - type/textbook
  - temp
---
## Personal Notes
- Solutions given to odd exercises
- Version I have has been updated since [June 14, 2022](https://www.people.vcu.edu/~rhammack/BookOfProof/) for 3.3 edition
## Preface
- “In this third edition, Chapter 3 (on counting) has been expanded, and a new chapter on calculus proofs has been added.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=7&annotation=CYQZJB94))
## Introduction
- “a book about how to prove theorems.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=8&annotation=8ZSJQSI8))
- “Chapters 1 and 2 lay out the language and conventions used in all advanced mathematics.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=9&annotation=LFICPNAZ))
- “Upon mastering this material you will be ready for advanced mathematics courses such as abstract algebra, analysis, topology, combinatorics and theory of computation.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=9&annotation=69BCRHLK))

## (I) Fundamentals
### (1) Sets
#### (1.1) Introduction to Sets
- “A set is a collection of things.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=15&annotation=H57T9IE2))
- “The things are called elements of the set.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=15&annotation=ZQ95BTVS))
- “concerned with sets whose elements are mathematical entities, such as numbers, points, functions, etc.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=15&annotation=39DVFDFT))
- “A set is called an [[infinite set]] if it has infinitely many elements; otherwise it is called a [[finite set]].” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=15&annotation=34SYFCSX))
- ![[Pasted image 20230129225000.png]]
	- This is true because “dots indicate a pattern of numbers that continues forever” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=15&annotation=QFYPU4H2))
- “We often let uppercase letters stand for sets.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=15&annotation=C3W4CWHX))
- Ways to read this: $2 \in A$
	- 2 is an element of A
	- 2 is in A
	- 2 in A
- Ways to read this: $5 \notin A$ 
	- 5 is not an element of A
	- 5 not in A
- “Expressions like 6,2 ∈ A or 2,4,8 ∈ A are used to indicate that several things are in a set.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=15&annotation=NRGVLRW2))
- “The set of natural numbers (i.e., the positive whole numbers) is denoted by $\mathbb{N}$,” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=16&annotation=KJ94BAZS))
	- ![[Pasted image 20230129225316.png]]
- Set of Integers
	- ![[Pasted image 20230129225338.png]]
- Set of all real numbers $\mathbb{R}$ 
- “Sets need not have just numbers as elements.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=16&annotation=Y37EI4ZE))
	- B = {T, F}
		- Represents True and False values
		- Cardinality/size = 2
	- C = {a ,e, i o, u}
		- Consists of lowercase vowels in the English alphabet
		- Cardinality/size = 5
	- “D = {(0,0),(1,0),(0,1),(1,1) }” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=16&annotation=6WFHNUHJ))
		- “elements the four corner points of a square on the x-y coordinate plane.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=16&annotation=NRWR5258))
		- Cardinality/size = 4
- “It is even possible for a set to have other sets as elements.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=16&annotation=HJX7HPLP))
	- “Consider E = {1,{2,3},{2,4}}, which has three elements: the number 1, the set {2,3} and the set {2,4}. Thus 1 ∈ E and {2,3} ∈ E and {2,4 } ∈ E. But note that 2 ∉ E, 3 ∉ E and 4 ∉ E.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=16&annotation=LN79X93B))
- A set can contain three two-by-two matrices
	- ![[Pasted image 20230129225642.png]]
	- “Letters can serve as symbols denoting a set’s elements:” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=16&annotation=5M7LPJCE))
		- ![[Pasted image 20230129225738.png]]
- “If X is a finite set, its [[Cardinality]] or size is the number of elements it has, and this number is denoted as |X|.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=16&annotation=PCPYPMH5))
- [[Empty Set]]
	- “The empty set is the only set whose cardinality is zero.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=16&annotation=DYYFW4C6))
	- $\varnothing$ = {}
	- |$\varnothing$| = 0
	- Remember that {$\varnothing$} $\neq$ $\varnothing$ 
		- | {$\varnothing$} | = 1
		- Think of the empty set as an empty box. The box has nothing in it. “By contrast, {$\varnothing$} is a box with an empty box inside it.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=16&annotation=EAFZ7IH9))
- G = {$\mathbb{N}$, $\mathbb{Z}$ } has a cardinality of 2
- F = {$\varnothing$,{$\varnothing$}, {{$\varnothing$}} }, has 3 elements meaning a cardinality of 3.
- “A special notation called set-builder notation is used to describe sets that are too big or complex to list between braces.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=17&annotation=E46YADPW))
- E = {2n : n $\in$ $\mathbb{Z}$} (this describes the infinite set of even integers)
	- {
		- The set of all things of form
	- :
		- such that
	- <mark style="background: #FFF3A3A6;">Reads as</mark>
		- “E equals the set of all things of form 2n, such that n is an element of $\mathbb{Z}$.”” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=17&annotation=TYZJINMI))
	- “The idea is that E consists of all possible values of 2n, where n takes on all values in $\mathbb{Z}$.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=17&annotation=MMMX89VZ))
	- General Syntax
		- X = {expression : rule}
		- “The idea is that E consists of all possible values of 2n, where n takes on all values in Z.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=17&annotation=MMMX89VZ))
	- “Some writers use a bar instead of a colon; for example,” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=17&annotation=ZJ3EWYAU))
		- E = {n $\in$ $\mathbb{Z}$ | n is even}
			- <mark style="background: #FFF3A3A6;">Reads as</mark>
			- “E is the set of all n in $\mathbb{Z}$ such that n is even.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=17&annotation=9GJRSJSW))
##### Example 1.1
- List of examples for set 
	- ![[Pasted image 20230129231433.png]]
- <mark style="background: #FFF3A3A6;">Conflict of notation</mark>
	- {x $\in$ $\mathbb{Z}$ : |x| < 4}
		- Because x $\in$ $\mathbb{Z}$, x is a number so the bars in |x| must mean absolute value
	- Given "A = {{1,2},{3,4,5,6 },{7}} and B = {X ∈ A : |X| < 3}.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=18&annotation=QNCUYWGQ))
		- Elements of A are sets so |X| in the expression must mean cardinality.

##### Example 1.2
- ![[Pasted image 20230130134214.png]]
- The author is not exactly writing a proof but pretty much showing why set A = $\mathbb{Z}$. We know that "7a + 3b" is an integer, so A will contain only integers. To find which integer, we let n represent any integer and set it equal to that equation where a=n and b=-2n. The values found for "a" and "b" are arbitrary but they do need to make "n = 7n + 3(-2n)" true. Because the equation is true, we know that any integer is a subset of A. Since any integer is a subset of A and that's the definition of $\mathbb{Z}$, we know that A = $\mathbb{Z}$. 

##### Special Sets
- “The empty set: $\varnothing$ = {}” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=18&annotation=UCBQ8Q2Y))
- “The natural numbers: $\mathbb{N}$ = {1,2,3,4,5, . . . }” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=18&annotation=QLUH5WQ3))
- “The integers: $\mathbb{Z}$ = { . . . , −3, −2, −1,0,1,2,3,4,5, . . . }” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=18&annotation=NEHFXCMZ))
- “The rational numbers: Q = { x : x= $\frac mn$ , where m, n ∈ Z and n $\neq$ 0 }” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=18&annotation=SMABMSQL))
	- You don't need to write $n \neq$ 0 if you write it [[(2) Lecture 1(A) - Sets and n-tuples#^6e3672|this way]]
- “• The real numbers: R” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=18&annotation=EM44YBHX)) “We visualize the set R of real numbers as an infinitely long number line.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=18&annotation=7AN3IABD))
	- ![[Pasted image 20230130135009.png]]

##### Intervals
- “Graphically, they are represented by a darkened segment on the number line between a and b. A solid circle at an endpoint indicates that that number is included in the interval. A hollow circle indicates a point that is not included in the interval.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=18&annotation=C4A2FHW3))
- ![[Pasted image 20230130184157.png]]
	- [[Closed Interval]]
	- [[Open Interval]]
	- [[Half-open interval]]
	- [[Infinite interval]]
- “It is an unfortunate notational accident that (a, b) can denote both an open interval on the line and a point on the plane.” ([pdf](zotero://open-pdf/library/items/A2RTCHQH?page=19&annotation=CDUJLAU6))
##### Exercises

#### (1.2) The Cartesian Product
#### (1.3) Subsets
#### (1.4) Power Sets
#### (1.5) Union, Intersection, Difference
#### (1.6) Complement
#### (1.7) Venn Diagrams
#### (1.8) Indexed Sets

#### (1.9) Sets That Are Number Systems
#### (1.10) Russell's Paradox
### (2) Logic
#### (2.1) Statements
#### (2.2) And, Or, Not
#### (2.3) Conditional Statements
#### (2.4) Biconditional Statements
#### (2.5) Truth Tables for Statements
#### (2.6) Logical Equivalence
#### (2.7) Quantifiers
#### (2.8) More on Conditional Statements
#### (2.9) Translating English to Symbolic Logic
#### (2.10) Negating Statements
#### (2.11) Logical Inference
#### (2.12) An Important Note
### (3) Counting
#### (3.1) Lists
#### (3.2) The Multiplication Principle
#### (3.3) The Addition and Subtraction Principles
#### (3.4) Factorials and Permutations
#### (3.5) Counting Subsets
#### (3.6) Pascal's Triangle and the Binomial Theorem
#### (3.7) The Inclusion-Exclusion Principle
#### (3.8) Counting Multisets
#### (3.9) The Division and Pigeonhole Principles
#### (3.10) Combinatorial Proof
## II How to Prove Conditional Statements
### (4) Direct Proof
#### (4.1) Theorems
#### (4.2) Definitions
#### (4.3) Direct Proof
#### (4.4) Using Cases
#### (4.5) Treating Similar Cases
### (5) Contrapositive Proof
#### (5.1) Contrapositive Proof
#### (5.2) Congruence of Integers
#### (5.3) Mathematical Writing
### (6) Proof by Contradiction
#### (6.1) Proving Statements with Contradiction
#### (6.2) Proving Conditional Statements by Contradiction
#### (6.3) Combining Techniques
#### (6.4) Some Words of Advice
## (III) More on Proof
### (7) Proving Non-Conditional Statements
#### (7.1) If-and-Only-If Proof
#### (7.2) Equivalent Statements
#### (7.3) Existence Proofs; Existence and Uniqueness Proofs
#### (7.4) Constructive Versus Non-Constructive Proofs
### (8) Proofs Involving Sets
#### (8.1) How to Prove a in A
#### (8.2) How to Prove A subset B
#### (8.3) How to Prove A = B
#### (8.4) Examples: Perfect Numbers
### (9) Disproof
#### (9.1) Counterexamples
#### (9.2) Disproving Existence Statements
#### (9.3) Disproof by Contradiction
### (10) Mathematical Induction
#### (10.1) Proof by Induction
#### (10.2) Proof by Strong Induction
#### (10.3) Proof by Smallest Counterexample
#### (10.4) The Fundamental Theorem of Arithmetic
#### (10.5) Fibonacci Numbers
## (IV) Relations, Functions and Cardinality
### (11) Relations
#### (11.1) Relations
#### (11.2) Properties of Relations
#### (11.3) Equivalence of Relations
#### (11.4) Equivalence Classes and Partitions
#### (11.5) The Integers Modulo n
#### (11.6) Relations Between Sets
### (12) Functions
#### (12.1) Functions
#### (12.2) Injective and Surjective Functions
#### (12.3) The Pigeonhole Principle Revisited
#### (12.4) Composition
#### (12.5) Inverse Functions
#### (12.6) Image and Preimage
### (13) Proofs in Calculus
#### (13.1) The Triangle Inequality
#### (13.2) Definition of a Limit
#### (13.3) Limits That Do Not Exist
#### (13.4) Limit Laws
#### (13.5) Continuity and Derivatives
#### (13.6) Limits at Infinity
#### (13.7) Sequences
#### (13.8) Series
### (14) Cardinality of Sets
#### (14.1) Sets with Equal Cardinalities
#### (14.2) Countable and Uncountable Sets
#### (14.3) Comparing Cardinalities
#### (14.4) The Cantor-Bernstein-Schröder Theorem
## Conclusion
## Solutions
