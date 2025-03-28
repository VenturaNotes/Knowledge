---
Source:
  - https://youtube.com/watch?v=9jql1BylJnY
Reviewed: false
---
- ![[Screenshot 2023-11-13 at 4.08.49 PM.png]]
	- Slide 2 - Learning Objectives (for this video)
		- By the end of this video, participants should be able to
			- (1) State the [[order axioms]]
			- (2) Prove a basic fact using order axioms
			- (3) Avoid common pitfalls with inequalities.
	- Slide 3 - Motivation
		- Motivation
			- We would like to prove a variety of inequalities. How can we do that in a rigorous way?
	- Slide 4 - Notation
		- Definitions
			- We say that a [[Real numbers|real number]] x is
				- (1) [[positive]], if 0 < x
				- (2) [[negative]], if x < 0
				- (3) [[nonnegative|non-negative]], if x is not negative, i.e. 0 $\le$ x
	- Slide 5 - [[Order axioms]]
		- Order axioms
			- Let a, b, c, d $\in$ $\mathbb{R}$
				- (1) If a < b and 0 < c, then ac < bc
					- Multiplying by a positive constant won't change the inequality
				- (2) If a < b, then -b < -a
					- Multiply an inequality by -1 will reverse it
				- (3) $a^2$ $\ge$ 0
					- A square is always negative
				- (4) If a < b and c < d, then a + c < b + d
					- Can add two inequalities together
				- (5) If a $\ge$ 0, then there is a unique non-negative number $\sqrt{a}$ so that $(\sqrt{a})^2 = a$
					- If a is nonnegative, there is a unique nonnegative number for $\sqrt{a}$
				- (6) If 0 < a < b, then 0 < $\frac 1b$ < $\frac 1a$
					- If a and b are positive and a is less than b, taking the [[reciprocal]] will change the order
				- (7) If a < b and b < c, then a < c
					- This is called being transitive
		- Exercise: Show that Axioms 4 is stronger than Axiom 2 (and so we only need to include Axiom 4 on this list). That is, show that you can deduce Axiom 4 from Axiom 2
			- #archive
	- Slide 6 - Consequences
- ![[Screenshot 2023-11-13 at 4.53.17 PM.png]]
	- Slide 7 - Consequences
		- [[Difference of squares]]
		- Exercise. Use the axioms to justify the "note" we made without proof #archive
	- Slide 8 - Exercise #archive (one of these things is impossible )
		- (1) If possible, use the main idea from the proof of fact 1 to prove fact 2
		- (2) If possible, use the main idea from the proof of fact 2 to prove fact 1
	- Slide 9 - Common Mistakes
		- Exercise. Each of thees are common mistakes. Explain the error that is being made, and how to correct it
		- (1) Error: Multiplying by a negative switches the order of the inequality (Axiom 2)
		- (2) Error: Taking the reciprocal of two positive numbers reverses the inequality (axiom 6)
		- (3) Error: Since x can be any real number, it could also be negative, and that will change the inequality. (Axiom 2). 
			- Break up into 3 cases: x > 0, x = 0, x < 0 to prove
		- (4) Error: Fact 1 requires both a, b to be positive. Can you see why?
	- Slide 10 - Reflection
		- What is the difference between an order axiom and a fact?
		- Why did we include Axiom 2 on the list of order axioms if it follows from Axiom 4?
		- What are some common misunderstandings about inequalities?
		- Can a theorem have multiple different proofs?