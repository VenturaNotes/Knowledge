---
Source:
  - zotero://open-pdf/library/items/2QETGPJD?page=1&annotation=DGAIAAA4
Length: "129"
Progress: "23"
tags:
  - status/incomplete
  - type/textbook
Reviewed: false
---
## Preface
- “[[Number theory]] is concerned with properties of the integers:” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=3&annotation=ST6VCH55)) ^bce6e5
- “Mathematics is the queen of sciences and arithmetic the queen of mathematics.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=3&annotation=HNLATIWV))
	- [[Carl Friedrich Gauss]] called this number theory "arithmetic" and made the quote above
- “We assume that students have some familiarity with basic set theory, and calculus. But very little of this nature will be needed.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=3&annotation=5Y652W88))
- “symbolic programming language [[Maple]] which is an excellent tool for exploring number theoretic questions.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=3&annotation=E6UFEV4C)) ^975258
- “A [[prime number]] is an integer greater than 1 whose only positive factors are 1 and the integer itself.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=4&annotation=IF5BVJFZ)) ^6970f3
- “Here are some examples of outstanding unsolved problems in number theory.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=4&annotation=J43TZTAX))
	- [[Goldbach's Conjecture]] ^9271dc
		- “Every even integer n>2 is the sum of two primes.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=4&annotation=2VWX26TW))
	- [[Twin Prime Conjecture]] ^0a0343
		- "“There are infinitely many twin primes. (If p and p + 2 are primes we say that p and p +2 are twin primes.)"
	- Infinitely many primes of form $n^2 + 1$?
	- “infinitely many primes of the form $2^n-1$? Primes of this form are called [[Mersenne primes]].” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=4&annotation=6NIAD9WJ))
	- “infinitely many primes of the form $2^{2^n}+1$? Primes of this form are called [[Fermat primes]].” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=4&annotation=UN4XWQWB))
	- (3n + 1 Conjecture) [[Collatz conjecture]]
	- “Are there infinitely many primes whose digits in base 10 are all ones? Numbers whose digits are all ones are called [[repunits]].” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=4&annotation=Z26GBGTA))
		- Examples are 11, 111, 1111, etc. [^1]
	- “Are there infinitely many [[Perfect Number|perfect numbers]]? (An integer is perfect if it is the sum of its proper divisors.)” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=4&annotation=M2FRSXP8))
		- 6 = 1, 2, 3 [^2]
			- 6 is a perfect number
			- 1, 2, 3 are the proper divisors
	- “Is there a fast algorithm for factoring large integers? (A truly fast algorithm for factoring would have important implications for [[cryptography]] and [[data security]].)” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=4&annotation=DH2AX3RQ))

### Famous Quotations Related to Number Theory
- “famous Indian mathematician [[Ramanujan]].” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=5&annotation=Z455GPXQ))
- “Note in particular that Zahl is German for number. This is the reason that today we use $\mathbb{Z}$ for the [[set of integers]].” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=5&annotation=85LF8MK4))

## (1) Basic Axioms for Z
- Properties of integers
	- $\mathbb{N}$ = {1, 2, 3, ...}: [[natural numbers]] or [[positive integers]]
	- $\mathbb{Z}$ = {..., -3, -2, -1, 0, 1, 2, 3, ...} (the [[integers]])
	- $\mathbb{Q}$ = $\{\frac {n}{m} | n, m \in \mathbb{Z} \text{ and } m \ne 0\}$ ([[rational numbers]])
	- $\mathbb{R}$ = the [[real numbers]]
