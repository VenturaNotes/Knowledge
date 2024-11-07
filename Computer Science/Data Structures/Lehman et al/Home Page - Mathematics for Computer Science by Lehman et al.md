---
Source:
  - https://courses.csail.mit.edu/6.042/spring18/
  - zotero://open-pdf/library/items/366U7SQX?page=1&annotation=76SRFPQC
Length: "1048"
Progress: "19"
tags:
  - status/incomplete
  - type/textbook
---
## (I) Proofs
- “a [[proof]] is a method of establishing truth” ([Lehman et al., p. 11](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=11&annotation=TQBJKHLM))
- “only [[scientific falsehood]] can be demonstrated by an experiment” ([Lehman et al., p. 11](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=11&annotation=IBHTYHSD))
- “In statistics, [[probable truth]] is established by statistical analysis of sample data.” ([Lehman et al., p. 11](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=11&annotation=CFZ6J9XT))
- Mathematics proof definition
	- “A [[mathematical proof]] of a [[proposition]] is a chain of [[Logical Deduction|logical deductions]] leading to the proposition from a base set of [[axioms]].” ([Lehman et al., p. 12](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=12&annotation=IZKRSKCC))
### (1) What is a Proof
#### (1.1) Propositions
- “Definition. A [[proposition]] is a statement (communication) that is either true or false.” ([Lehman et al., p. 13](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=13&annotation=5MH2TPCF))
	- Examples: 
		- 2 + 3 = 5 =True
		- 1 +1 = 3
	- Saying "It's five o'clock" is not a proposition because the truth varies with circumstance
- “(A [[prime]] is an integer greater than 1 that is not divisible by any other integer greater than 1. For example, 2, 3, 5, 7, 11, are the first five primes.)” ([Lehman et al., p. 13](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=13&annotation=6URZHK67))
- “The symbol ::= means “[[equal by definition]].” It’s always ok simply to write “=” instead of ::=, but reminding the reader that an equality holds by definition can be helpful.” ([Lehman et al., p. 13](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=13&annotation=WV7CJ3ZQ))
	- Example
		- p(n) ::= $n^2$ + n + 41
- "It's not hard to show that no polynomial with integer coefficients can map all nonnegative numbers into prime numbers, unless it's a constant."
	- “you can’t check a claim about an infinite set by checking a finite sample of its elements, no matter how large the sample.” ([Lehman et al., p. 14](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=14&annotation=IQCMPEPV))
