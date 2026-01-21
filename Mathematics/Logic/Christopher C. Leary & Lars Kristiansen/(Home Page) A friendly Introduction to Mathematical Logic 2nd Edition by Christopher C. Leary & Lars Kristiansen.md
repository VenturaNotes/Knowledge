---
Source:
  - zotero://open-pdf/library/items/JDN9H7UE?page=1&annotation=E8GII6XE
Length: "380"
Progress: "10"
tags:
  - status/incomplete
  - type/textbook
Reviewed: false
---
## Preface
- “start right in on the predicate logic, without discussing propositional logic first.” ([Leary, 2015, p. 10](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=10&annotation=8VAYTQ4D))
	- [[Propositional Logic]] vs [[Predicate Logic]] [^1]
		- Propositional Logic (aka boolean logic)
			- "deals with a collection of declarative statements which have a truth value, true or false." 
			- Examples
				- The sun rises in the west.
				- If x is real, then $x^2$ < 0
		- [[Predicate Logic]]
			- "an expression consisting of variables with a specified domain. It consists of objects, relations and functions between the objects. A quantified predicate is a proposition , that is, when you assign values to a predicate with variables it can be made a proposition."
			- Examples
				- In P(x) : x>5, x is the subject or the variable and '>5' is the predicate.
				- P(7) : 7>5 is a proposition where we are assigning values to the variable x, and it has a truth value, i.e. True.
			- Set of values that the predicate can assume is called either
				- Universe
				- Domain of Discourse
				- Domain of Predicate
- “G ̈odel's Theorem.” ([Leary, 2015, p. 10](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=10&annotation=8TL6HVZZ))
	- Why are Theorems true? [^2]
		- "In a strictly formal sense, theorems aren't true; they are valid (i.e. proved)"
			- "we separate the world of mathematical objects--what we call models--from the axioms and logical structure behind them--what we call the theory."
				- "Modeling is a process that uses math to represent, analyze, make predictions, or otherwise provide insight into real-world phenomena" [^3]
				- So the relationship between the weight and size of a rat could be a mathematical model. [^4]
		- "One of the surprising things that can happen is that we can have things true about the natural numbers that we cannot prove from our axioms. (This is the famous Gödel's incompleteness theorems.)"
		- "if a theorem is proved from consistent axioms, then the proposition (statement) it entails is true in the mathematical model."
			- "But even this is not quite as satisfactory as it seems, because it turns out that in general it is nearly impossible to tell whether an axiom system is consistent."
- “when you are lost in a sea of abstraction, write down three examples and see if they can tell you what is going on.” ([Leary, 2015, p. 11](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=11&annotation=T4Y4C473))
- “This is an elementary textbook, but elementary does not mean easy.” ([Leary, 2015, p. 11](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=11&annotation=PHEXQNRE))

## (1) Structures and Languages
Notes
- “David Hilbert” ([Leary, 2015, p. 16](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=16&annotation=P2HGNH55))
	- “Hilbert challenged mathematicians to come up with a set of axioms for arithmetic that were guaranteed to be consistent, guaranteed to be paradox-free.” ([Leary, 2015, p. 16](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=16&annotation=LRUQPPY8)) 
		- in 1900
- “three major schools of mathematical philosophy developed.” ([Leary, 2015, p. 16](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=16&annotation=GVRCFV4P))
	- “Platonists held that mathematical objects had an existence independent of human thought, and thus the job of mathematicians was to discover the truths about these mathematical objects.” ([Leary, 2015, p. 16](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=16&annotation=FT638XMM))
	- “Intuitionists, led by the Dutch mathematician L. E. J. Brouwer, held that mathematics should be restricted to concrete operations performed on finite structures. ” ([Leary, 2015, p. 16](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=16&annotation=G66NFCVP))
	- “[[Formalist school]], which held that mathematics was nothing more than the manipulation of meaningless symbols according to certain rules and that the consistency of such a system was nothing more than saying that the rules prohibited certain combinations of the symbols from occurring.” ([Leary, 2015, p. 17](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=17&annotation=U52USUTB))
- “a 24-year-old Austrian mathematician named Kurt G ̈odel” ([Leary, 2015, p. 17](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=17&annotation=YWIHXUMK))
- “[[Second Incompleteness Theorem]], which said that no consistent formal system of mathematics could prove its own consistency.” ([Leary, 2015, p. 17](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=17&annotation=YBCDWFTT))
	- “Thus Hilbert's program was impossible, and there would be no finitistic proof that the axioms of arithmetic were consistent.” ([Leary, 2015, p. 17](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=17&annotation=WCSHLZUM))
