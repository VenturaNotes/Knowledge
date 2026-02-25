---
Source:
  - zotero://open-pdf/library/items/TGUR9253?page=1&annotation=MJEPHAEZ
  - https://joshua.smcvt.edu/linearalgebra/
Length: "525"
Progress: "1"
tags:
  - status/incomplete
  - type/textbook
Reviewed: false
---
## Notation
- $\mathbb{R}$: [[Real numbers]], $\mathbb{R^+}$: [[Positive reals]], $\mathbb{R^n}$: [[n-tuples of reals]]
- $\mathbb{N}$: [[Natural Numbers]], {0, 1, 2, ...}, $\mathbb{C}$: [[complex numbers]]
- (a..b): [[open interval]], $[a..b]$: [[Closed Interval]]
- <...>: [[Sequence]] (a list in which order matters)
- $h_{i,j}$: [[row]] i and [[column]] j entry of [[matrix]] H
- $V,W,U$: [[vector space|vector spaces]]
- $\overset\rightarrow{v}$: [[vector]], $\overset\rightarrow{0}$: [[zero vector]], $\overset\rightarrow{0}_V$: zero [[vector of a space]] V
- $\mathcal{P}_n$: [[space of degree n polynomials]], $\mathcal{M}_{n\times m}$: [[n by m matrix]]
- $[S]$: [[span of a set]]
- $\textlangle B, D \textrangle$: [[Basis|basis]], $\overset \rightarrow \beta, \overset\rightarrow \delta$: [[basis vectors]]
- $\mathcal{E}_n$ = $\textlangle \overset\rightarrow e_1, ..., \overset\rightarrow e_n \textrangle$: [[standard basis]] for $\mathbb{R}^n$ 
- $V \cong W$: [[isomorphic spaces]]
- $M \oplus N$: [[direct sum of subspaces]]
- $h,g$: [[homomorphisms]] (linear maps)
- $t,s$: [[Transformation|transformations]] (linear maps from a space to itself)
- $Rep_B{\overset \rightarrow v}$: [[representation of a vector]],  $Rep_{B,D}(h)$: a [[map]]
- $Z_{n \times m}$ or Z: [[zero matrix]], $I_{n \times n}$ or $I$: [[Identity Matrix|identity matrix]]
- |T|: [[determinant]] of the matrix
- $\mathscr{R}(h)$: [[range space]], $\mathscr{N}(h)$: [[null space of the map]]
- $\mathscr{R}_{\infty}(h)$: [[generalized range space]], $\mathscr{N}_{\infty}(h)$: [[generalized null space]]

## “Greek letters” (learn to pronounce in book)

| $\alpha$: [[alpha]]             | $\beta$: [[beta]] | $\gamma$,$\Gamma$: [[gamma]] | $\delta$,$\Delta$: [[delta]] | $\epsilon$: [[epsilon]]            |
| ------------------------------- | ----------------- | ---------------------------- | ---------------------------- | ---------------------------------- |
| $\zeta$: [[zeta]]               | $\eta$: [[eta]]   | $\theta$,$\Theta$: [[theta]] | $\iota$: [[iota]]            | $\kappa$: [[kappa]]                |
| $\lambda$,$\Lambda$: [[lambda]] | $\mu$: [[mu]]     | $\nu$: [[nu]]                | $\xi$,$\Xi$: [[xi]]          | $\omicron$: [[omicron]]            |
| $\pi$,$\Pi$: [[pi]]             | $\rho$: [[rho]]   | $\sigma$,$\Sigma$: [[sigma]] | $\tau$: [[tau]]              | $\upsilon$,$\Upsilon$: [[upsilon]] |
| $\phi$, $\Phi$: [[phi]]         | $\chi$: [[chi]]   | $\psi$,$\Psi$: [[psi]]       | $\omega$,$\Omega$: [[omega]]                             |                                    |
- Capitals shown differ from Roman capitals
- [pdf](zotero://open-pdf/library/items/TGUR9253?page=2&annotation=CP6JEZKT)

## Preface
- “The material is standard in that the subjects covered are [[Gaussian reduction]], [[Vector Space|vector spaces]], [[linear maps]], [[determinants]], and [[eigenvalue|eigenvalues]] and [[eigenvector|eigenvectors]].” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=3&annotation=TAM7ZA8U))
- Preface has some pretty broken english
- “This book is Free. See http://joshua.smcvt.edu/linearalgebra for the license details.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=4&annotation=GUTX2WQ8))
	- “page also has the latest version, exercise answers, beamer slides, lab manual, additional material, and LATEX source.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=4&annotation=C8XVWEZG))
