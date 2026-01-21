---
Source:
  - https://www.sanfoundry.com/1000-discrete-mathematics-questions-answers/#foundation-logics-proofs
Length: "1000"
tags:
  - status/incomplete
  - type/website
Reviewed: false
---
## (1) The Foundation: Logics and Proofs
### (Complete) (1.1) Propositions
- (1) Which of the following statement is a proposition?
	- "The only odd prime number is 2" is a [[proposition]] because this statement has a truth value which is false
- (2) The truth value of "4+3 = 7 or 5 is not prime"
	- True. This is a [[compound statement]] with 'or'. It's true when either statement is true. Since the first statement is true, the compound is true. 
- (3) Which of the following option is true?
	- "If the Sun is a planet, elephants will fly" is true. Since the hypothesis is false, the whole statement is true
	- #comment The solution "3+2 = 8 if 5-2 =7" seems true to me as well but this might just be an [exam error](https://www.reddit.com/r/learnmath/comments/1fmoa7m/im_just_starting_to_learn_discrete_maths_and_this/)
- (4) What is the value of x after this statement, assuming the initial value of x is 5? 'If x = 1, then x = x+2 else x = 0'
	- The value of x = 0. This is because the initial value is 5 and since 5 $\ne$ 1, then x = 0.
- (5) Let P: I am in Bangalore.; Q: I love cricket.; then q $\to$ p (q implies p) is ?
	- If I love cricket, then I am in Bangalore
		- Q is [[hypothesis]] and P is [[conclusion]] in this case
- (6) Let P: If Sahil bowls, Saurabh hits a century.; Q: If Raju bowls, Sahil gets out on first ball. Now if P is true and Q is false then which of the following can be true?
	- Sahil bowled and Saurabh hits a century
		- #comment 
			- This is because the following statements can be true
				- Sahil bowls
				- Saurabh hits a century
				- Raju bowls
			- This statement will always be false since Q is false and the only way for an implication to be false is if hypothesis is True and conclusion is false.
				- Sahil gets out on first ball
- (7) The truth value '9 is prime then 3 is even'.
	- True. First part of statement is false so implication will always be true.
- (8) Let P: I am in Delhi.; Q: Delhi is clean.; then q $\land$ p(q and p) is?
	- Delhi is clean and I am in Delhi
		- The connector is 'and'
- (9) Let P: This is a great website, Q: You should not come back here. Then 'This is a great website and you should come back here.' is best represented by?
	- $P \land \lnot Q$ 
- (10) Let P: We should be honest., Q: We should be dedicated., R: We should be overconfident. Then 'We should be honest or dedicated but not overconfident'. is best represented by?
	- $P \lor Q \land \lnot R$  
### (1.2) Logic and Bit Operations
- (1) Which of the following bits is the [[negation]] of the bits “010110”?
	- 101001
		-  Flip each of the bit to get the negation of the required string.
- (2) Which of the following option is suitable, if A is “10110110”, B is”11100000” and C is”10100000”?
	- $C = A$ and $B$
		- Output of `and` is 1 when both other inputs are one


### (1.3) Implications and Double Implications
### (1.4) Logic Circuits
### (1.5) De-Morgan's Laws
### (1.6) Tautologies and Contradictions
### (1.7) Types of Statements
- (1) The [[contrapositive]] of $p \to q$ is the proposition
	- $\lnot q \to \lnot p$ 
- (2) The [[inverse]] of $p \to q$ is the proposition
	- $\lnot p \to \lnot q$
- (3) The [[converse]] of $p \to q$ is the proposition
	- $q \to p$ 
- (4) What is the contrapositive of the conditional statement? “The home team misses whenever it is drizzling?”
	- "If the home team wins, then it is not drizziling"
		- #comment This does not seem to be the answer because the negation of misses is not wins. The negation of misses is just not missing. Just because they don't miss does not mean they win
	- #comment
		- Q whenever P so contrapositive is $\lnot q \to \lnot p$ 
		- Propositions
			- P = It is drizzling
			- Q = The home team misses
		- If it is drizzling, the home team misses
- (5) What is the [[converse]] of the conditional statement “If it ices today, I will play ice hockey tomorrow.”
	- I will play ice hockey tomorrow only if it ices today
- (6) What are the [[contrapositive]] of the conditional statement “I come to class whenever there is going to be a test.”
	-  “If I do not come to class, then there will not be a test.”
- (7) What are the [[inverse]] of the conditional statement “ A positive integer is a composite only if it has divisors other than 1 and itself.”
	- “If a positive integer is not composite, then it has no divisors other than 1 and itself.”
- (8) What are the [[converse]] of the conditional statement “When Raj stay up late, it is necessary that Raj sleep until noon.”
	- "If Raj sleep until noon, then Raj stay up late"
	- #comment 
		- Examples
			- "When Raj stay up late, it is necessary that Raj sleep until noon"
				- Rephrased: When Raj stay up late, it is a necessary condition that Raj sleep until noon
				- Therefore $P \to Q$ in this case
				- So since the converse is $Q \to P$, we just flip it around
			- Q is necessary for P

