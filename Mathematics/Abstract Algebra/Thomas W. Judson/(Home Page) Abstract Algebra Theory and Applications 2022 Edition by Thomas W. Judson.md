---
Source:
  - zotero://open-pdf/library/items/KAP3IWB2?page=1&annotation=55BI53M7
  - http://abstract.ups.edu/aata/aata.html
Length: "492"
tags:
  - status/incomplete
  - type/textbook
Year: 0202-07-28
Reviewed: false
---
## (0) Preface
- Coding theory and cryptography has grow significantly with the development of computing
- “This text is intended for a one or two-semester undergraduate course in abstract algebra.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=5&annotation=7ZZUC4RM))
- “A chapter dependency chart appears.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=5&annotation=7AJXH287))
- “Though there are no specific prerequisites for a course in abstract algebra,” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=6&annotation=5JPCRKDL))
- “[[Sage]] (sagemath.org) is a free, open source, software system for advanced mathematics, which is ideal for assisting with a study of abstract algebra.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=7&annotation=8YHEK4RJ))
	- Can be used on CoCalc.com
## (1) Preliminaries
- “A basic knowledge of set theory, mathematical induction, equivalence relations, and matrices is a must.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=14&annotation=PJ86T2RG))
- Must be able to read and understand mathematical proofs
### (1.1) A Short Note on Proofs
 - “Although mathematics is often motivated by physical experimentation or by computer simulations, it is made rigorous through the use of logical arguments.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=14&annotation=6YBYUQCJ))
 - “[[axiomatic approach]]; that is, we take a collection of objects S and assume some rules about their structure.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=14&annotation=HHK5UKF5))
	 - These rules are called [[axioms]]
	 - “Using the axioms for S, we wish to derive other information about S by using logical arguments.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=14&annotation=EH6XUP3L))
	 - Axioms must be consistent (not contradict one another)
	 - Demand there can't be too many axioms. If a system of axioms is too restrictive, there will be few examples of the mathematical structure
 - “A [[statement]] in logic or mathematics is an assertion that is either true or false.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=14&annotation=LZP4CQNF))
	- Examples of statements that must be either true or false
		- All cats are black
		- 2 + 3 = 5
		- 2x = 6 exactly when x = 4
		- If $ax^2 + bx + c = 0$ and $a \ne 0$, then
			- $x = \frac{-b \pm \sqrt{b^2  - 4ac}}{2a}$ 
	- Non-Examples
		- 3 + 56 - 13 + 8/2
			- #comment this is just an expression
		- $x^3 - 4x^2 + 5x - 6$
			- #comment this is just an expression again
- “A [[mathematical proof]] is nothing more than a convincing argument about the accuracy of a statement.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=14&annotation=9YC66VHT))
	- Example
		- ““2x = 6 exactly when x = 4” is false by evaluating 2 4 and noting that 6 6= 8, an argument that would satisfy anyone.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=15&annotation=H5UAIVT4))
	- “If more detail than needed is presented in the proof, then the explanation will be either long-winded or poorly written.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=15&annotation=4UGT5UCU))
	- “If too much detail is omitted, then the proof may not be convincing.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=15&annotation=XTEVGJFQ))
	- “keep the audience in mind.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=15&annotation=69B4DKDT))
		- proofs can be addressed to another student, professor or a reader of a text
		- High school students require more detail than graduate students
	- “A good rule of thumb for an argument in an introductory abstract algebra course is that it should be written to convince one’s peers, whether those peers be other students or other readers of the text.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=15&annotation=83QPZTNP))
- “mathematicians are usually interested in more complex statements such as “If p, then q,” where p and q are both statements.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=15&annotation=W3E7557M))
	- A simple statement could be "10/5 = 2"
	- “If certain statements are known or assumed to be true, we wish to know what we can say about other statements.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=15&annotation=QQKBVVDI))
	- `p` is the [[hypothesis]] and `q` is known as the [[conclusion]]
- “statement says nothing about whether or not the hypothesis is true” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=15&annotation=QGGSLEN7))
	- For example in
		- If $ax^2 + bx + c = 0$ and $a \ne 0$, then
			- $x = \frac{-b \pm \sqrt{b^2  - 4ac}}{2a}$ 
		- The hypothesis is $ax^2 + bx + c = 0$ and $a \ne 0$
			- The conclusion is  $x = \frac{-b \pm \sqrt{b^2  - 4ac}}{2a}$ 
	- If the entire statement is true and we can show that  $ax^2 + bx + c = 0$ and $a \ne 0$ is true, then the conclusion must be true!
		- A proof of this statement might simply be a series of equations
		- ![[Screenshot 2024-10-22 at 1.03.02 AM.png|500]]
			- #question I think this is just completing the square but where did the $\pm$ come from?