- $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$
- “ab = ba and ab + ac = a(b + c).” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=9&annotation=BDPLSA42))
- Some Basic [[Axioms for Integers]] (these are called axioms since they will not be proven in course (for this case))
	- (1) If a, b $\in$ $\mathbb{Z}$, then a + b, a - b and ab $\in$ $\mathbb{Z}$. ($\mathbb{Z}$ is closed under addition, subtraction and multiplication)
	- (2) If a $\in$ $\mathbb{Z}$ then there is no x $\in$ $\mathbb{Z}$ such that a < x < a +1
		- Example
			- Given a = 3
				- x cannot be a number between 3 and 4
	- (3) If a, b $\in$ $\mathbb{Z}$ and ab = 1, then either a = b = 1 or a = b = -1
		- Example
			- $1*1 = 1$
			- $-1 * -1 = 1$
	- (4) [[Laws of Exponents]]: For n, m in $\mathbb{N}$ and a, b in $\mathbb{R}$ we have
		- (a) $(a^n)^m$ = $a^{nm}$
		- (b) $(ab)^n = a^nb^n$
		- (c) $a^na^m = a^{n + m}$
		- These rules hold for all $n, m \in \mathbb{Z}$ if a and b are not 0
			- Why is it the case that a and b are not 0? #archive
	- (5) [[Properties of Inequalities]]: For a, b, c in $\mathbb{R}$ the following hold:
		- (a) ([[Transitivity]]) If a < b and b < c, then a < c
		- (b) If a < b then a + c < b + c
		- (c) If a < b and 0 < c then ac < bc
			- Examples
				- a = 5, b = 6, <mark style="background: #FFF3A3A6;">c =2</mark>
					- $5*2 < 6*2$
					- $10 < 12$
				- a = 5, b = 6, <mark style="background: #FFF3A3A6;">c = 0.5</mark>
					- $5*0.5 < 6*0.5$
					- $2.5 < 3$
		- (d) If a < b and c < 0 then bc < ac
			- Example
				- a = 5, b = 6, c = -3
					- $6*-3 < 5 *-3$
					- $-18 < -15$
		- (e) ([[Trichotomy]]) Given a and b, one and only one of the following holds
			- a = b
			- a < b
			- b < a
	- (6) The [[Well-Ordering Property for Natural Numbers]]: Every non-empty subset of $\mathbb{N}$ contains a least element
	- (7) The [[Principle of Mathematical Induction]]
		- Given
			- Let P(n) be a statement concerning the integer variable n
			- Let $n_0$ be any fixed integer
			- P(n) is true for all integers $n \ge n_0$ if one can establish both of the following statements
				- (a) P(n) is true if $n = n_0$
				- (b) Whenever P(n) is true for $n_0 \le n \le k$, then P(n) is true for n = k + 1
		- We use the usual conventions:
			- (1) a $\le$ b means a < b or a = b
			- (2) a > b means b < a, and (b $\ne$ a)
			- (3) a $\ge$ b means b $\le$ a
- Important Convention:
	- “we shall assume from now on (unless otherwise stated) that all lower case roman letters $a, b,...,z$ are integers.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=10&annotation=QHPB4G32))
## (2) Proof by Induction
- “The Principle of Mathematical Induction. I will refer to this principle as PMI or, simply, induction.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=11&annotation=977ESZQZ))
- “I call the statement I want to prove a [[proposition]].” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=11&annotation=DTW3G2FT))
	- “might also be called a [[theorem]], [[lemma]] or [[corollary]] depending on the situation” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=11&annotation=7K7ZQNDM))

### Proposition 2.1
- If $n \ge 5, \text{ then } 2^n > 5n$
	- “Note that P(n) represents a [[statement]], usually an inequality or an equation but sometimes a more complicated assertion.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=11&annotation=BFETCKWJ))
- To slove PMI(a), Let P(n) = $2^n > 5n$  and $n_0 =5$. Then Slove
	- $2^{5} > 5(5)$ 
	- <mark style="background: #BBFABBA6;">32 > 25</mark>
- “The assumption (2.1) is called the [[induction hypothesis]]” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=12&annotation=9MKRGDBK))
	- That would be $2^n > 5n \text{ for } 5 \le n \le k$
	- “want to use it to prove that P(n) holds when $n = k + 1$.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=12&annotation=PPWFR6PH))
- Given $2^n > 5n$, let n = k. Goal is to get n = k + 1
	- $2^k > 5k$ (multiply both sides by 2)
	- $2^{k+1} > 10k$
	- Since $5 \le n \le k$, we know $k \ge 5$ which means $k \ge 1$. Multiplied by 5 gives $5k \ge 5$.
	- Therefore, 10k = 5k + 5k $\ge$ 5k + 5 = 5(k + 1)
	- $2^{k+1}$ $\gt$ 10k $\ge$ 5(k + 1)
		- $2^{k+1} \gt 5(k + 1)$
			- This proves that n = k + 1 finishing PMI (b)

