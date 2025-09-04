---
Source:
  - zotero://open-pdf/library/items/5DLQIXBH?page=1&annotation=II6HK5AA
Length: "428"
Progress: "20"
tags:
  - status/incomplete
  - type/textbook
Reviewed: false
---
## (I) Basic Concepts
### (0) Preliminary
#### (0.1) Conventions
- ([Li and Mehrotra, p. 15](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=15&annotation=3H5N8NL4))
	- $\mathbb{N}$ : The set of natural numbers, i.e., {1, 2, 3, . . .}. 
	- $\mathbb{N}^0$ : $\mathbb{N}$ $\cup$ {0} . 
	- $\mathbb{Z}$ : The set of integers. 
	- $\mathbb{Q}$ : The set of rational numbers. 
	- $\mathbb{R}$ : The set of real numbers.
#### (0.2) Patterns of theorems and proof
- 1) "[[Implication]]" ([Li and Mehrotra, p. 15](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=15&annotation=2WDK29YG))
	- Let $X$ and $Y$ represent mathematical statements
		- If $X$ then $Y$ 
	- In logic, (1) is denoted as $X \rightarrow Y$ 
		- The meaning of (1) is if the mathematical statement $X$ is true or the mathematical condition $X$ holds, then the mathematical statement $Y$ is true
	- To prove this theorem, we must assume $X$ is true and then we need to prove that $Y$ is a "logical" ("informally reasonable") consequence of X. Then we can claim theorem (statement) is correct
- 2) “[[Equivalence]]” ([Li and Mehrotra, p. 15](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=15&annotation=EMR684ZA))
	- Let $X$ and $Y$ be mathematical statements
		- $X$ if and only if $Y$ 
	- The meaning of (2) is
		- (if $X$ then $Y$ ) and (if $Y$ then $X$ ).
	- In logic we denote (2) as $X$ $\iff$ $Y$, which is equivalent to 
		- $(X \implies Y) \land (Y \implies X)$
	- To prove true, prove that "if $X$ then $Y$" and "if $Y$ then $X$" are both true.
		- Textbooks use "iff" or $\iff$ to denote "if and only if"
- 3) “[[Disproving]]” ([Li and Mehrotra, p. 16](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=16&annotation=BYRC6J9B))
	- We can claim $X \rightarrow Y$ Is false if we can find X to be true and Y to be false.
	- Counter Example
		- if $x^2$ > 0 then $x$ > 0 
			- This is incorrect because if we plug-in -1, 
				- $(-1)^2 > 0 = 1 > 0$ (true)
				- $-1 > 0$ (false)
			- Because $Y$ is false where $Y = x >0$ , the theorem is incorrect
- 4) “[[Proof by contradiction|Proving by contradiction]]” ([Li and Mehrotra, p. 16](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=16&annotation=MWC28EQ4))
	- Assume the theorem is wrong
		- Make X true and Y false 
			- this is the only way to make an implication false
	- Now we can show X is false
	- The result will contradict our assumption that X is true meaning that our theorem is correct because the assumption will never happen
	- Example
		- ![[Screenshot 2023-01-02 at 5.35.18 PM.png]]
- “[[Proof by Exhaustion|Proving by cases]]:” ([Li and Mehrotra, p. 16](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=16&annotation=6GB8ELRP))
	- “If possible, we exhaust all of the examples in the domain to see if the theorem is correct.” ([Li and Mehrotra, p. 16](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=16&annotation=BIR3BTGX))
		- “we are not able to do so because the domain is usually an infinite set, and even worse, the domain can be [[uncountable]], e.g., real numbers.” ([Li and Mehrotra, p. 16](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=16&annotation=YDT93ALG)) ^9mceqq
	- “we divide the domain into several categories and make sure that those categories cover the domain.” ([Li and Mehrotra, p. 16](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=16&annotation=RZQF7C8T))
	- “If the theorem holds in every case, then the theorem is correct in the entire domain.” ([Li and Mehrotra, p. 16](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=16&annotation=VKN3TTQA))
	- “must use the idea of [[universal generalization]] in the proof of each case.” ([Li and Mehrotra, p. 16](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=16&annotation=YFT4BUKN))



