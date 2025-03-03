---
Source:
  - https://youtube.com/watch?v=B1Z4e3WUxNM
Reviewed: false
---
- ![[Screenshot 2024-01-16 at 3.54.06 PM.png]]
	- Slide 2 - Learning Objectives (for this video)
		- By the end of this video, participants should be able to 
			- Prove an [[Implication]] using a [[direct proof]] and a contrapositive
			- State the [[converse]] and [[contrapositive]] of an implication
			- Prove an equivalence
	- Slide 3 - Motivation
		- Motivation
			- We are now able to make mathematical statements (involving $\forall, \exists, \land, \lor, \implies, \lnot, \iff$). Today we will see what it mens to prove these statements
	- Slide 4 - [[Direct proof]]
		- Proof technique ($P \implies Q$, directly)
			- To prove a statement of the form P $\implies$ Q . You assume P (is true). Deduce Q (by a series of logical, justified steps)
		- Theorem
			- Let x $\in$ $\mathbb{Z}$. If x is even, then $x^2$ is [[even]]
	- Slide 5 - [[Contrapositive]]
		- Proof technique (P $\implies$ Q, contrapositive)
		- To prove a statement of the form P $\implies$ Q, we can instead prove the logically equivalent $(\lnot Q)$ $\implies$ $(\lnot P)$. Assume $\lnot Q$. Deduce $\lnot P$ 
		- Assume x is odd 
			- This step is a little bit of a lie?
- ![[Screenshot 2024-01-16 at 4.03.20 PM.png]]
	- Slide 6 - Different techniques
		- Question
			- How do I know which technique to use when proving $P \implies Q$?
		- Exercise
			- To prove the previous implication ($x^2$ even implies x even) directly, and not by contrapositive. It's much harder.
		- We'll get to a more detailed answer to this question after we see "proof by contradiction"
	- Slide 7 - [[Converse]]
		- Recall
			- The converse of an implication is Q $\implies$ P. It is not logically equivalent to P $\implies$ Q
		- Example
			- "If I get an A, then I will pass" is not the same as "If I pass, then I will get an A"
		- Clarity
			- Original Statement: P $\implies$ Q
			- [[Contrapositive]]: $\lnot Q \implies \lnot P$ (Equivalent to original)
			- [[Converse]]: $Q \implies P$. (Not equivalent to original)
	- Slide 8 - [[Equivalence]]
		- Recall P $\iff$ Q is logically equivalent to "(P $\implies$ Q) $\land$ (Q $\implies$ P)"
		- Proof technique (P $\iff$ Q)
			- To prove P $\iff$ Q, you do two things
				- Prove $P \implies Q$, and
				- Prove Q $\implies$ P
		- Proof technique $(P \iff Q)$ - alternate
			- To prove P $\iff$ Q, you can instead
				- Prove $P \implies Q$, and
				- Prove $\lnot$P $\implies$ $\lnot$Q
	- Slide 9 - Equivalence proofs
		- Theorem
			- Used technique 2 for first one
		- $P \iff Q \iff R$
			- You will often need to prove that three statements are equivalent. There are many ways to do this
		- Strategy 1. Prove:
			- $P \implies Q$
			- $Q \implies P$
			- $Q \implies R$
			- $R \implies Q$ 
		- Strategy 2. Prove
			- $P \implies Q$
			- $Q \implies R$
			- $R \implies P$ 
- ![[Screenshot 2024-01-16 at 4.07.10 PM.png]]
	- Slide 10 - Exercise
		- Prove the following theorem that there are many equivalent ways to represent a [[Rational Numbers|rational number]]
		- Theorem
			- Let x be a real number. The following are equivalent
			- Part of one statement
				- c, d have no common prime factors
	- Slide 11 - Reflection
		- What is the difference between a contrapositive and a converse
		- Create an example of an implication and construct its contrapositive and converse
		- If you have taken a linear algebra course you have seen a proof that 10 (or so) statements are equivalent to "a [[matrix]] is [[invertible]]". What proof strategy did they use?