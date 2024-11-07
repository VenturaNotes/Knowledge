[Video](https://youtube.com/watch?v=rAxXcX_w5fE)

![[Screen Shot 2022-10-24 at 3.06.30 AM.png]]
- Implications (Converse, Inverse, Contrapositive) and Biconditionals
	- Implications are just if/then statements
	- Biconditionals are if and only if (iff) statements 

![[Screen Shot 2022-10-24 at 3.09.29 AM.png]]
Implication (Conditional Statement)
	- We are saying something is true based on the condition that something else is true.
- The implication of propositions p and q is denoted p $\implies$ q and read "if p then q" or "p implies q".
	- One directional arrow.
- When the hypothesis is true, the conclusion must be true for the implication to be true. When the hypothesis is false, the conclusion is true.
	- p denotes "It is a holiday" 
	- q denotes "the store is closed"


| p   | q   | P $\implies q$ |
| --- | --- | -------------- |
| T   | T   | T              |
| T   | F   | F              |
| F   | T   | T              |
| F   | F   | T              |

- For the 3rd row, keep in mind that this is a one directional implication. It is not saying whether or not p is true based on q. If p is false, then our implication isn't valid and doesn't say anything about q. So if hypothesis, p, is false, then it doesn't tell us anything about conclusion q. So if hypothesis, then truth value of implication no matter q is always going to be true.

![[Screen Shot 2022-10-24 at 3.18.59 AM.png]]

- Converse, Inverse, Contrapositive
	- From our implication, p $\implies$ q, we can construct 3 new conditional statements.
	- Converse q $\implies$ p
		- Switch the order
	- Inverse $\lnot$ p $\implies$ $\lnot$ q
		- Negate both
	- $*$Contrapositive $\lnot$ q $\implies$ $\lnot$ p
		- Switch and negate
		- Will always have the same truth value as p $\implies$ q

- It is raining is a sufficient condition for me not going to town
	- Write statement in if/then form first 

<mark style="background: #FFF3A3A6;">If</mark> <mark style="background: #FFB86CA6;">it is raining</mark>, <mark style="background: #FFF3A3A6;">then</mark> <mark style="background: #FFB86CA6;">I won't go to town.</mark>
p: it is raining
q: I won't go to town

p $\implies$ q (this is the original statement)

Converse:
- If I don't' go to town, then it is raining
- q $\implies$ p
Inverse:
- If it is not raining, then I will go to town
- $\lnot$ p $\implies$ $\lnot$ q
Contrapositive:
- If I go to town, then it is not raining
- $\lnot$ q $\implies$ $\lnot$ p

![[Screen Shot 2022-10-24 at 3.28.56 AM.png]]

Practice
- Give the converse, inverse, and contrapositive of the implication:
	- <mark style="background: #FFF3A3A6;">Prof. B is happy</mark> when <mark style="background: #FFF3A3A6;">you complete your homework.</mark>
		- Write in if/then form first 

p: you complete your homework
q: Prof. B is happy

If you complete your homework, then Prof. B is happy

Converse
- q $\implies$ q
- If prof. B is happy, then you completed your HW

Inverse
- $\lnot$ p $\implies$ $\lnot$ q
- If you didn't complete your HW, then prof. B is not happy

Contrapositive
- $\lnot$ q $\implies$ $\lnot$ p
- If Prof. B is not happy, then you did not complete your hw


![[Screen Shot 2022-10-24 at 3.35.36 AM.png]]

Biconditional
- The biconditional of propositions p and q is denoted p$\iff$ q and read "p if and only if q"
	- It is a 2 directional implication

For a biconditional to be true, both propositions must share the same truth value.

| p   | q   | p$\iff$q |
| --- | --- | -------- |
| T   | T   |     T     |
| T   | F   |    F      |
| F   | T   |      F    |
| F   | F    |     T     |
![[Screen Shot 2022-10-24 at 3.40.12 AM.png]]

A preview:
Our biconditional p $\iff$ q can also be written as a compound proposition.
(p $\iff$ q) $\equiv$ (p $\implies$ q) $\land$ (q $\implies$ p)

(Note: "the term equal refers to things that are similar in all aspects, whereas the term equivalent refers to things that are similar in a particular aspect" [^1])

There are 3 sections to this truth table. First 2 columns are the combinations, The next 2 columns is to find all the parts that make up the compound propositions. The last 2 columns is to determine their equivalence.

| p   | q   | p$\implies$ q | q $\implies$ p | (p$\implies$q) $\land$ (q$\implies$ p) | p$\iff$ q |
| --- | --- | ------------- | -------------- | -------------------------------------- | --------- |
| T   | T   | T | T |                         T               |          T |
| T   | F   |      F         |          T      |       F                                 |     F      |
| F   | T   |       T        |         F       |      F                                  |    F       |
| F   | F    |      T         |          T      |     T                                   |   T        |

This is not a mathematical proof, but it is a way to show that compound propositions are in fact equivalent to one another.

The last 2 columns have the same truth values which is a way to show that 2 compound propositions are equivalent to one another.

![[Screen Shot 2022-10-24 at 3.54.13 AM.png]]

## References

[^1]: https://pediaa.com/difference-between-equal-and-equivalent/#:~:text=the%20term%20equal%20refers%20to%20things%20that%20are%20similar%20in%20all%20aspects%2C%20whereas%20the%20term%20equivalent%20refers%20to%20things%20that%20are%20similar%20in%20a%20particular%20aspect.