- ![[Pasted image 20230114153151.png]]
	- [Lehman et al., p. 14](zotero://open-pdf/library/items/366U7SQX?page=14&annotation=W44AQKWT)
		- The period after the $\mathbb{N}$ is just a separator between phrases.
	- $\forall$: read "[[for all]]"
	- $\mathbb{N}$: set of [[nonnegative integers]] (0, 1, 2, 3, ...)
	- $\in$ 
		- "is a member of"
		- "[[belongs to]]"
		- "is in"
- Equivalent Logical Notation
	- ![[Pasted image 20230114153452.png]]
		- [[Positive integers]] $\mathbb{Z^+}$
	- ![[Pasted image 20230114153507.png]]
- Euler's [[(17) C9--Goldbach's Conjecture#^a47467|conjecture]] 
	- $a^4 + b^4 + c^4 = d^4$
		- Proven false
- “[[Four Color Theorem]]” ([Lehman et al., p. 14](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=14&annotation=XB7ABUDF))
	- “Every map can be colored with 4 colors so that adjacent2 regions have different colors.” ([Lehman et al., p. 14](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=14&annotation=U73B52YF))
	- “Two regions are adjacent only when they share a boundary segment of positive length. They are not considered to be adjacent if their boundaries meet only at a few points.” ([Lehman et al., p. 14](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=14&annotation=ET6MN35E))
	- “A laborious proof was finally found in 1976 by mathematicians [[Appel and Haken]], who used a complex computer program to categorize the four-colorable maps.” ([Lehman et al., p. 15](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=15&annotation=RWXWGLTG))
	- “Two decades later a mostly [intelligible proof](https://thomas.math.gatech.edu/FC/fourcolor.html) of the Four Color Theorem was found,” ([Lehman et al., p. 15](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=15&annotation=PS3L5EEX)“Proposition 1.1.5 (Fermat’s Last Theorem).” (Lehman et al., p. 15)
- “Proposition 1.1.5 ([[Fermat’s Last Theorem]]).” ([Lehman et al., p. 15](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=15&annotation=R8Y4V6IS))
	- There are no positive integers x, y, and z such that $x^n + y^n = z^n$ for some integer n > 2
	- “in 1994, British mathematician [[Andrew Wiles]] gave a proof, after seven years of working in secrecy and isolation in his attic.” ([Lehman et al., p. 15](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=15&annotation=GYTA76MA))
- “[[Goldbach's Conjecture]]” ([Lehman et al., p. 15](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=15&annotation=BR54DE2S))
	- Every even integer greater than 2 is the sum of two primes
	- “It is known to hold for all numbers up to $10^{18}$, but to this day, no one knows whether it’s true or false.” ([Lehman et al., p. 15](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=15&annotation=MCZJTQW9))
- “For a computer scientist, some of the most important things to prove are the correctness of programs and systems—whether a program or system does what it’s supposed to.” ([Lehman et al., p. 16](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=16&annotation=GD7Z6W6U))
	- Efforts have been successful enough in the case of CPU chips (now routinely used by leading chip manufacturers to prove chip correctness)
	- “Developing mathematical methods to verify programs and systems remains an active research area.” ([Lehman et al., p. 16](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=16&annotation=AAC9XKQT))
#### (1.2) Predicates
- “A [[predicate]] can be understood as a proposition whose truth depends on the value of one or more variables.” ([Lehman et al., p. 16](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=16&annotation=X27WIBEW))
	- “So “n is a perfect square” describes a predicate, since you can’t say if it’s true or false until you know what the value of the variable n happens to be.” ([Lehman et al., p. 16](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=16&annotation=U364DN73))
		- When n = 4, predicate becomes the true [[proposition]] "4 is a perfect square"
		- When n = 5, you would get a false proposition
- Predicates often named with a letter
	- “P(n) ::= “n is a perfect square”;” ([Lehman et al., p. 16](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=16&annotation=VZSJWI3Z))
		- P(4) is true and P(5) is false
- “If P is a predicate, then P(n) is either true or false” ([Lehman et al., p. 16](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=16&annotation=XZ4AQW47))
- “if p is an ordinary function, like $n^2 + 1$, then p(n) is a numerical quantity.” ([Lehman et al., p. 16](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=16&annotation=W8BFH3MW))
#### (1.3) The Axiomatic Method
- “The standard procedure for establishing truth in mathematics was invented by [[Euclid]], a mathematician working in Alexandria, Egypt around 300 BC.” ([Lehman et al., p. 16](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=16&annotation=48USGFWA))
	- “begin with five assumptions about geometry, which seemed undeniable based on direct experience.” ([Lehman et al., p. 16](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=16&annotation=IJUYCZXZ))
	- Example: There is a straight line segment between every pair of points
		- “Propositions like these that are simply accepted as true are called [[axioms]].” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=TZB4AK67))
- “A [[proof]] is a sequence of logical deductions from axioms and previously proved statements that concludes with the proposition in question.” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=5DZPN6NS))
- “There are several common terms for a [[proposition]] that has been proved” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=MLJQUBTP))
	- “Important true propositions are called [[Theorem|Theorems]].” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=WH4PY55G))
	- “A [[lemma]] is a preliminary proposition useful for proving later propositions.” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=UB9XHJWV))
	- “A [[corollary]] is a proposition that follows in just a few logical steps from a theorem.” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=3R84XBDX))
- Definitions not precise
	- “sometimes a good lemma turns out to be far more important than the theorem it was originally used to prove.” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=95WF48CP))
- “Euclid’s axiom-and-proof approach, now called the [[axiomatic method]], remains the foundation for mathematics today.” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=PGEV76LA))
- “just a handful of axioms, called the Zermelo-Fraenkel with Choice axioms ([[ZFC]]), together with a few logical deduction rules, appear to be sufficient to derive essentially all of mathematics.” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=DGIYX4D7))
#### (1.4) Our Axioms
- ZFC axioms too primitive.
	- “a formal proof in ZFC that 2 + 2 = 4 requires more than 20,000 steps!” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=KI9XL9E9))
- “we’re going to take a huge set of axioms as our foundation: we’ll accept all familiar facts from high school math.” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=APUDJILG))
- “you may find this imprecise specification of the axioms troubling at times.” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=PI7EIQX8))
	- “good general guideline is simply to be up front about what you’re assuming.” ([Lehman et al., p. 17](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=17&annotation=J4LHG69K))

