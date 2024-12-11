---
Source:
  - zotero://open-pdf/library/items/RZPKBH48?page=1&annotation=XUVA6WPQ
Length: "414"
Progress: "21"
tags:
  - status/incomplete
  - type/textbook
---
## Acknowledgements
- ““Discrete and Combinatorial Mathematics” by Richard Grassl and Tabitha Mingus.” ([Levin, 2019, p. 7](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=7&annotation=BIG2JUYP))

## Preface
- “Most students who take the course plan to teach” ([Levin, 2019, p. 9](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=9&annotation=E8X6VWTW))
- “When I teach the class, I will assign sections for reading after first introducing them in class by using a mix of group work and class discussion on a few interesting problems.” ([Levin, 2019, p. 9](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=9&annotation=46A4FQEA)) 
	- Seems like textbooks can be meant to be read after a class rather than before
- “every attempt has been made to make the text sufficient for self study as well, in a way that hopefully mimics an inquiry based classroom.” ([Levin, 2019, p. 9](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=9&annotation=ZINW2U3K))
- “If you are an instructor, feel free to edit the LATEX or PreTeXt source to fit your needs.” ([Levin, 2019, p. 10](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=10&annotation=NHCSP279)) 
	- Didn't know there was something called "PreTeXt"
- “Oscar Levin, Ph.D.” ([Levin, 2019, p. 10](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=10&annotation=4GCJLTJ4))
	- Author is a PhD

## How to Use This Book
- “There are no solutions provided for these problems,” ([Levin, 2019, p. 11](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=11&annotation=MASVJAK7)) 
	- No solutions for "Investigate!" Activities but helps prime you for problems
- “Instead, use the examples to deepen our understanding of the concepts and techniques discussed in each section. Then use this understanding to solve the exercises at the end of each section.” ([Levin, 2019, p. 11](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=11&annotation=D9RG77KV))
- “which in the PDF version of the text can be found by clicking on the exercise number—clicking on the solution number will bring you back to the exercise” ([Levin, 2019, p. 11](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=11&annotation=BH9TFG8F))
- “You can view the interactive version for free at http://discrete.openmathbooks.org/ or by scanning the QR code below with your smart phone.” ([Levin, 2019, p. 12](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=12&annotation=Z74K7FNR)) 
	- Seems like there might be extra problems on the website if I want more practice.

## (0) Introduction and Preliminaries
### (0.1) What is Discrete Mathematics
- “Some math fundamentally deals with stuff that is individually separate and distinct.” ([Levin, 2019, p. 17](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=17&annotation=ASQ9ZUQQ))
- “This set of numbers is NOT discrete.” ([Levin, 2019, p. 17](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=17&annotation=6DQVSL8U))
	- The interval $[0,\infty)$  being the range for the function $f(x) = x^2$
- “Discrete math could still ask about the range of a function, but the set would not be an interval.” ([Levin, 2019, p. 17](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=17&annotation=4GNA5I7N))
- “This output set is discrete because the elements are separate. The inputs to the function also form a discrete set because each input is an individual person.” ([Levin, 2019, p. 17](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=17&annotation=THXE2CBY))
	- {0,1,2,3}
- “The most popular mathematician in the world is throwing a party for all of his friends. As a way to kick things off, they decide that everyone should shake hands. Assuming all 10 people at the party each shake hands with every other person (but not themselves, obviously) exactly once, how many handshakes take place?” ([Levin, 2019, p. 18](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=18&annotation=H69JWG55))
	- ![[Screenshot 2023-03-25 at 12.34.24 AM.png]]
		- There seems to be 45 unique handshakes. Checked OpenAI as well for chat GPT 3.5
- “At the warm-up event for Oscar’s All Star Hot Dog Eating Contest, Al ate one hot dog. Bob then showed him up by eating three hot dogs. Not to be outdone, Carl ate five. This continued with each contestant eating two more hot dogs than the previous contestant. How many hot dogs did Zeno (the 26th and final contestant) eat? How many hot dogs were eaten all together?” ([Levin, 2019, p. 18](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=18&annotation=VKAFNHZZ))
	- ![[Screenshot 2023-03-25 at 1.02.02 AM.png|400]]
		- Seems to be a sequences type problem
		- The 26th contestant ate 51 hotdogs and the number of hot dogs eaten all together was 676
			- Needed to use the "[Sum of Arithmetic Sequence](https://byjus.com/sum-of-arithmetic-sequence-formula/)" formula to solve for this