- “Thus we find ourselves in a situation where we cannot prove that mathematics is consistent.” ([Leary, 2015, p. 17](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=17&annotation=393QFZ78))
- “Our study of mathematical logic will take us to a point where we can understand the statement and the proof of [[Godel's Incompleteness Theorems (Gödel's)|Gödel's Incompleteness Theorems]].” ([Leary, 2015, p. 18](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=18&annotation=HRDSV59U))
- “On our way there, we will study [[formal language|formal languages]], [[mathematical structures]], and a certain [[deductive system]].” ([Leary, 2015, p. 18](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=18&annotation=WW5T67LY))

### (1.1) NaÏvely
- “you have some experience working with $R^2$, $R^3$, and $R^n$ as examples of [[Vector Space|vector spaces]].” ([Leary, 2015, p. 18](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=18&annotation=R3GJDSH2))

### (1.2) Languages
#### (1.2.1) Exercises
### (1.3) Terms and Formulas
#### (1.3.1) Exercises
### (1.4) Induction
#### (1.4.1) Exercises
### (1.5) Sentences
#### (1.5.1) Exercises
### (1.6) Structures
#### (1.6.1) Exercises
### (1.7) Truth in a Structure
#### (1.7.1) Exercises
### (1.8) Substitutions and Substitutability
#### (1.8.1) Exercises
### (1.9) Logical Implication
#### (1.9.1) Exercises
### (1.10) Summing Up, Looking Ahead

## (2) Deductions
### (2.1) Naïvely
### (2.2) Deductions
#### (2.2.1) Exercises
### (2.3) The Logical Axioms
#### (2.3.1) Equality Axioms
#### (2.3.2) Quantifier Axioms
#### (2.3.3) Recap
### (2.4) Rules of Inference
#### (2.4.1) Propositional Consequence
#### (2.4.2) Quantifier Rules
#### (2.4.3) Exercises
### (2.5) Soundness
#### (2.5.1) Exercises
### (2.6) Two Technical Lemmas
### (2.7) Properties of Our Deductive System
#### (2.7.1) Exercises
### (2.8) Nonlogical Axioms
#### (2.8.1) Exercises
### (2.9) Summing Up, Looking Ahead
## (3) Completeness and Compactness
### (3.1) Naïvely
### (3.2) Completeness
#### (3.2.1) Exercises
### (3.3) Compactness
#### (3.3.1) Exercises
### (3.4) Substructures and the Löwenheim-Skolem Theorems
#### (3.4.1) Exercises
### (3.5) Summing Up, Looking Ahead
## (4) Incompleteness from Two Points of View
### (4.1) Introduction
### (4.2) Complexity of Formulas
#### (4.2.1) Exercises
### (4.3) The Roadmap to Incompleteness
### (4.4) An Alternate Route
#### (4.5.1) Exercises
### (4.6) An Old Friend
### (4.7) Summing Up, Looking Ahead
## (5) Syntactic Incompleteness -- Groundwork
### (5.1) Introduction
### (5.2) The Language, the Structure, and the Axioms of N
#### (5.2.1) Exercises
### (5.3) Representable Sets and Functions
#### (5.3.1) Exercises
### (5.4) Representable Functions and Computer Programs
#### (5.4.1) Exercises
### (5.5) Coding -- Naïvely
#### (5.5.1) Exercises
### (5.6) Coding is Representable
#### (5.6.1) Exercise
### (5.7) Gödel numbering
#### (5.7.1) Exercises
### (5.8) Gödel Numbers and N
#### (5.8.1) Exercises
### (5.9) NUM and SUB Are Representable
#### (5.9.1) Exercises
### (5.10) Definitions by Recursion Are Representable
#### (5.10.1) Exercises
### (5.11) The Collection of Axioms is Representable
#### (5.11.1) Exercises
### (5.12) Coding Deductions
#### (5.12.1) Exercises
### (5.13) Summing Up, Looking Ahead

## (6) The Incompleteness Theorems
### (6.1) Introduction
### (6.2) The Self-Reference Lemma
#### (6.2.1) Exercises
### (6.3) The First Incompleteness Theorem
#### (6.3.1) Exercises
### (6.4) Extensions and Refinements of Incompleteness
#### (6.4.1) Exercises
### (6.5) Another Proof of Incompleteness
#### (6.5.1) Exercises
### (6.6) Peano Arithmetic and the Second Incompleteness Theorem
#### (6.6.1) Exercises
### (6.7) Summing Up, Looking Ahead
## (7) Computability Theory
### (7.1) The Origin of Computability Theory
### (7.2) The Basics
### (7.3) Primitive Recursion
#### (7.3.1) Exercises
### (7.4) Computable Functions and Computable Indices
#### (7.4.1) Exercises
### (7.5) The Proof of Kleene's Normal Form Theorem
#### (7.5.1) Exercises
### (7.6) Semi-Computable and Computably Enumerable Sets
#### (7.6.1) Exercises
### (7.7) Applications to First-Order Logic
#### (7.7.1) The Entscheidungsproblem
#### (7.7.2) Gödel's First Incompleteness Theorem
#### (7.7.3) Exercises
### (7.8) More on Undecidability
#### (7.8.1) Exercises
## (8) Summing Up, Looking Ahead
### (8.1) Once More, With Feeling
### (8.2) The language L_BT and the Structure B
### (8.3) Nonstandard L_BT - structures
### (8.4) The Axioms of B
### (8.5) B extended with an induction scheme
### (8.6) Incompleteness
### (8.7) Off You Go
## Appendix: Just Enough Set Theory to Be Dangerous
## Solutions to Selected Exercises

## References
[^1]: https://www.geeksforgeeks.org/difference-between-propositional-logic-and-predicate-logic/#
[^2]: https://www.quora.com/Why-is-a-theorem-true
[^3]: https://www.youtube.com/watch?v=xHtsuOB-TPw
[^4]: https://www.youtube.com/watch?v=yQhTtdq_y9M