### (1) Sets
#### (1.1) Definitions and Basic Theorems
- “For example, all students of Syracuse University is a set; all students in the United State of America is a superset of the set of students at Syracuse University. Since Dennis is a student at Syracuse University, he is a member of the set of the students of Syracuse university.” ([Li and Mehrotra, p. 19](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=19&annotation=Q5IN58GX))

- “purpose of this chapter is to let the reader be used to rigorous mathematical arguments by getting through the proofs step by step.” ([Li and Mehrotra, p. 19](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=19&annotation=CDQVMYF5)) 
##### (1.1.1) Definitions
- “Definition 1.1:” ([Li and Mehrotra, p. 19](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=19&annotation=UUQ4E8WE))
	- A set S is a collection of distinct objects without regard to the order of the objects given by any possible method of description. Usually, we use a pair of braces, {}, to enclose the concerned collection.
- “Definition 1.2” ([Li and Mehrotra, p. 19](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=19&annotation=U7XZ7Q3Y))
	- The [[empty set]] is a null collection, denoted as ∅ or {}.
- “Definition 1.3” ([Li and Mehrotra, p. 19](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=19&annotation=M4DVMM6P))
	- The [[universal set]] is the set that contains everything concerned, usually denoted as U. In general, the context of the problem determines U.
- “Definition 1.4” ([Li and Mehrotra, p. 19](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=19&annotation=JL3KJN5T))
	- The objects in a set S are called the [[members]] of S. Some textbooks use elements instead.
- “Definition 1.5” ([Li and Mehrotra, p. 19](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=19&annotation=WDHUPASF))
	- Suppose `a` is a member of a set `S`. we denote this property as a $\in$ S. The property is known as the [[Membership Relation|membership relation]]
- “Definition 1.6” ([Li and Mehrotra, p. 20](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=20&annotation=QDVA9NNC))
	- Let A, B be sets. A is a [[subset]] of B if and only if all members of A are members of B. We use A $\subseteq$ B to denote that A is a subset of B. If A $\neq$ B, we say that A is a [[proper subset]] of B, denoted as A $\subset$ B. 
- “Definition 1.7” ([Li and Mehrotra, p. 20](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=20&annotation=BTQWY8WC))
	- Let A, B be sets. The [[intersection]] of A and B, denoted as A$\cap$B, is the set C such that every member of C is a member of both A and B. In logic this set is defined as $$A\cap B = \{x|x \in A \text{ \& } x \in B\}.$$
- “Definition 1.8” ([Li and Mehrotra, p. 20](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=20&annotation=8L9DSTYS))
	- Let A, B be sets. If $A \cap B = \varnothing$, we say that A and B are [[disjoint]]
- “Definition 1.9” ([Li and Mehrotra, p. 20](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=20&annotation=KB3BUTLQ))
	- Let A, B be sets. The [[union]] of A and B, denoted as A $\cup$ B, is the set C such that every member of C is a member of either A or B. In logic this set is defined as $$A \cup B = \{x|x \in A \text{ or } x \in B \}$$
- “Definition 1.10” ([Li and Mehrotra, p. 20](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=20&annotation=48JYJRGD)) ^50uda4
	- Let A, B be sets. The set A - B is defined as $$A - B = \{x|x \in A \text{ \& } x \notin B\}.$$
	- [[Difference of sets|Set Difference]]