- ![[Pasted image 20230325010756.png]] [image](zotero://open-pdf/library/items/RZPKBH48?page=18&annotation=2THAJ4SI)
	- Question
		- After excavating for weeks, you finally arrive at the burial chamber. The room is empty except for two large chests. On each is carved a message (strangely in English): If this chest is empty, then the other chest’s message is true. This chest is filled with treasure or the other chest contains deadly scorpions. You know exactly one of these messages is true. What should you do?
	- There seems to be a few possible cases here.
		- If the message of the first treasure chest is true and it's empty, that would mean the second treasure chest must be true as well. This is not possible since we know EXACTLY one of these messages is true. Therefore, this scenario itself is a contradiction.
		- If the message of the first treasure is true but it's not empty, we would not know what is in either chest (as the message in the second chest would become irrelevant)
		- If the message in the second chest was true, then we know it is filled with treasure or the other chest contains deadly scorpions. 
			- <mark style="background: #FFF3A3A6;">The safest choice would be to open the second chest as it may contain treasure.</mark>
- “Back in the days of yore, five small towns decided they wanted to build roads directly connecting each pair of towns. While the towns had plenty of money to build roads as long and as winding as they wished, it was very important that the roads not intersect with each other (as stop signs had not yet been invented). Also, tunnels and bridges were not allowed. Is it possible for each of these towns to build a road to each of the four other towns without creating any intersections?” ([Levin, 2019, p. 18](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=18&annotation=F9C99QTG))
	- There does not seem to be a solution
- “combinatorics (the theory of ways things combine; in particular, how to count these ways),” ([Levin, 2019, p. 19](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=19&annotation=DJ3KL4K6))
### (0.2) Mathematical Statements
#### (0.2.1) Atomic and Molecular Statements
- “A statement is any declarative sentence which is either true or false. A statement is atomic if it cannot be divided into smaller statements, otherwise it is called molecular.” ([Levin, 2019, p. 20](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=20&annotation=UWYECKJP))
- “atomic statement examples” ([Levin, 2019, p. 20](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=20&annotation=82ZNAFP6))
- “not statements:” ([Levin, 2019, p. 21](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=21&annotation=G6W3FC7Y))
- ““3 + x = 12 where x = 9,”” ([Levin, 2019, p. 21](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=21&annotation=9F4WJQNP))
	- This is a statement because the value of the variable is specified. 
- “capture the free variable by quantifying over it” ([Levin, 2019, p. 21](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=21&annotation=BWHYUR46))
	- ““for all values of x, 3 + x = 12,”” ([Levin, 2019, p. 21](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=21&annotation=HXEISURW))
		- This is a statement, but it's just false
- “You can build more complicated (molecular) statements out of simpler (atomic or molecular) ones using logical connectives.” ([Levin, 2019, p. 21](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=21&annotation=3CIAS72N))
- “5 connectives” ([Levin, 2019, p. 21](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=21&annotation=DU9ISECV))
	- “binary connectives (because they connect two statements)” ([Levin, 2019, p. 21](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=21&annotation=F9MNBJCJ))
		- and: $\land$
		- or: $\lor$
		- if..., then...: $\rightarrow$
		- if and only if: $\leftrightarrow$
	- “unary connective (since it applies to a single statement).” ([Levin, 2019, p. 21](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=21&annotation=V5A7TRI3))
		- not: $\lnot$
- Truth value of molecular statement is determined by “type of connective and the truth values of the parts.” ([Levin, 2019, p. 21](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=21&annotation=BSDPY36J))
- “So to analyze logical connectives, it is enough to consider [[propositional variables]] (sometimes called [[sentential variables]]), usually capital letters in the middle of the alphabet: P, Q, R, S, . . ..” ([Levin, 2019, p. 21](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=21&annotation=NTCV345H))
	- “standing in for (usually atomic) statements,” ([Levin, 2019, p. 21](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=21&annotation=AGF6JGVV))
	- Variables can only achieve true or false (known as Boolean Variables in Computer Science)
- “Logical Connectives.” ([Levin, 2019, p. 22](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=22&annotation=789473A7))
	- > - P $\land$ Q is read “P and Q,” and called a [[conjunction]]. 
	- P $\lor$ Q is read “P or Q,” and called a [[disjunction]].
	- P $\rightarrow$ Q is read “if P then Q,” and called an [[Implication|implication]] or [[Implication|conditional]]. 
	- P $\leftrightarrow$ Q is read “P if and only if Q,” and called a [[biconditional]]. 
	- $\lnot$P is read “not P,” and called a [[negation]].
- “Truth Conditions for Connectives.” ([Levin, 2019, p. 22](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=22&annotation=E497W4R4))
	- P ∧ Q is true when both P and Q are true.
	- P ∨ Q is true when P or Q or both are true. 
	- P → Q is true when P is false or Q is true or both. 
	- P ↔ Q is true when P and Q are both true, or both false.
	- ¬P is true when P is false.
- “or is the inclusive or (and not the sometimes used exclusive or) meaning that P ∨ Q is in fact true when both P and Q are true.” ([Levin, 2019, p. 22](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=22&annotation=99FM4ESF))
#### (0.2.2) Implications
- “Implications” ([Levin, 2019, p. 23](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=23&annotation=8LPLFD8W))
	- An implication or conditional is a molecular statement of the form P→Q where P and Q are statements. We say that
		- P is the hypothesis (or antecedent). 
		- Q is the conclusion (or consequent). 
	- An implication is true provided P is false or Q is true (or both), and false otherwise. In particular, the only way for P → Q to be false is for P to be true and Q to be false.
- “most common type of statement in mathematics is the implication.” ([Levin, 2019, p. 23](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=23&annotation=THRZ3KHV))
- “If a and b are the legs of a right triangle with hypotenuse c, then a2 + b2 c2.” ([Levin, 2019, p. 23](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=23&annotation=B9U4YYNT))
	- “This is a reasonable way to think about implications: our claim is that the conclusion (“then” part) is true, but on the assumption that the hypothesis (“if” part) is true. We make no claim about the conclusion in situations when the hypothesis is false.2” ([Levin, 2019, p. 23](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=23&annotation=JGXPI458))
	- Biconditional representation
		- ““a and b are the legs of a right triangle with hypotenuse c if and only if a2 + b2 c2.”” ([Levin, 2019, p. 23](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=23&annotation=R3AYVCDJ))
- “Just to be clear, although we sometimes read P → Q as “P implies Q”, we are not insisting that there is some causal relationship between the statements P and Q. In particular, if you claim that P → Q is false, you are not saying that P does not imply Q, but rather that P is true and Q is false.” ([Levin, 2019, p. 24](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=24&annotation=8NLXB5TQ))
- “the only way for an implication to be false is for the if part to be true and the then part to be false.” ([Levin, 2019, p. 24](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=24&annotation=C9D9E579))
- “It does not matter that there is no meaningful connection between the true mathematical fact and the fact about horses.” ([Levin, 2019, p. 24](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=24&annotation=KK3KX2VL)) The implication is true.
	- “1. If 1 1, then most horses have 4 legs.” ([Levin, 2019, p. 24](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=24&annotation=WB3J82E5))
- “Direct Proofs of Implications.” ([Levin, 2019, p. 25](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=25&annotation=4CUWYBMA))
	- “To prove an implication P → Q, it is enough to assume P, and from it, deduce Q.” ([Levin, 2019, p. 25](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=25&annotation=HWDFWZKZ))
	- “you must explain why Q is true, but you get to assume P is true first.” ([Levin, 2019, p. 25](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=25&annotation=Q6VJK2UT))
- “Direct proof” ([Levin, 2019, p. 25](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=25&annotation=ZZWXCPGU))
	- “does a great job of explaining <mark style="background: #FFF3A3A6;">why</mark> the statement is true.” ([Levin, 2019, p. 25](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=25&annotation=5RCU29C6))
- “Example 0.2.4” ([Levin, 2019, p. 25](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=25&annotation=RVAHT2V2))
	- Prove: If two numbers a and b are even, then their sum a + b is even. 
	- Solution. Proof. Suppose the numbers a and b are even. This means that a= 2k and b = 2j for some integers k and j. The sum is then a + b = 2k + 2j = 2(k + j). Since k + j is an integer, this means that a + b is even. ([Levin, 2019, p. 25](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=25&annotation=FVW3IYCW))
		- We know that 2 multiplied by an integer will always return an even number. We show this in the last step of the proof
- “Converse and Contrapositive.” ([Levin, 2019, p. 26](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=26&annotation=TKJVXRQ9))
	- Converse
		- “The converse of an implication P → Q is the implication Q → P. The converse is NOT logically equivalent to the original implication. That is, whether the converse of an implication is true is independent of the truth of the implication.” ([Levin, 2019, p. 26](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=26&annotation=7CFXDETY))
	- Contrapositive
		- “The contrapositive of an implication P → Q is the statement ¬Q → ¬P. An implication and its contrapositive are logically equivalent (they are either both true or both false).” ([Levin, 2019, p. 26](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=26&annotation=RN5NQ2EC))
- “the Pythagorean theorem has a true converse:” ([Levin, 2019, p. 26](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=26&annotation=WHI4Q97M))
- “Whenever you encounter an implication in mathematics, it is always reasonable to ask whether the converse is true.” ([Levin, 2019, p. 26](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=26&annotation=BDCPBR5P))
- “often it is easier to analyze the contrapositive.” ([Levin, 2019, p. 26](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=26&annotation=U8Z2VVGV))
- “Note that to demonstrate that the converse (an implication) is false, we provided an example where the hypothesis is true (you do have three cards of the same suit), but where the conclusion is false (you do not have nine cards).” ([Levin, 2019, p. 27](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=27&annotation=ZLIBABL2))
- “Example 0.2.6” ([Levin, 2019, p. 27](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=27&annotation=DRLRWXXG))
	- “Suppose I tell Sue that if she gets a 93% on her final, then she will get an A in the class. Assuming that what I said is true, what can you conclude in the following cases: 
		- (1) Sue gets a 93% on her final. 
		- (2) Sue gets an A in the class. 
		- (3) Sue does not get a 93% on her final. 
		- (4) Sue does not get an A in the class.” ([Levin, 2019, p. 27](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=27&annotation=VW9E5X2N))
	- You can only conclude cases 1 and 4. In case 1, she got an A in the class for the implication to be true. For case 2, she did not score a 93% due to the contrapositive
		- "If she will not get an A in her class, then she does not get a 93% on her final". The truth value of the contrapositive is logically equivalent to the truth value of the implication
- “If and only if.” ([Levin, 2019, p. 28](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=28&annotation=4WSKUQGJ)) biconditional
	- “P ↔ Q is logically equivalent to (P → Q) ∧ (Q → P).” ([Levin, 2019, p. 28](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=28&annotation=7L8UHKJB))
- “You can think of “if and only if” statements as having two parts: an implication and its converse.” ([Levin, 2019, p. 28](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=28&annotation=FQ3TWQV6))
	- “We might say one is the “if” part, and the other is the “only if” part.” ([Levin, 2019, p. 28](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=28&annotation=IVZMCQPC))
	- Can say there is a forward direction an and a backwards direction
- “Example 0.2.7” ([Levin, 2019, p. 28](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=28&annotation=3LNJWPFE))
	- Given P is "I sing" and Q is "I'm in the shower"
		- "I sing <mark style="background: #FFF3A3A6;">if</mark> I'm in the shower" is equivalent to "If I'm in the shower, then I sing" meaning $Q \rightarrow P$. 
		- "I sing <mark style="background: #FFF3A3A6;">only if</mark> I'm in the shower" is equivalent to "If I sing, then I'm in the shower" meaning $P \rightarrow Q$
- “there are many ways to state an implication!” ([Levin, 2019, p. 29](zotero://select/library/items/VABQEUJ4)) ([pdf](zotero://open-pdf/library/items/RZPKBH48?page=29&annotation=AQ7UBR5H))
	- "If I dream, then I'm asleep". (Note: P="I dream" and Q="I'm asleep")
	- Below are equivalent implications (meaning that they're all of the form $P \rightarrow Q$)
		- (1) I am asleep if I dream.
		- (2) I dream only if I am asleep.
		- (3) In order to dream, I must be asleep.
		- (4) To dream, it is necessary that I am asleep.
		- (5) To be asleep, it is sufficient to dream.
		- (6) I am not dreaming unless I am asleep.


- Original Implication: "If I dream, then I'm asleep"
	- I am asleep if I dream
		- We see here that the consequent implies the antecedent because of "if". Therefore, it's still $P \rightarrow Q$
	- I dream only if I am asleep
		- "only if" is equivalent to if, then
	- In order to dream, I must be asleep
		- Makes sense that to dream, you sleep so.
"q unless $\lnot$ p"
I'm asleep unless I'm not dreaming
[[(7) Logical Operators − Implication (Part 2)]]

- 4 and 5 might be weird too? 

- My Method
	- P: I dream
	- Q: I am asleep
	- For unless - "q unless $\lnot$p"
	- I'm asleep unless I'm not dreaming
		- Translated to $
- Second Method
	- I am not dreaming unless I am asleep
		- Translates
		- $\lnot p$ unless q
			- The converse is $\lnot p$ unless q

#### (0.2.3) Predicates and Quantifiers
#### (0.2.4) Exercises
### (0.3) Sets
#### (0.3.1) Notation
#### (0.3.2) Relationships Between Sets
#### (0.3.3) Operations On Sets
#### (0.3.4) Venn Diagrams
#### (0.3.5) Exercises
### (0.4) Functions
#### (0.4.1) Describing Functions
#### (0.4.2) Surjections, Injections, and Bijections
#### (0.4.3) Image and Inverse Image
#### (0.4.4) Exercises
## (1) Counting
### (1.1) Additive and Multiplicative Principles
#### (1.1.1) Counting With Sets
#### (1.1.2) Principle of Inclusion/Exclusion
#### (1.1.3) Exercises
### (1.2) Binomial Coefficients
#### (1.2.1) Subsets
#### (1.2.2) Bit Strings
#### (1.2.3) Lattice Paths
#### (1.2.4) Binomial Coefficients
#### (1.2.5) Pascal's Triangle
#### (1.2.6) Exercises
### (1.3) Combinations and Permutations
#### (1.3.1) Exercises
### (1.4) Combinatorial Proofs
#### (1.4.1) Patterns in Pascal's Triangle
#### (1.4.2) More Proofs
#### (1.4.3) Exercises
### (1.5) Stars and Bars
#### (1.5.1) Exercises
### (1.6) Advanced Counting Using PIE
#### (1.6.1) Counting Derangements
#### (1.6.2) Counting Functions
#### (1.6.3) Exercises
### (1.7) Chapter Summary
#### (1.7.1) Chapter Review
## (2) Sequences
### (2.1) Describing Sequences
#### (2.1.1) Exercises
### (2.2) Arithmetic and Geometric Sequences
#### (2.2.1) Sums of Arithmetic and Geometric Sequences
#### (2.2.2 Exercises
### (2.3) Polynomial Fitting
#### (2.3.1) Exercises
### (2.4) Solving Recurrence Relations
#### (2.4.1) The Characteristic Root Technique
#### (2.4.2) Exercises
### (2.5) Induction
#### (2.5.1) Stamps
#### (2.5.2) Formalizing Proofs
#### (2.5.3) Examples
#### (2.5.4) Strong Induction
#### (2.5.5) Exercises
### (2.6) Chapter Summary
#### (2.6.1) Chapter Review
## (3) Symbolic Logic and Proofs
### (3.1) Propositional Logic
#### (3.1.1) Truth Tables
#### (3.1.2) Logical Equivalence
#### (3.1.3) Deductions
#### (3.1.4) Beyond Propositions
#### (3.1.5) Exercises
### (3.2) Proofs
#### (3.2.1) Direct Proof
#### (3.2.2) Proof by Contrapositive
#### (3.2.3) Proof by Contradiction
#### (3.2.4) Proof by (counter) Example
#### (3.2.5) Proof by Cases
#### (3.2.6) Exercises
### (3.3) Chapter Summary
#### (3.3.1) Chapter Review
## (4) Graph Theory
### (4.1) Definitions
#### (4.1.1) Exercises
### (4.2) Trees
#### (4.2.1) Properties of Trees
#### (4.2.2) Rooted Trees
#### (4.2.3) Spanning Trees
#### (4.2.4) Exercises
### (4.3) Planar Graphs
#### (4.3.1) Non-planar Graphs
#### (4.3.2) Polyhedra
#### (4.3.3) Exercises
### (4.4) Coloring
#### (4.4.1) Coloring in General
#### (4.4.2) Coloring Edges
#### (4.4.3) Exercises
### (4.5) Euler Paths and Circuits
#### (4.5.1) Hamilton Paths
#### (4.5.2) Exercises
### (4.6) Matching in Bipartite Graphs
#### (4.6.1) Exercises
### (4.7) Chapter Summary
#### (4.7.1) Chapter Review
## (5) Additional Topics
### (5.1) Generating Functions
#### (5.1.1) Building generating Functions
#### (5.1.2) Differencing
#### (5.1.3) Multiplication and Partial Sums
#### (5.1.4) Solving Recurrence Relations with Generating Functions
#### (5.1.5) Exercises
### (5.2) Introduction to Number Theory
#### (5.2.1) Divisibility
#### (5.2.2) Remainder Classes
#### (5.2.3) Properties of Congruence
#### (5.2.4) Solving Congruences
#### (5.2.5) Solving Linear Diophantine Equations
#### (5.2.6) Exercises
## (A) Selected Hints
## (B) Selected Solutions
## (C) List of Symbols
## (Index)