##### 1.4.1 Logical Deductions
- “[[Logical Deduction|Logical deductions]], or inference rules, are used to prove new propositions using previously proved ones.” ([Lehman et al., p. 18](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=18&annotation=IYP6FSHH))
- “A fundamental inference rule is [[modus ponens]].” ([Lehman et al., p. 18](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=18&annotation=GTUR6HY7))
	- “a proof of P together with a proof that P IMPLIES Q is a proof of Q” ([Lehman et al., p. 18](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=18&annotation=ZH5IG9I8))
###### Rule
- ![[Screenshot 2023-07-14 at 3.52.43 PM.png]]
	- [[Modus ponens]] written this way
	- If [[antecedent|antecedents]] above line are proved, then conclusion/consequents below line are also proved
	- “A key requirement of an inference rule is that it must be sound:” ([Lehman et al., p. 18](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=18&annotation=G6EZA3UU))
	- “So if we start off with true axioms and apply sound inference rules, everything we prove will also be true.” ([Lehman et al., p. 18](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=18&annotation=N9DKYTPD))
	- There are other inference rules as well
###### Rule
- ![[Screenshot 2023-08-01 at 12.12.08 AM.png]]
	- ![[Screenshot 2023-08-01 at 12.28.13 AM.png|400]]
		- Truth table shows that every time both $P \implies Q$ and $Q \implies R$ are true, then $P \implies R$ is also true
###### Non-Rule
- ![[Screenshot 2023-08-01 at 12.40.01 AM.png]]
	- If P is True and Q is False, then the antecedent is true but the consequent is false
- “As with axioms, we will not be too formal about the set of legal inference rules. Each step in a proof should be clear and “logical”;” ([Lehman et al., p. 18](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=18&annotation=7AU2E4YK))
	- “should state what previously proved facts are used to derive each new conclusion.” ([Lehman et al., p. 18](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=18&annotation=9LBSIUXM))

##### 1.4.2 Patterns of Proof
- “a [[proof]] can be any sequence of logical deductions from axioms and previously proved statements that concludes with the proposition in question.” ([Lehman et al., p. 19](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=19&annotation=G6DVFZ38))
- “many proofs follow one of a handful of standard templates.” ([Lehman et al., p. 19](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=19&annotation=8TNCD94X))
	- “Many of these templates fit together; one may give you a top-level outline while others help you at the next level of detail.” ([Lehman et al., p. 19](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=19&annotation=MHSMEAWM))
	- Will learn more sophisticated proof techniques later on

#### (1.5) Proving an Implication
- “Propositions of the form “If P , then Q” are called [[Implication|implications]].” ([Lehman et al., p. 19](zotero://select/library/items/LJQ7SD3H)) ([pdf](zotero://open-pdf/library/items/366U7SQX?page=19&annotation=T9IN29HD))
	- Often rephrased "P implies Q"
- Examples
	- [[Quadratic Formula]]
		- If $ax^2 + bx + c = 0 \text{ and } a \ne 0$, then $x = (-b \pm \sqrt{b^2-4ac})/ 2a$
	- [[Goldbach's Conjecture]]
		- If n is an even integer greater than 2, then n is a sum of two primes
	- If 0 $\le$ x $\le$ 2, then $-x^{3} + 4x + 1 > 0$

##### Methods for Proving an Implication
###### 1.5.1 Method #1
- To prove P implies Q
	- Assume P
	- Show that Q logically follows
- Example
	- Theorem 1.5.1. If $0 \le x \le 2$, then $-x^3 + 4x + 1 > 0$
	- Proof. Assume 0 $\le$ x $\le$ 2. Then x, 2-x and 2 + x are all [[nonnegative]]. Therefore, the product of these terms is also nonnegative. Adding 1 to this product gives a positive number, so: ^c45fee
		- $x(2-x)(2+x) + 1 > 0$
		- Multiplying out on the left side proves that $-x^3 + 4x + 1 > 0$ as claimed. $\blacksquare$
- Summary
	- Need to do scratchwork before proof
	- Proof begins with the word "Proof" and ends with some sort of [[delimiter]] like $\blacksquare$ or "QED"
###### 1.5.2 Method #2 - Prove the Contrapositive
- [[Implication]] is logically equivalent to its [[Contrapositive]]
	- Implication
		- p implies q
	- Contrapositive
		- not q implies not p