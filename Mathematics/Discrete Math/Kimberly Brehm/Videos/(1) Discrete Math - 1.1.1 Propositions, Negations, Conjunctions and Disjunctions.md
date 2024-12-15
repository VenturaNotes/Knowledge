---
Source:
  - https://youtube.com/watch?v=A3Ffwsnad0k
---
- Propositions, Negations, Conjunctions, Disjunctions, Truth tables that go along with those connectives
	- Connectives are negations, conjunctions and disjunctions
- ![[Screen Shot 2022-10-23 at 9.04.50 AM.png|300]]
- A [[proposition]] is a declarative statement that is <mark style="background: #FFF3A3A6;">either true or false.</mark>
	- Propositions
		- <mark style="background: #FFF3A3A6;">The sky is blue</mark> ( P could be represented with that statement)
		- <mark style="background: #FFF3A3A6;">The moon is made of cheese</mark> (Q)
		- <mark style="background: #FFF3A3A6;">Luke, I am your father</mark> (R)
	- Not propositions
		- Sit down (It is a statement but not true or false)
		- x + 1 = 2
			- "x + 1 = 2  where x = 5" is a proposition because we can assert whether it's true or false
			- Need to assign a value for X, because otherwise we can't make it true or false
- Statements in pink are considered propositions
![[Screen Shot 2022-10-24 at 1.56.41 AM.png]]
Constructing compound propositions
A compound proposition is comprised of propositions and one or more of the following connectives (they are like operators. The + in 1 + 2 is an operator. Connectives are operators for propositions) :
- Negation $\lnot$ "Not"
	- $\lnot$ p (read not p)
- Conjunction $\land$ "And"
	- p $\land$ q (read p and q)
- Disjunction $\lor$ "Or"
	- p $\lor$ q (read p or q)
- Implication $\implies$ "If, then"
	- p $\implies$ q (read If p then q)
- Biconditional $\iff$ "If and Only If"
	- p $\iff$ q (read p if and only if q)
		- Must both share the same truth value

- Each proposition is represented by a propositional variable (p, q, r, s, ...). These should be lowercase.
	- Example: p $\implies$ q
![[Screen Shot 2022-10-24 at 2.08.04 AM.png]]
- Negation
	- The negation of the proposition p is $\lnot$ p (not p).
	- Ex. If p denotes "the grass is green", then $\lnot$ p denotes "it is not the case that the grass is green", or more simply, "the grass is <mark style="background: #FFF3A3A6;">not</mark> green".
		- A. My Dog is the cutest dog.
			- p
			- $\lnot$ p: my dog is <mark style="background: #FFF3A3A6;">not</mark> the cutest dog
		- B. The door is not open.
			- p
			- Could also say "it is not the case that the door is not open." But it's easier to say "The door is open" for $\lnot$ p
		- C. Are we there yet?
			- Not a proposition (neither true nor false) so can't negate it.
![[Screen Shot 2022-10-24 at 2.11.55 AM.png]]

- Truth Tables
	- Each row of a truth table gives us one possibility for the truth values of our propositions (s). Since each proposition has two possible truth tables, true or false, we will have 2 rows for each proposition (or $2^n$ rows where n = # of propositions).
	- Truth Table for $\lnot$ p

p: my dog is the cutest dog
$\lnot$ p: my dog is not the cutest dog

| p    | $\lnot$ p |
| ---- | --------- |
|T | F (Must be F because the dog can't be both the cutest and not the cutest at the same time ) |
| F    |  T         |

- Left side of truth table has all <mark style="background: #FFF3A3A6;">combinations</mark> of truth values for propositions
	- Might have more columns with more propositions
	- With 2 propositions, you'll have $2^n$ rows which is $2^2$ rows or $4$ rows. It's all about how many combinations there are.
- The right side is for [[connectives]]
	- Might have several columns of this on the right side

- Given either p $\land$ q, p $\lor$ q
| p   | q   |     |
| --- | --- | --- |
| T   | T   | --- |
| T   | F   |     |
| F   | T   |     |
| F   | F    |     |
- There are a total of 4 combinations. Also, make sure to keep the combinations in the order as shown above where the first column switches once and the second column alternates every row.

![[Screen Shot 2022-10-24 at 2.26.49 AM.png]]

- Conjunction
	- The conjunction of propositions P and Q is denoted p $\land$ q and read p "and" q.
		- The conjunction symbol looks like a capital A which might help you remember it as "AND".
	- For a conjunction to be true, both propositions must be true

- p: it is raining
- q: I am home

| p   | q   | p $\land$ q |
| --- | --- | ----------- |
| T   | T   | T           |
| T   | F   | F           |
| F   | T   | F           |
| F   | F   | F            |

- The right side is always what you are doing a connective of.
- You don't necessarily need to put meaning to the propositions to really understand them.
- It's common to use statements to write as letters and go from there to make the truth table
![[Screen Shot 2022-10-24 at 2.31.46 AM.png]]
- Disjunction
	- The disjunction of propositions p and q is denoted p $\lor$ q and read p "OR" q.
		- You can think of it has a cup. If you can put anything in the cup (if either one is true), then the result is true. That is if you can put either p or q into the cup.
	- For a disjunction to be true, <mark style="background: #FFF3A3A6;">either</mark> proposition must be true.

| p   | q   | p $\lor$ q |
| --- | --- | ---------- |
| T   | T   | T          |
| T   | F   | T          |
| F   | T   | T          |
| F   | F   |    F        | 

- Only one needs to be true
![[Screen Shot 2022-10-24 at 2.37.34 AM.png]]


- The connective "OR" in English "XOR"
	- Inclusive "OR" p $\land$ q
		- The prequisite for MA420 is either MA315 or MA335
	- Exclusive "OR" p $\oplus$ q
		- You get soup or salad with your entree.
		- Not allowed to get both

| p   | q   | p $\land$ q | p $\oplus$ q |
| --- | --- | ----------- | ------------ |
| T   | T   | T           | F            |
| T   | F   | T           | T            |
| F   | T   | T           | T            |
| F   | F   | F           | F             |

![[Screen Shot 2022-10-24 at 2.43.10 AM.png]]