### 8 major parts of proof by induction
- (1) “First state what proposition you are going to prove. Precede the statement by Proposition, Theorem, Lemma, Corollary, Fact, or To Prove:.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=13&annotation=AZQIKR66))
- (2) “Proof or Pf. at the very beginning of your proof.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=13&annotation=KH4PZZMP))
- (3) State you're using induction and “identify clearly P(n), the statement to be proved, the variable n and the starting value $n_0$.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=13&annotation=BKZQ5XUJ))
- (4) “Prove that P (n)holds when $n = n_0$” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=13&annotation=XJSIMKFL))
- (5) “Assume that P (n)holds for $n_0 ≤ n ≤ k$. This assumption will be referred to as the [[induction hypothesis]].”
- (6) “prove that P (n)holds when $n = k +1$.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=14&annotation=A3CICX6P))
- (7) “Conclude that since the conditions of the PMI have been met then P (n)holds for $n ≥ n_0$” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=14&annotation=2ICDLJ42))
- “Write QED or $\blacksquare$ or // or something to indicate that you have completed your proof.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=14&annotation=GAJY8MMU))
### Exercises
- Answers to exercises not found #archive
	- “Exercise 2.1.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=14&annotation=T6AFDHP2))
## (3) Elementary Divisibility Properties
### Definition 3.1
- [[Divisibility Properties]]
- d | n means there is an integer k such that n = dk. d $\nmid$ n means that d | n is false
- Note that a | b $\ne$ a/b. Recall that a/b represents the fraction $\frac ab$. 
	- The expression d | n may be read in any of the following ways
		- d divides n
		- d is a divisor of n
		- d is a factor of n
		- n is a multiple of d
	- Following 5 statements are equivalent
		- 2 | 6
		- 2 divides 6
		- 2 is a divisor of 6
		- 2 is a factor of 6
		- 6 is a multiple of 2

Alternative definitions
### Definition 3.2
- d | n $\iff$ n = dk for some k
### Definition 3.3
- d | n iff n = dk for some k
	- Note, all letters a, b, ..., z represent integers (as stated earlier in text)
### Definition 3.4
- d | n if n = dk for some k
	- In this definition, "if" is interpreted to mean "if and only if
 - All above definitions are acceptable
	 - $\iff$ = iff = if and only if

### Theorem 3.1 (Divisibility Properties)
- If n, m, and d are integers then the following statements hold
	- (1) $n | n$ (everything divides itself)
	- (2) $d | n$ and $n | m$ $\implies$ $d | m$ ([[transitivity]])
	- (3) $d | n$ and $d | m$ $\implies$ $d | an + bm$ for all a and b ([[linearity property]])
		- Given d = 2, n = 4, m = 6, a = 5, b = 1
			- 2 | $5*4 + 1*6$ = 2 | 26 = 13
		- a and b can be any integers
	- (4) $d | n$ $\implies$ $ad | an$ ([[multiplication property]])
	- (5) $ad | an$ and $a \ne$ $0$ $\implies$ d | n ([[cancellation property]])
	- (6) 1 | n (one divides everything)
	- (7) n | 1 $\implies$ n = $\pm 1$ (1 and -1 are the only divisors of 1.)
	- (8) d | 0 (everything divides zero)
	- (9) 0 | n $\implies$ n = 0 (zero divides only zero)
	- (10) If d and n are positive and d | n then d $\le$ n ([[comparison property]])

### Definition 3.5
- If $c = as + bt$ for some integers s and t, we say that c is a [[linear combination]] of a and b
	- Thus, statement 3 in Theorem 3.1 says that if d divides a and b, then d divides all linear combinations of a and b. In particular, d divides a + b and a- b. This will turn out to be a useful fact 

### Exercises
#archive
## (4) The Floor and Ceiling of a Real Number
- Functions
	- [[Floor]] is the greatest integer
	- [[Ceiling]] is the least integer
- “[[Kenneth Iverson]] introduced this notation and the terms floor and ceiling in the early 1960s — according to [[Donald Knuth]] (6) who has done a lot to popularize the notation” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=21&annotation=QNT9FUSS))

### Definition 4.1
- If x is any real number we define
	- $\lfloor x\rfloor$ = the greatest integer less than or equal to x
	- $\lceil x \rceil$ = the least integer greater than or equal to x
- “$\lfloor x\rfloor$  is called the floor of x and $\lceil x \rceil$  is called the ceiling of x” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=21&annotation=MZJ7CPE4))
	- “floor $\lfloor x\rfloor$ is sometimes denoted $[x]$ and called the greatest integer function.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=21&annotation=CDC9VXIC))

#### Examples
- ![[Screenshot 2023-08-17 at 11.09.44 PM.png]]
- “For a more detailed treatment of both the floor and ceiling see the book <mark style="background: #FFF3A3A6;">Concrete Mathematics</mark> [5].” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=21&annotation=JUQV9WV9)) #archive 

