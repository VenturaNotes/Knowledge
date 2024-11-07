---
Source:
  - zotero://open-pdf/library/items/JDN9H7UE?page=1&annotation=E8GII6XE
Length: "380"
Progress: "10"
tags:
  - status/incomplete
  - type/textbook
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
				- In P(x) : x>5, x is the subject or the variable and ‘>5’ is the predicate.
				- P(7) : 7>5 is a proposition where we are assigning values to the variable x, and it has a truth value, i.e. True.
			- Set of values that the predicate can assume is called either
				- Universe
				- Domain of Discourse
				- Domain of Predicate
- “G ̈odel’s Theorem.” ([Leary, 2015, p. 10](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=10&annotation=8TL6HVZZ))
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
	- “Thus Hilbert’s program was impossible, and there would be no finitistic proof that the axioms of arithmetic were consistent.” ([Leary, 2015, p. 17](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=17&annotation=WCSHLZUM))
- “Thus we find ourselves in a situation where we cannot prove that mathematics is consistent.” ([Leary, 2015, p. 17](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=17&annotation=393QFZ78))
- “Our study of mathematical logic will take us to a point where we can understand the statement and the proof of [[Godel’s Incompleteness Theorems (Gödel's)|Gödel's Incompleteness Theorems]].” ([Leary, 2015, p. 18](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=18&annotation=HRDSV59U))
- “On our way there, we will study [[formal languages]], [[mathematical structures]], and a certain [[deductive system]].” ([Leary, 2015, p. 18](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=18&annotation=WW5T67LY))

### (1.1) NaÏvely
- “you have some experience working with $R^2$, $R^3$, and $R^n$ as examples of [[Vector Space|vector spaces]].” ([Leary, 2015, p. 18](zotero://select/library/items/7RV9PSGY)) ([pdf](zotero://open-pdf/library/items/JDN9H7UE?page=18&annotation=R3GJDSH2))

## References
[^1]: https://www.geeksforgeeks.org/difference-between-propositional-logic-and-predicate-logic/#
[^2]: https://www.quora.com/Why-is-a-theorem-true
[^3]: https://www.youtube.com/watch?v=xHtsuOB-TPw
[^4]: https://www.youtube.com/watch?v=yQhTtdq_y9M