- “If we can prove a statement true, then that statement is called a [[proposition]].” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=15&annotation=BVHDTNSQ))
- “A proposition of major importance is called a [[theorem]].” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=15&annotation=L2ZSGP57))
- “Sometimes instead of proving a theorem or proposition all at once, we break the proof down into modules; that is, we prove several supporting propositions, which are called [[lemmas]], and use the results of these propositions to prove the main result.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=15&annotation=QL8S6LRD))
- “If we can prove a proposition or a theorem, we will often, with very little effort, be able to derive other related propositions called [[Corollary|corollaries]].” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=15&annotation=CVFAJNIT))
#### (1.1.1) Some Cautions and Suggestions
- Several different strategies for proving propositions
- Difficulties that students may encounter and some of the strategies of proof available to them when studying abstract mathematics
	- “A [[theorem]] cannot be proved by example; however, the standard way to show that a statement is not a theorem is to provide a counterexample.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=P9VA9BMK))
	- “[[Quantifiers]] are important. Words and phrases such as only, for all, for every, and for some possess different meanings.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=HWDXPUFR))
	- “Never assume any [[hypothesis]] that is not explicitly stated in the theorem. You cannot take things for granted.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=8N522PEF))
	- “Suppose you wish to show that an object exists and is unique. First show that there actually is such an object. To show that it is unique, assume that there are two such objects, say r and s, and then show that r = s.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=VFCH9WIG))
	- “Sometimes it is easier to prove the [[contrapositive]] of a statement. Proving the statement “If p, then q” is exactly the same as proving the statement “If not q, then not p.”” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=V26SE6I6))
	- “Although it is usually better to find a [[direct proof]] of a theorem, this task can sometimes be difficult. It may be easier to assume that the theorem that you are trying to prove is false, and to hope that in the course of your argument you are forced to make some statement that cannot possibly be true.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=L8SF3ZL5))
- “one of the main objectives of higher mathematics is proving theorems” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=P2UIIKHZ))
- “[[Theorem|theorems]] are tools that make new and productive applications of mathematics possible.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=A75FLNI5))
### (1.2) Sets and Equivalence Relations
#### (1.2.1) Set Theory
- [[Set Theory]]
- “A [[set]] is a well-defined collection of objects; that is, it is defined in such a manner that we can determine for any given object x whether or not x belongs to the set.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=X6LHT922))
- “objects that belong to a set are called its [[members|elements]] or [[members]].” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=PSI9DR8X))
- “We will denote sets by capital letters, such as A or X” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=MHR8BXUE))
- “if a is an element of the set A, we write a $\in$ A” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=QNJIGJTK))
- “A set is usually specified either by listing all of its elements inside a pair of braces or by stating the property that determines whether or not an object x belongs to the set.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=16&annotation=3RBKLI5J))
	- We might write a set containing elements $x_1, x_2, ..., x_n$ as
		- $X = \{x_1, x_2, ..., x_n\}$ 
	- We might write a set where each x in X satisfies a certain property P
		- $X = \{x: x \text{ satisfies } \cal{P}\}$
- If E is the set of [[even positive integers]], could describe E as 
	- $E = \{2, 4, 6, ...\}$ 
	- $E = \{x : x \text{ is an even integer and } x > 0\}$
- We write 2 $\in$ E to say that 2 is in the set E. 
- We write -3 $\notin$ E to say that -3 is not in the set E
- Important sets to consider
	- ![[Screenshot 2024-10-22 at 1.19.24 AM.png|500]]
		- [[Natural numbers]]
		- [[Integers]]
		- [[Rational numbers]]
		- [[Real numbers]]
		- [[Complex numbers]]
- We can find relations between sets as well as perform operations on sets
	- A is a [[subset]] of B written as $A \subset B$ or $B \supset A$ if every element of A is also an element of B
	- Examples
		- ![[Screenshot 2024-10-22 at 1.21.34 AM.png]]
- Every [[set]] is a [[subset]] of itself
	- B is a [[proper subset]] of a set A if B $\subset$ A but B $\ne$ A.
	- If A not a subset of B, we write $\not\subset$ B
		- {4, 7, 9} $\not \subset$ {2, 4, 5, 8, 9}