### (1.8) Logical Equivalences
### (1.9) Predicate Logic Quantifiers
### (1.10) Nested Quantifiers
### (1.11) Inference
### (1.12) Types of Proofs
## (2) Basic Structures: Sets, Functions, Sequences, Sums and Matrices
### (2.1) Types of Set
### (2.2) Sets
### (2.3) Set Operations - 1
### (2.4) Set Operations - 2
### (2.5) Venn Diagram
### (2.6) Algebraic Laws on Sets
### (2.7) Cartesian Product of Sets
### (2.8) Subsets
### (2.9) Functions
### (2.10) The Growth of Functions
### (2.11) Domain and Range of Functions
### (2.12) Number of Functions
### (2.13) Floor and Ceiling Function
### (2.14) Inverse of a Function
### (2.15) Arithmetic Sequences
### (2.16) Geometric Sequences
### (2.17) Arithmetic and Geometric Mean
### (2.18) Special Sequences
### (2.19) Harmonic Sequences
### (2.20) Cardinality of Sets
### (2.21) Types of Matrices
### (2.22) Operations on Matrices
### (2.23) Properties of Matrices
### (2.24) Transpose of Matrices
### (2.25) Inverse of Matrices
### (2.26) Sequences and Summations

## (3) Algorithms
### (3.1) Algorithms
### (3.2) Types of Algorithms
### (3.3) Complexity of Algorithms - 1
### (3.4) Complexity of Algorithms - 2
### (3.5) Integers and Algorithms
### (3.6) The Integers and Division
## (4) Number Theory and Cryptography
### (4.1) Prime Numbers
### (4.2) Quadratic Residue and Pseudo Prime
### (4.3) Least Common Multiples
### (4.4) Highest Common Factors
### (4.5) Base Conversion
### (4.6) Complement of a Number
### (4.7) Rules of Exponents
### (4.8) Applications of Number Theory
### (4.9) Primes and Greatest Common Divisors
### (4.10) Modular Exponentiation
### (4.11) Cryptography-Encryption
### (4.12) Cryptography-Decryption
### (4.13) Ciphers
## (5) Induction and Recursion
### (5.1) Principle of Mathematical Induction
### (5.2) Strong Induction and Well Ordering
### (5.3) Recursion
## (6) Counting
### (6.1) Fundamental Principle of Counting
### (6.2) Pigeonhole Principle
### (6.3) Linear Permutation
### (6.4) Circular Permutations
### (6.5) Combinations
### (6.6) Number and Sum of Divisors
### (6.7) Division of Objects
### (6.8) Number of Solution of Equations
### (6.9) Derangements
### (6.10) Terms in Binomial Expansion
### (6.11) Binomial Coefficient
### (6.12) Recurrence Relation

## (7) Discrete Probability
### (7.1) Addition Theorem on Probability
### (7.2) Multiplication Theorem on Probability
### (7.3) Geometric Probability
### (7.4) Probability Distribution
### (7.5) Mean and Variance of Random Variables
### (7.6) Bayes Theorem
### (7.7) Generating Functions
### (7.8) Principle of Inclusion Exclusion
### (7.9) Logarithmic Series
### (7.10) Power Series
## (8) Relations
### (8.1) Number of Relations
### (8.2) Closure on Relations
### (8.3) Types of Relations
### (8.4) Partial Orderings
### (8.5) Equivalence Classes and Partitions
## (9) Graphs
### (9.1) Diagraph
### (9.2) Hasse Diagrams
### (9.3) Lattices
### (9.4) Bipartite Graphs
### (9.5) Graphs Properties
### (9.6) Complete and Connected Graphs
### (9.7) Isomorphism in Graphs
### (9.8) Different Path in a Graph
### (9.9) Planarity, Degree and Coloring of Graph
### (9.10) Graph's Matrices
## (10) Trees
### (10.1) Properties of Tree
### (10.2) Cycles
### (10.3) Tree Traversal
### (10.4) Interconversion for Prefix, Postfix & Infix Notations
### (10.5) Spanning Trees
## (11) Boolean Algebra and Modeling Computations
### (11.1) Boolean Algebra
### (11.2) Boolean Functions
### (11.3) Minimization of Boolean Functions
### (11.4) Karnaugh Maps
### (11.5) Interconversion of Gates
### (11.6) Prime Implicants and Essentials
### (11.7) Finite-State Automation
## (12) Groups
### (12.1) Group Theory
### (12.2) Group Axioms
### (12.3) Closure and Associativity
### (12.4) Existence of Identity & Inverse
### (12.5) Subgroups
### (12.6) Cosets
### (12.7) Cyclic Groups
### (12.8) Permutation Groups
### (12.9) Burnside Theorem