- “Definition 1.11” ([Li and Mehrotra, p. 20](zotero://select/library/items/YGR6ZHJ5)) ([pdf](zotero://open-pdf/library/items/5DLQIXBH?page=20&annotation=KJADSVZK))
	- Let A, B be sets. The [[Cartesian product]] of A and B, denoted as A x B, is defined as $$A \times B = \{(a,b)| \in A \text{ \& } b \in B\}.$$
- Definition 1.12
	- Let S be any set, the [[Cardinality]] of S, denoted as |S|, is the number of elements in $S^1$
		- This is a naive definition
		- Intuitively understandable for finite sets
		- More serious mathematical setup needed to understand cardinality of an infinite set (but beyond scope of book)
- Definition 1.13 ^mlxap7
	- Let U be the [[universal set]] and A any set in the universe
		- Define $\overline {A} = U -A$
			- $\overline {A}$ is called the [[complement]] of A
- Definition 1.14
	- The [[Venn diagram]] consists of figures that show the relations between sets
		- ![[Screenshot 2023-07-10 at 12.42.44 PM.png|300]]
- Definition 1.15 ^w7ps6y
	- Let A be any set. The [[power set]] of A, denoted as Pr(A), is the set of all possible subsets of A. In symbols
		- $Pr(A) = \{S|S \subseteq A\}$
##### (1.1.2) Basic Theorems
- Theorem 1.1 ^rxa786
	- Let A be a set
		- $A \cup \varnothing = A$ 
			- Any set union with empty set will give original set
		- $A \cap \theta = \theta$
			- Any set intersected with empty set will give empty set
	- 
- Theorem 1.2
	- Let A be a set
		- $A \cup A = A \cap A = A$
- Theorem 1.3 ^r9rkbt
	- Let A, B be sets
		- A = B iff $(A \subseteq B \text{ \& } B \subseteq A)$
			- [[Set Equality]]
- Theorem 1.4
	- Let A, B, C be sets
		- If $(A \subseteq B \text{ \& } B \subseteq C)$, then A $\subseteq C$

#### (1.2) Problems
#### (1.3) Solutions
### (2) Logic
#### (2.1) Definitions
##### (2.1.1) Propositional Logic
##### (2.1.2) Predicate Logic
##### (2.1.3) Predicates and Sets
#### (2.2) Logical Proof
##### (2.2.1) Laws of Logic
##### (2.2.2) Rules of Inference
##### (2.2.3) Inference Rules for Quantified Predicates
#### (2.3) DNF and CNF
##### (2.3.1) The DNF of a given wff
##### (2.3.2) The CNF of a given wff
##### (2.3.3) A shortcut to find the DNF and CNF
#### (2.4) Problem
#### (2.5) Solutions
### (3) Mathematical Induction
#### (3.1) Concepts
##### (3.1.1) Necessary Conditions of Using Mathematical Induction
##### (3.1.2) The Underlying Theory of Mathematical Induction
##### (3.1.3) Mathematical Induction of the First form (Weak Induction)
##### (3.1.4) Mathematical Induction of the Second Form (Strong Induction)
#### (3.2) Mathematical Induction and Recursive Definition
##### (3.2.1) Recursive Definitions for Functions
##### (3.2.2) Recursive Definitions for Sets and Structural Induction
#### (3.3) Nested Induction
##### (3.3.1) The underlying logic of nested induction
#### (3.4) Problems
#### (3.5) Solutions
### (4) Relations
#### (4.1) Definitions, Theorems, and Comments
##### (4.1.1) Definitions
##### (4.1.2) Theorems
#### (4.2) Problems
#### (4.3) Solutions
### (5) Functions
#### (5.1) Definitions, Theorems, and Comments
##### (5.1.1) Definitions
##### (5.1.2) Theorems
#### (5.2) The Pigeonhole Principle
#### (5.3) Asymptotic Notations
#### (5.4) Problems
#### (5.5) Solutions
## (II) Specific Topics
### (6) Integers
#### (6.1) Floor and Ceiling Functions
#### (6.2) Divisibility
#### (6.3) Greatest Common Divisor
#### (6.4) Congruence
#### (6.5) Solving Linear Congruence Equations
#### (6.6) Solving Linear Congruence Equations with multiple variables
#### (6.7) Applications
##### (6.7.1) Chinese Remainder Theorem
##### (6.7.2) Fermat's Little Theorem and Euler's Theorem
##### (6.7.3) RSA Cryptosystem
#### (6.8) Problems
#### (6.9) Solutions
### (7) Binomial Theorem and Counting
#### (7.1) The Binomial Theorem
#### (7.2) Principles and Typical Problems for Counting
##### (7.2.1) Urns and Balls Models
##### (7.2.2) Summary
#### (7.3) Problems
#### (7.4) Solutions
### (8) Recurrence Relations and Generating Functions
#### (8.1) Recurrence Relations
##### (8.1.1) Definitions
#### (8.2) Solving Recurrence Relations
##### (8.2.1) Repeated Substitution Method
##### (8.2.2) Characteristic Root Method
##### (8.2.3) Generating Function Method
##### (8.2.4) An Example
#### (8.3) Problems
#### (8.4) Solutions
### (9) Discrete Probability
#### (9.1) Definitions and Terminologies
##### (9.1.1) Examples and Discussion
#### (9.2) Theorems of Probability
#### (9.3) Problems
#### (9.4) Solutions
## (III) Appendices
### (A) Loop Invariance
### (B) Sample Quizzes