- Two sets are [[equal]], written A = B, if we can show that $A \subset B$ and $B \subset A$ 
- A set with no elements in it is called the [[empty set]] and is denoted by $\varnothing$. Empty set is a subset of every set
- To construct new sets out of old sets, we can perform certain [[operation|operations]].
	- [[Union]]: A $\cup$ B of two sets A and B is defined as
		- $A \cup B = \{x : x \in A \text{ or } x \in B\}$
	- [[Intersection]] defined by
		- ![[Screenshot 2024-10-22 at 1.25.40 AM.png]]
	- Example
		- ![[Screenshot 2024-10-22 at 1.25.53 AM.png]]
- Union and intersection of more than two sets
	- ![[Screenshot 2024-10-22 at 1.26.22 AM.png]]
		- For union and intersection respectively of the sets $A_1, ..., A_n$ 
- “When two sets have no elements in common, they are said to be [[disjoint]];” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=17&annotation=NEN35A8B))
	- “For example, if E is the set of even integers and O is the set of odd integers, then E and O are disjoint. Two sets A and B are disjoint exactly when
		- A $\cap$ B = $\varnothing$.” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=17&annotation=ME4AX36X))
- “Sometimes we will work within one fixed set U , called the [[universal set]].” ([pdf](zotero://open-pdf/library/items/KAP3IWB2?page=17&annotation=N68VTMW9))
	- For any set A $\subset$ U, we define the [[complement]] of A, denoted by A', to be the set
		- $A' = \{x : x \in U \text{ and } x \in A\}$
	- We define the [[difference]] of two sets A and B to be 
		- $A \backslash B = A \cap B' = \{x : x \in A \text{ and } x \notin B\}$
##### Example 1.1
- ![[Screenshot 2024-10-22 at 1.33.43 AM.png]]
	- Let $\mathbb{R}$ be the [[universal set]] and suppose the above
	- #question still need to understand above
### (1.3) Reading Questions
### (1.4) Exercises
### (1.5) References and Suggested Readings
### (1.6) Sage
### (1.7) Sage Exercises
## (2) The Integers
### (2.1) Mathematical Induction
### (2.2) The Division Algorithm
### (2.3) Reading Questions
### (2.4) Exercises
### (2.5) Programming Exercises
### (2.6) References and Suggested Readings
### (2.7) Sage
### (2.8) Sage Exercises
## (3) Groups
### (3.1) Integer Equivalence Classes and Symmetries
### (3.2) Definitions and Examples
### (3.3) Subgroups
### (3.4) Reading Questions
### (3.5) Exercises
### (3.6) Additional Exercises: Detecting Errors
### (3.7) References and Suggested Readings
### (3.8) Sage
### (3.9) Sage Exercises
## (4) Cyclic Groups
### (4.1) Cyclic Subgroups
### (4.2) Multiplicative Group of Complex Numbers
### (4.3) The Method of Repeated Squares
### (4.4) Reading Questions
### (4.5) Exercises
### (4.6) Programming Exercises
### (4.7) References and Suggested Readings
### (4.8) Sage
### (4.9) Sage Exercises
## (5) Permutation Groups
### (5.1) Definitions and Notation
### (5.2) Dihedral Groups
### (5.3) Reading Questions
### (5.4) Exercises
### (5.5) Sage
### (5.6) Sage Exercises
## (6) Cosets and Lagrange's Theorem
### (6.1) Cosets
### (6.2) Lagrange's Theorem
### (6.3) Fermat's and Euler's Theorems
### (6.4) Reading Questions
### (6.5) Exercises
### (6.6) Sage
### (6.7) Sage Exercises
## (7) Introduction to Cryptography
### (7.1) Private Key Cryptography
### (7.2) Public Key Cryptography
### (7.3) Reading Questions
### (7.4) Exercises
### (7.5) Additional Exercises: Primality and Factoring
### (7.6) References and Suggested Readings
### (7.7) Sage
### (7.8) Sage Exercises
## (8) Algebraic Coding Theory
### (8.1) Error-Detecting and Correcting Codes
### (8.2) Linear Codes
### (8.3) Parity-Check and Generator Matrices
### (8.4) Efficient Decoding
### (8.5) Reading Questions
### (8.6) Exercises
### (8.7) Programming Exercises
### (8.8) References and Suggested Readings
### (8.9) Sage
### (8.10) Sage Exercises
## (9) Isomorphisms
### (9.1) Definition and Examples
### (9.2) Direct Products
### (9.3) Reading Questions
### (9.4) Exercises
### (9.5) Sage
### (9.6) Sage Exercises
## (10) Normal Subgroups and factor Groups
### (10.1) Factor Groups and Normal Subgroups
### (10.2) The Simplicity of the Alternating Group
### (10.3) Reading Questions
### (10.4) Exercises
### (10.5) Sage
### (10.6) Sage Exercises
## (11) Homomorphisms
### (11.1) Group Homomorphisms
### (11.2) The Isomorphism Theorems
### (11.3) Reading Questions
### (11.4) Exercises
### (11.5) Additional Exercises: Automorphisms
### (11.6) Sage
### (11.7) Sage Exercises

## (12) Matrix Groups and Symmetry
### (12.1) Matrix Groups
### (12.2) Symmetry
### (12.3) Reading Questions
### (12.4) Exercises
### (12.5) References and Suggested Readings
### (12.6) Sage
### (12.7) Sage Exercises
## (13) The Structure of Groups
### (13.1) Finite Abelian Groups
### (13.2)  Solvable Groups
### (13.3) Reading Questions
### (13.4) Exercises
### (13.5) Programming Exercises
### (13.6) References and Suggested Readings
### (13.7) Sage
### (13.8) Sage Exercises
## (14) Group Actions
### (14.1) Groups Acting on Sets
### (14.2) The Class Equation
### (14.3) Burnside's Counting Theorem
### (14.4) Reading Questions
### (14.5) Exercises
### (14.6) Programming Exercises
### (14.7) References and Suggested Reading
### (14.8) Sage
### (14.9) Sage Exercises
## (15) The Sylow Theorems
### (15.1) The Sylow Theorems
### (15.2) Examples and Applications
### (15.3) Reading Questions
### (15.4) Exercises
### (15.5) A Project
### (15.6) References and Suggested Readings
### (15.7) Sage
### (15.8) Sage Exercises
## (16) Rings
### (16.1) Rings
### (16.2) Integral Domains and Fields
### (16.3) Ring Homomorphisms and Ideals
### (16.4) Maximal and Prime Ideals
### (16.5) An Application to Software Design
### (16.6) Reading Questions
### (16.7) Exercises
### (16.8) Programming Exercises
### (16.9) References and Suggested Readings
### (16.10) Sage
### (16.11) Sage Exercises
## (17) Polynomials
### (17.1) Polynomial Rings
### (17.2) The Division Algorithm
### (17.3) Irreducible Polynomials
### (17.4) Reading Questions
### (17.5) Exercises
### (17.6) Additional Exercises: Solving the Cubic and Quartic Equations
### (17.7) Sage
### (17.8) Sage Exercises
## (18) Integral Domains
### (18.1) Fields of Fractions
### (18.2) Factorization in Integral Domains
### (18.3) Reading Questions
### (18.4) Exercises
### (18.5) References and Suggested Readings
### (18.6) Sage
### (18.7) Sage Exercises
## (19) Lattices and Boolean Algebras
### (19.1) Lattices
### (19.2) Boolean Algebras
### (19.3) The Algebra of Electrical Circuits
### (19.4) Reading Questions
### (19.5) Exercises
### (19.6) Programming Exercises
### (19.7) References and Suggested Readings
### (19.8) Sage
### (19.9) Sage Exercises
## (20) Vector Spaces
### (20.1) Definitions and Examples
### (20.2) Subspaces
### (20.3) Linear Independence
### (20.4) Reading Questions
### (20.5) Exercises
### (20.6) References and Suggested Readings
### (20.7) Sage
### (20.8) Sage Exercises
## (21) Fields
### (21.1) Extension Fields
### (21.2)  Splitting Fields
### (21.3)  Geometric Constructions
### (21.4) Reading Questions
### (21.5)  Exercises
### (21.6) References and Suggested Readings
### (21.7)  Sage
### (21.8) Sage Exercises
## (22) Finite fields
### (22.1) Structure of a Finite Field
### (22.2) Polynomial Codes
### (22.3) Reading Questions
### (22.4) Exercises
### (22.5) Additional Exercises: Error Correction for BCH Codes
### (22.6) References and Suggested Readings
### (22.7) Sage
### (22.8) Sage Exercises
## (23) Galois Theory
### (23.1) Field Automorphisms
### (23.2) The Fundamental Theorem
### (23.3) Applications
### (23.4) Reading Questions
### (23.5) Exercises
### (23.6) References and Suggested Readings
### (23.7) Sage
### (23.8) Sage Exercises
## Appendices
## (A) GNU Free Documentation License
## (B) Hints and Answers to Selected Exercises
## (C) Notation
## Back Matter
## Index