- “This book's emphasis on motivation and development, and its availability, make it widely used for self-study.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=5&annotation=NS4SGUL2))
- “You'll get more from these if you have access to software for calculations such as Sage, freely available from http://sagemath.org.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=5&annotation=NPPHLU9G))
- “Be aware that few people can write correct proofs without training” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=5&annotation=4AX3AW6V))
- ““I understand the material but it is only that I have trouble with the problems” shows a misconception. Being able to do things with the ideas is their entire point.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=6&annotation=DC4F2UNB))
- “But texts have traditionally not given attributions for questions.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=6&annotation=8VZUX4SD))
- “I have marked a good sample with $\checkmark$'s in the margin.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=5&annotation=IITS3PAJ))

## (1) Linear Systems
### (1.1) Solving Linear Systems
- ![[Screenshot 2023-06-08 at 6.54.45 PM.png]]
	- “Both examples come down to solving a system of equations.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=12&annotation=FCN5TQ5L))
		- “equations involve only the first power of each variable.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=12&annotation=BHGPPWQZ))
		- Examples
			- “the [[moment]] of an object is its mass times its distance from the balance point.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=11&annotation=W3ARKAVD))
				- “The first example is from [[Statics]].” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=11&annotation=VAL9AZZA))
			- “trinitrotoluene is better known as [[TNT]]” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=11&annotation=8E97C448))
				- “In what proportion should we mix them?” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=11&annotation=QN82VVM2))
#### (1.1.1) Gauss's Method
##### Definitions and Examples
- [[Gauss's Method]]
	- Definition
		- A [[linear combination]] of $x_1, ..., x_n$ has the form $a_1x_1 + a_2x_2 + ... + a_nx_n$ where the numbers $a_1, ...,a_n$ $\in$ $\mathbb{R}$ are the combination's [[coefficients]].
		- A [[linear equation]] in the variables $x_1, ..., x_n$ has the form $a_1x_1 + a_2x_2 + ... + a_nx_n = d$, where d $\in$ $\mathbb{R}$ is the [[constant]]
		- An [[n-tuple]] $(s_1, s_2,...,s_n) \in \mathbb{R}^n$ is a <mark style="background: #FFF3A3A6;">solution</mark> of, or <mark style="background: #FFF3A3A6;">satisfies</mark>, that equation if substituting the numbers $s_1, ..., s_n$ for the variables gives a true statement $a_1s_1 + a_2s_2 + ... + a_ns_n = d$.
		- A [[system of linear equations]] has the solution $(s_1,s_2,...,s_n)$ if that n-tuple is a solution of all of the equations
			- ![[Screenshot 2023-06-08 at 7.16.19 PM.png]]
- 1.2 Example
	- Linear
		- $3x_1 + 2x_2$ 
	- Nonlinear
		- $3x^2_1 + 2x_2$
		- $3x_1 + 2sin(x_2)$
	- “We usually take x1, . . . , xn to be unequal” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=12&annotation=VMIY77FQ))
	- “sometimes include terms with a zero coefficient” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=12&annotation=WCNS9WYS))
		- Or omit them depending on convenience
- ![[Screenshot 2023-06-08 at 9.18.34 PM.png]]
	- 1.3 Example
		- “Finding the set of all solutions is solving the system.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=13&annotation=F93IKDJA))
			- Algorithm that always works is [[Gauss's Method]]
- ![[Screenshot 2023-06-08 at 9.25.03 PM.png]]
	- 1.4 Example
		- Solution set is {(3, 1, 3)}
		- “Gauss's Method never loses solutions nor does it ever pick up extraneous solutions” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=13&annotation=VHXMR6BH))
- 1.5 Theorem (Gauss's Method)
	- If a linear system is changed to another by one of these operations, then the two systems have the same set of solutions
		- (1) “(1) an equation is swapped with another” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=14&annotation=B5RAYTV6))
			- “disallow swapping a row with itself, to make some results in the fourth chapter easier.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=14&annotation=IX6K3ASE))
		- “(2) an equation has both sides multiplied by a nonzero constant” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=14&annotation=W3UYXC39))
			- Can't multiply a row by 0
		- “(3) an equation is replaced by the sum of itself and a multiple of another” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=14&annotation=AXC44KC2))
			- “adding a multiple of a row to itself is not allowed” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=14&annotation=MZMR4NX3))
	- “equation swap operation” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=14&annotation=SFIB3TP9)) proof
		- Given a linear system, the tuple satisfies the system only if substituting the values for the variables gives a conjunction of true statements. Since we can rearrange the order statements joined with "and" as [[Conjunction|conjunctions]] are commutative [^1], the truth value is preserved of the resulting proposition