### (4.1)
- By definition of $\lfloor x \rfloor$
	- $\lfloor x \rfloor$ = max{n $\in$ $\mathbb{Z}$ | n $\le$ x}
- (4.2) If n is an integer
	- n = $\lfloor x \rfloor$ $\iff$ n $\le$ x $\lt$ n + 1
		- This just means that if "x" is not an integer such as 3.5
			- Then n = $\lfloor 3.5 \rfloor$ $\iff$ n $\le$ 3.5 $\lt$ n + 1
				- n in this case = 3
				- So 3 = $\lfloor 3.5 \rfloor$ $\iff$ 3 $\le$ 3.5 $\lt$ 4
		- If x = 4.0
			- Then 4 = $\lfloor 4 \rfloor$ $\iff$ 4 $\le$ 4 $\lt$ 5
- Above makes it clear that
	- $\lfloor x \rfloor$ $\le$ x holds for all x
	- $\lfloor x \rfloor$ = x $\iff$ x $\in$ $\mathbb{Z}$

### Lemma 4.1
- For all x $\in$ $\mathbb{R}$
	- $x - 1 < \lfloor x \rfloor \le x$
- Proof
	- When we let n = $\lfloor x \rfloor$, from 4.2, we have 
		- $n \le x \lt n +1$ (Replace n with $\lfloor x \rfloor$)
		- $\lfloor x \rfloor \le x \lt \lfloor x \rfloor +1$ 
			- We see immediately that $\lfloor x \rfloor$ $\le$ x
		- Using $x \lt \lfloor x \rfloor + 1$ (subtract 1 from both sides)
			- x - 1 < $\lfloor x \rfloor$ $\blacksquare$ 

### Definition 4.2
- Recall that the [[decimal representation]] of a positive integer a is given by $a = a_{n-1}a_{n-2}...a_1a_0$ where
	- (4.3) $a = a_{n-1}10^{n-1} + a_{n-2}10^{n-2} + ... + a_110 + a_0$
	- and the digits $a = a_{n-1}a_{n-2}...a_1a_0$ are in the set {0, 1, 2, 3, 4, 5, 6, 7, 8, 9} with $a_{n-1} \ne 0$. In this case, we say that the integer a is an n digit number or that a is n digits long

### Exercises
“Exercise 4.1” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=22&annotation=C3PJUTD5)) #archive
## (5) The Division Algorithm
### Theorem 5.1 (The Division Algorithm)
- [[Division Algorithm]]
- If a and b are integers and b > 0 then there exist unique integers q and r satisfying the two conditions:
	- (5.1) $a = bq + r$ $\text { and }$ 0 $\le$ r $\lt$ b
	- “In this situation q is called the quotient and r is called the remainder when a is divided by b.” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=23&annotation=DGGZYZHG))
- “One part is the EXISTENCE of integers q and r satisfying (5.1) and the second part is the UNIQUENESS of the integers q and r satisfying (5.1).” ([pdf](zotero://open-pdf/library/items/2QETGPJD?page=23&annotation=9VS62H68))

## (6) Greatest Common Divisor
## (7) The Euclidean Algorithm
## (8) Bezout's Lemma
## (9) Blankinship's Method
## (10) Prime Numbers
## (11) Unique Factorization
## (12) Fermat Primes and Mersenne Primes
## (13) The Functions sigma and tau
## (14) Perfect Numbers and Mersenne Primes
## (15) Congruences
## (16) Divisibility Tests for 2, 3, 5, 9, 11
## (17) Divisibility Tests for 7 and 13
## (18) More Properties of Congruences
## (19) Residue Classes
## (20) Z_m and Complete Residue Systems
## (21) Addition and Multiplication in Z_m
## (22) The Groups U_m
## (23) Two Theorems of Euler and Fermat
## (24) Probabilistic Primality Tests
## (25) The Base b Representation of n
## (26) Computation of a^N mod m
## (27) The RSA Scheme
## (A) Rings and Groups


## References
[^1]: https://en.wikipedia.org/wiki/Repunit#:~:text=In%20recreational%20mathematics%2C%20a%20repunit,more%20specific%20type%20of%20repdigit.
[^2]: https://www.britannica.com/science/perfect-number#:~:text=perfect%20number%2C%20a%20positive%20integer,numbers%20is%20lost%20in%20prehistory.