- 1.6 Definition ^e4e628
	- Three operations from Theorem 1.5
		- [[Gaussian operations]]
			- (1) Swapping
			- (2) Multiplying by a scalar (or rescaling)
			- (3) row combination
	- “we will abbreviate 'row i' by '$\rho$i'” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=15&annotation=LX5KRPPW))
		- Greek letter [[rho]]
	- “we will denote a row combination operation by kρi + ρj, with the row that changes written second.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=15&annotation=WHVNMESU))
- ![[Screenshot 2023-06-09 at 8.56.05 AM.png]]
	- 1.7 Example of [[Gauss's Method]]
- 1.8 Example
	- Physics problem solved
		- “So c = 4, and back-substitution gives that h = 1.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=15&annotation=V56UYL3K))
- 1.9 Example
	- “point of Gauss's Method is to use the elementary reduction operations to set up [[back-substitution]].” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=16&annotation=AMG8844D))
- 1.10 Definition
	- “In each <mark style="background: #FFF3A3A6;">row</mark> of a system, the first variable with a <mark style="background: #FFF3A3A6;">nonzero coefficient</mark> is the row's [[leading variable]].” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=16&annotation=RXUECHR6))
	- “A system is in [[echelon form]] if each leading variable is to the right of the leading variable in the row above it, except for the leading variable in the first row, and any rows with all-zero coefficients are at the bottom.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=16&annotation=9H4KS475))
- ![[Screenshot 2023-06-09 at 9.02.37 AM.png]]
	- 1.11 Example of [[echelon form]]
		- “Strictly speaking, to solve linear systems we don't need the row rescaling operation.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=17&annotation=C8SLC8WC))
			- Introduced it because of “[[Gauss-Jordan Method]]” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=17&annotation=TJXBYW2F))
				- This is a variation of Gauss's Method
		- All systems shown so far have only one solution. Also they have the same number of equations as unknowns
- ![[Screenshot 2023-06-09 at 9.08.31 AM.png]]
	- 1.12 Example (System has more equations than variables)
		- 0=0 just reflects the redundancy
		- “some linear systems do not have a [[unique solution]]. This can happen in two ways. The first is that a system can fail to have any solution at all.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=17&annotation=APL89IHV))
		- This system is [[consistent]]
- ![[Screenshot 2023-06-09 at 9.10.07 AM.png]]
	- 1.13 Example (no solution)
		- Solution set empty since 0 $\ne$ 2
		- This system is [[inconsistent]]
- ![[Screenshot 2023-06-09 at 9.13.09 AM.png]]
	- 1.14 Example (inconsistent system due to no solution)
		- “inconsistency has to do with the interaction of the left and right sides” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=18&annotation=EAV8QCNH))1.
- ![[Screenshot 2023-06-09 at 9.15.15 AM.png]]
	- 1.15 Example (solution set is infinite)
		- “a 0 = 0 equation is not the signal that a system has many solutions” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=18&annotation=228TDDGB))
- 1.16 Example (0=0)
	- “The absence of a 0 = 0 equation does not keep a system from having many different solutions.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=18&annotation=DHESIPFY))
	- $$ \begin{align*} x + y + z &= 0 \\ y + z &= 0 \end{align*}  $$
		- “any triple whose first component is 0 and whose second component is the negative of the third is a solution” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=18&annotation=AH3WBWUF))
			- This system has infinitely many solutions
				- Although it does have 3 unknowns but 2 equations
	- “the presence of 0 = 0 does not mean that the system must have many solutions.” ([pdf](zotero://open-pdf/library/items/TGUR9253?page=18&annotation=GPH8D598)) ^112812
		- ![[Screenshot 2023-06-09 at 9.55.16 AM.png]]
			- No solution despite it has a 0 = 0 row
- Summary for [[Gauss's Method]]
	- [[No solutions]]
		- If any step shows a contradictory equation
	- [[Unique Solution]]
		- Echelon form without a contradictory solution
		- Each variable is a leading variable in its row
	- [[Many solutions]]
		- Echelon form without a contradictory equation
		- At least one variable not a leading variable (no unique solution)
##### Exercises
- [Solutions](zotero://open-pdf/library/items/RHHYDIAW?page=9&annotation=BKR4CXA6)
- “If a system has a contradictory equation then it has [[no solution]]. Otherwise, if there are any variables that are not leading a row then it has [[Infinitely many solutions|infinitely many solution]]. In the final case, where there is no contradictory equation and every variable leads some row, it has a [[unique solution]].” ([pdf](zotero://open-pdf/library/items/RHHYDIAW?page=9&annotation=66SN6GYS))

#### (1.1.2) Describing the Solution Set
#### (1.1.3) General = Particular + Homogenous
### (1.2) Linear Geometry
#### (1.2.1) Vectors in Space*
#### (1.2.2) Length and Angle Measures
### (1.3) Reduced Echelon Form
#### (1.3.1) Gauss-Jordan Reduction
#### (1.3.2) The Linear Combination Lemma
### (1.4) Topic: Computer Algebra Systems
### (1.5) Topic: Input-Output Analysis
### (1.6) Topic: Accuracy of Computations
### (1.7) Topic: Analyzing Networks
## (2) Vector Spaces
### (2.1) Definition of Vector Space
### (2.1.1) Definition and Examples
### (2.1.2) Subspaces and Spanning Sets
### (2.2) Linear Independence
### (2.2.1) Definition and Examples
### (2.3) Basis and Dimension
#### (2.3.1) Basis
#### (2.3.2) Dimension
#### (2.3.3) Vector Spaces and Linear Systems
#### (2.3.4) Combining Subspaces*
#### (2.4) Topic: Fields
#### (2.5) Topic: Crystals
#### (2.6) Topic: Voting Paradoxes
#### (2.7) Topic: Dimensional Analysis
## (3) Maps Between Spaces
### (3.1) Isomorphisms
#### (3.1.1) Definition and Examples
#### (3.1.2) Dimension Characterizes Isomorphism
### (3.2) Homomorphisms
#### (3.2.1) Definition and Examples
#### (3.2.2) Dimension Characterizes Isomorphism
### (3.3) Computing Linear Maps
#### (3.3.1) Representing Linear Maps with Matrices
#### (3.3.2) Any Matrix Represents a Linear Map
### (3.4) Matrix Operations
#### (3.4.1) Sums and Scalar Products
#### (3.4.2) Matrix Multiplication
#### (3.4.3) Mechanics of Matrix Multiplication
#### (3.4.4) Inverses
### (3.5) Change of Basis
#### (3.5.1) Changing Representations of Vectors
#### (3.5.2) Changing Map Representations
### (3.6) Projection
#### (3.6.1) Orthogonal Projection Into a Line*
#### (3.6.2) Gram-Schmidt Orthogonalization*
#### (3.6.3) Projection Into a Subspace*
### (3.7) Topic: Line of Best Fit
### (3.8) Topic: Geometry of Linear Maps
### (3.9) Topic: Magic Squares
### (3.10) Topic: Markov Chains
### (3.11) Topic: Orthonormal Matrices
## (4) Determinants
### (4.1) Definition
#### (4.1.1) Exploration*
#### (4.1.2) Properties of Determinants
#### (4.1.3) The Permutation Expansion
#### (4.1.4) Determinants Exist*
### (4.2) Geometry of Determinants
#### (4.2.1) Determinants as Size Functions
### (4.3) Laplace's Formula
#### (4.3.1) Laplace's Expansion*
### (4.4) Topic: Cramer's Rule
### (4.5) Topic: Speed of Calculating Determinants
### (4.6) Topic: Chiò's Method
### (4.7) Topic: Projective Geometry
### (4.8) Topic: Computer Graphics

## (5) Similarity
### (5.1) Complex Vector Spaces
#### (5.1.1) Polynomial Factoring and Complex Numbers*
#### (5.1.2) Complex Representations
### (5.2) Similarity
#### (5.2.1) Definition and Examples
#### (5.2.2) Diagonalizability
#### (5.2.3) Eigenvalues and Eigenvectors
### (5.3) Nilpotence
#### (5.3.1) Self-Composition*
#### (5.3.2) Strings*
### (5.4) Jordan Form
#### (5.4.1) Polynomials of Maps and Matrices*
#### (5.4.2) Jordan Canonical Form*
### (5.5) Topic: Method of Powers
### (5.6) Topic: Stable Populations
### (5.7) Topic: Page Ranking
### (5.8) Topic: Linear Recurrences
### (5.9) Topic: Coupled Oscillators
## Appendix
### (A.1) Statements
### (A.2) Quantifiers
### (A.3) Techniques of Proof
### (A.4) Sets, Functions, and Relations
## References
[^1]: https://www.wikiwand.com/en/Commutativity_of_conjunction


