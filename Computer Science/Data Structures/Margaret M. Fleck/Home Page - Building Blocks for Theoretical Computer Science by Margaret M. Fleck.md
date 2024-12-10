---
Source:
  - https://mfleck.cs.illinois.edu/building-blocks/index-sp2020.html
  - zotero://open-pdf/library/items/ESNUMDJL?page=1&annotation=9IWLJXKE
Length: "273"
tags:
  - status/incomplete
  - type/textbook
Progress: "27"
---
## Preface
- “It teaches you how to read and write mathematical proofs.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=12&annotation=8FZW8YYK))
- Topics it teaches
	- [[Propositional logic]]
	- [[Predicate logic]]
	- [[set|sets]]
	- [[functions]]
	- [[relations]]
	- [[modular arithmetic]]
	- [[Graph|graphs]]
	- [[Tree|trees]]
	- [[algorithm analysis and complexity]]
	- [[automata theory]]
	- [[computability]]

### Why learn formal mathematics?
- “users need to be able to read and understand how the designs work.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=12&annotation=KA5ZHDF3))
- “when you come to design complex real software, you’ll have to document what you’ve done and how it works.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=12&annotation=9AJJ8BKQ))

### Everyone can do proofs
- “many proofs are very routine.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=13&annotation=YR3E7IJU))

### Is this book right for you?
- “book is designed for students who have taken an introductory programming class” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=13&annotation=TEFRCWM3))
- “If you already have significant experience writing proofs, including inductive proofs, this book may be too easy for you.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=14&annotation=ER26QPFL))

### For instructors
- “a central goal is to explain the process of proof construction clearly to students who can’t just pick it up by osmosis.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=14&annotation=5C5R3DDP))
- “it includes only core concepts and a selection of illustrative examples” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=14&annotation=VGGRZLZQ))

## (1) Math Review
- “This book assumes that you understood precalculus when you took it.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=16&annotation=QWW7IJ96))
	- factoring polynomials, geometry problems, trigonometric identities all important
		- Can look up on the internet
### (1.1) Some Sets
- Set of [[integers]]
	- “Z = {...,−3, −2, −1, 0, 1, 2, 3,...} is the integers.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=16&annotation=DHSQF3CF))
- [[Natural numbers]]
	- “N = {0, 1, 2, 3,...} is the non-negative integers, also known as the natural numbers.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=16&annotation=Q4VQYAMY))
- [[Positive Integers]]
	- “Z+ = {1, 2, 3,...} is the positive integers.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=16&annotation=75966PLD))
- [[Real numbers]] ^m6l8g4
	- $\mathbb{R}$
- [[Rational numbers]]
	- $\mathbb{Q}$
- [[Complex numbers]]
	- $\mathbb{C}$
- “a number is positive if it is greater than zero, so [[zero]] is not positive.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=17&annotation=9NLZKB9E)) ^y31dqg
- Non-negative excludes negative values but includes zero
- “In this book, natural numbers are defined to include zero.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=17&annotation=JCEBNDCU))
- “real numbers contain the integers, so a “real” number is not required to have a decimal part.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=17&annotation=BRBLPXXK))
- “infinity is not a number in standard mathematics.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=17&annotation=ETS29MX4))
- Rational numbers are the set of fractions $\frac pq$ where q can't be zero. Two fractions are the same number if the reduce to the same number in lowest terms
- Real Numbers
	- Contain rationals, irrational numbers ($\sqrt{2}, \pi$, e)
- Will assume $\sqrt{x}$ returns only positive square root of x
- Complex numbers
	- form $a + bi$ 
		- a and b are real numbers
		- i is the square root of -1
		- $i = \sqrt{-1}$
- To say variable x is real, we write $x \in \mathbb{R}$
	- y $\notin$ $\mathbb{Z}$ means y is not an integer
- “useful to select the real numbers in some limited range, called an [[interval]] of the real line.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=17&annotation=QDP4C4S3))
	- [[closed interval]]
		- $[a , b]$ is the set of real numbers from a to b, including a and b
	- [[open interval]]
		- (a, b) is the set of real numbers from a to b, not including a and b
	- [[half-open interval]]
		- $[a, b)$ and $(a, b]$ include only one of the two [[endpoint|endpoints]]
### (1.2) Pairs of reals
- The set of all pairs of reals is written $\mathbb{R}^2$
	- Contains pairs such as (-2.3, 4.7)
- Set of $\mathbb{R}^3$ contains triples of reals such as 8, 7.3, -9
- “In a computer program, we implement a pair of reals using an object or struct with two fields.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=18&annotation=77GX6UYR))
- When given a pair of numbers (x, y), need to know if it's a point in 2D space, a complex number, a rational number, or an interval of the real line
- “intended meaning affects what operations we can do on the pairs.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=18&annotation=R72BH7KP))
	- “if (x, y) is an interval of the real line, it's a set” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=18&annotation=JLZZDGS7))
		- $z \in (x, y)$  would mean that z is in the interval of (x, y)
			- Notation meaningless if (x, y) is a 2D point or a number
- If pairs are numbers, we can add them
	- 2D points and complex numbers
		- `(x, y) + (a, b) = (x + a, y + b)`
	- Rationals
		- `(x , y) + (a, b) = (xb + ya, yb)`
			- $\frac xy + \frac ab$ = $\frac {xb + ya}{yb}$
- $(x, y) \times (a, b)$
	- Multiply a pair of rationals
		- $(xa, yb)$
	- Multiply a pair of [[complex numbers]]
		- $(xa-yb, ya + xb)$
			- Formula for complex numbers multiplication is 
			- `(x+yi)(a+bi) = (xa - yb) + i(xb+ya)`
				- This should = `(xa - yb, xbi + yai)`
			- Example
				- Given expression (2-7i)(2+7i) this can be converted to a pair of complex numbers
					- (2,-7i) $\times$ (2, 7i)
					- Then using the formula above, we get (4- -49, 14i - 14i) = (53, 0i)
					- Written calculation shown here [^1]
		- $(x + yi)(a + bi)$ is $xa + yai + xbi + byi^2$. But $i^2$ = -1
			- This reduces to $(xa - yb) + (ya + xb)i$
- “you can also multiply two intervals of the real line. This carves out a rectangular region of the 2D plane, with sides determined by the two intervals.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=19&annotation=TTH3D2M8))

### (1.3) Exponentials and logs
#### Special Cases
- $b^0$ = 1
- $b^{0.5}$ = $\sqrt{b}$
- $b^{-1}$ = $\frac 1b$

#### Rules
- $b^xb^y = b^{x + y}$
- $a^xb^x = (ab)^x$
- $(b^x)^y = b^{xy}$
- $b^{(x^y)}$ $\ne$ $(b^x)^y$
	- Example ^wjg58a
		- $2^{3^5} = 2^{(3^5)}$ = $2^{243}$ 
		- $(2^3)^5 = 2^{15} = 32678$ 

#### Properties
- If b > 1, we can invert the function $y = b^x$ to get $x = log_by$ ("logarithm of y to the base b") ^rvpabl
- Logarithms appear in computer science as running times for fast algorithms
	- Used to manipulate numbers with very wide ranges such as probabilities
- Log function only takes positive numbers as inputs ^zfp0vs
- $logx$ with no explicit base always means $log_2x$ because analysis of computer algorithms makes such heavy use of base-2 numbers and powers of 2

#### Logarithmic Rules
- $b^{log_b(x)} = x$
- $log_b(xy) = log_b(x) + log_b(y)$
- $log_b(x^y) = ylog_b(x)$
- $log_b(x) = log_a(x)log_b(a)$
	- This is the same as $\log_a(x) = \frac{log_b(x)}{log_b(a)}$ [^2]
		- base (a) goes in the basement and argument (x) goes in the attic 
		- That is the change of base formula
	- It can sometimes be confusing whether to multiply by $log_b(a)$ or $log_a(b)$. 
		- To figure this out, decide if $log_bx$ or $log_ax$ is larger. Then you know if the last term is larger or smaller than one. For $log_ba$ and $log_ab$, one is larger than 1 and the other is smaller than 1
		- Example
			- Given $log_bx$ will equal $log_ax$ with one of the sides multiplied by $log_ab$ or $log_ba$ 
				- Let b = 3
				- Let a = 4
				- Let x = 5
			- Then
				- (1) $\log_bx = log_35 = 1.46497$ 
				- (2) $log_ax$=  $log_45$= 1.16096
				- (3) $log_ba$ = $log_34 = 1.26185$
				- (4) $log_ab$ = $log_43 = 0.79248$
			- Since (1) is larger than (2), (2) will be multiplied by (3) or (1) could be multiplied by (4)
	- The multiplier to change bases is a constant (does not depend on x
		- Shifts the curve up and down without changing shape
			- ![[Screenshot 2023-08-09 at 5.06.08 AM.png]]
			- In many computer science analysis, we don't care about [[constant multipliers]]. Since base changes multiply by a constant, this means we don't care what the base actually is.
				- “Thus, authors often write log x and don’t specify the base.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=20&annotation=XVK9ICUE))
### (1.4) Some handy functions
- “Suppose that k is any positive integer. Then k [[factorial]], written k!, is the product of all the positive integers up to and including k” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=20&annotation=ISGAY4V2))
	- $k!=1*2*3*...*(k-1)*k$
	- 0! defined to be 1
	- Example
		- $5! = 1*2*3*4*5 = 120$
- Let's say we have a set S containing n objects, all different.
	- There are n! [[Permutation|permutations]] of these objects. 
		- n! ways to arrange the objects into a particular order
		- There are $\frac {n!}{k!(n-k)!}$ ways to choose k (unordered) elements from S. It's abbreviated as $n \choose k$. 
			- This is a [[binomial coefficient]] that represents the number of [[Combination|combinations]] [^3]
- [[Max function]] returns largest of inputs
	- Examples
		- f(x) = max(x^2, 7)
			- f(3) = 9
			- f(2) = 7
	- [[Min function]] is similar
- [[Floor function]] and [[ceiling function]]
	- “Both functions take a real number x as input and return an integer near x” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=21&annotation=D8KJKKQ3))
	- “The floor function returns the largest integer no bigger than x” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=21&annotation=YTTJU9QR))
		- Rounds down x converting it to an integer
			- $\lfloor x \rfloor$
	- Examples of floor function
		- 3.75 $\to$ 3
		- 3 $\to$ 3
		- $-3.75$ $\to$ $-4$
	- Ceiling function rounds upwards
		- $\lceil 3.75 \rceil$ = 4
		- $\lceil 3\rceil$ = 3
		- $\lceil-3.75\rceil$ = -3
- Most programming languages have these two functions and
	- function rounds to nearest integer
	- "truncates" i.e. rounds towards zero
- Difference between truncate and floor [^4]
	- floor(-2.6) = -3
		- Rounds down to nearest integer
	- truncate(-2.6) = -2
		- Rounds in direction of zero
- “[[Round]] is often used in statistical programs. [[Truncate]] isn’t used much in theoretical analyses.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=21&annotation=IK52BFTE))
### (1.5) Summations
- If $a_i$ is some formula that depends on i, then 
	- [[Summation]] Examples
		- $\Sigma_{i=1}^{n}a_i = a_1 + a_2 + a_3 + ... + a_n$
		- $\Sigma_{i=1}^{n}\frac {1}{2^i} = \frac 12 + \frac 14 + \frac 18 ... + \frac {1}{2^n}$
	- [[Product]] examples
		- $\Pi_{k=1}^n \frac {1}{k} = \frac 11 * \frac 12 * \frac 13 *... * \frac 1n$ 
- Some sums can be expressed in [[closed form]] (without summation notation)
	- ![[Screenshot 2023-08-18 at 1.21.05 PM.png|200]]
		- This is also a geometric series
- Formula is a specific example of a pattern called [[geometric series]]. For any real number $r \ne 1$
	- ![[Screenshot 2023-08-18 at 1.27.33 PM.png]]
	- ![[Screenshot 2023-08-18 at 1.28.46 PM.png]]
- In Calculus, we have seen infinite versions of geometric series formulas
	- In class, always dealing with finite sums, not infinite ones
- When modifying the start value, the closed form must be adapted to add/subtract the values of the extra/missing terms
	- $\Sigma_{i=1}^{n} \frac {1}{2^i} = 1 - \frac{1}{2^n}$ 
		- When index starts at 1
	- $\Sigma_{i=0}^{n} \frac {1}{2^i} = 2 - \frac{1}{2^n}$ 
		- When index starts at 0
#### Tangent [^5]
- [[Sum of an infinite geometric series]]
	- $S = \frac{a}{1-r}$
		- S is the sum of the series
		- a is the first term of the series
		- r is the common ratio between successive terms
- [[Sum of a finite geometric series]]
	- $S = \frac {a(1-r^n)}{1-r}$
		- S is the sum of the series
		- a is the first term
		- r is the common ratio
		- n is the number of terms
- Using these formulas, we can find the closed form of the two summations above when the index starts at 1 and the index starts at 0
	- For $\Sigma_{i=1}^{n} \frac {1}{2^i} = 1 - \frac{1}{2^n}$ 
		- ![[Screenshot 2023-08-18 at 3.20.09 PM.png]]
	- For $\Sigma_{i=0}^{n} \frac {1}{2^i} = 2 - \frac{1}{2^n}$ 
		- ![[Screenshot 2023-08-18 at 3.25.57 PM.png]]
- 
#### Continued
- Be careful to check when your summation starts
- When covering mathematical induction, will prove how those closed forms are correct
- ![[Screenshot 2023-08-18 at 3.44.34 PM.png]]
	- Important closed form to know
	- ![[Screenshot 2023-08-18 at 3.43.42 PM.png|300]]
		- Visualized
### (1.6) Strings
- “In computer science, a [[string]] is a finite-length sequence of characters and its length is the number of characters in it.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=23&annotation=C7NUQRHD))
	- `pineapple` is a string of length 9
- Special symbol $\epsilon$ is used for string containing no characters (length 0)
	- “Zero-length strings may seem odd, but they appear frequently in computer programs that manipulate text data.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=23&annotation=WF5Z7MF4))
	- “a program that reads a line of input from the keyboard will typically receive a zero length string if the user types ENTER twice.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=23&annotation=B7SEENRR))
- “We specify [[concatenation]] of strings, or concatenation of strings and individual characters, by writing them next to each other” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=23&annotation=TXYSUM28))
	- When $\alpha$ = blue and $\beta$ = cat
		- $\alpha \beta$ = `bluecat`
		- $\beta$s = cats
- “A [[bit string]] is a string consisting of the characters 0 and 1.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=24&annotation=C7JC4RXW))
- “If A is a set of characters, then A* is the set of all (finite-length) strings containing only characters from A.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=24&annotation=JMF2C875))
	- A* also contains the [[empty string]] $\epsilon$ 
	- [[A-Star]]
- “Sometimes we want to specify a pattern for a set of similar strings.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=24&annotation=QMR8AH7T))
	- We use the shorthand notation called [[regular expressions]]
		- Two operations used
			- a | b means either one of the characters a and b
			- a* means zero or more copies of the character a
- “Parentheses are used to show grouping” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=24&annotation=LFS3FRAG))
	- “ab* specifies all strings consisting of an a followed by zero or more b’s:” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=24&annotation=NFSSYL58))
		- a, ab, abb, etc.
	- c(b|a)\*c specifies all strings consisting of one c, followed by zero or more characters that are either a's or b's, followed one c. E.g. `cc`, `cac`, `cbbac`, and so forth
### (1.7) Variation in notation
- “authors differ as to whether zero is in the [[natural numbers]].” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=24&annotation=DXXDCHG9))
- $\sqrt{-1}$ is named j over in ECE and physics, because i is used for current
- Default for logarithms outside computer science is e. In computer science, base is 2
- “In standard definitions of the real numbers and in this book, infinity is not a number” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=25&annotation=QG3U6XS5))
	- “∞ is sometimes used in notation where numbers also occur, e.g. in defining limits in calculus.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=25&annotation=IJNDL7WS))
	- “There are non-standard number systems that include infinite numbers.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=25&annotation=YLW35ADF))
		- “points at infinity are sometimes introduced in discussions of 2D and 3D geometry.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=25&annotation=AC3AR7TD))
- “[[Regular expressions]] are quite widely used in both theory and practical applications.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=25&annotation=2V9GTGAA))
	- Many variations of this notation
	- Other operations for a wider range of patterns
## (2) Logic
- Basic level of [[propositional logic]] and [[predicate logic]]
### (2.1) A bit about style
- “Mathematical style is best taught by example and is similar to what happens in English classes.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=26&annotation=8NXU3MIP))
- “Mathematical writing uses a combination of equations and also parts that look superficially like English.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=26&annotation=FNRSUXDA))
- “people from England think that “paraffin” is a liquid whereas that word refers to a solid substance in the US.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=26&annotation=KB5USTZT))
- Equation vs equivalent piece of mathematical English
	- “For example, ∧ is a shorthand symbol for “and.” The shorthand equations are used when we want to look at a complex structure all at once, e.g. discuss the logical structure of a proof.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=26&annotation=IUD89UCF))
	- When writing [[proof|proofs]], usually better to use the longer English equivalents as it's easier to read
### (2.2) Propositions
- “Two systems of logic are commonly used in mathematics: [[propositional logic]] and [[predicate logic]].” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=27&annotation=HKCP9BFD))
- “A [[proposition]] is a statement which is true or false (but never both!).” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=27&annotation=BFLA8B78))
	- Valid
		- "Urbana is in Illinois"
		- 2 $\le$ 15
	- Invalid: questions, variables, sentence fragments without verbs, arithmetic expressions (they all don't state a claim)
		- x $\le$ 9
		- "bright blue flowers"
		- 5 +17
- “lack of variables prevents propositional logic from being useful for very much, though it has some applications in[[ circuit analysis]], [[databases]], and [[artificial intelligence]].” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=27&annotation=T54F4FKH))
### (2.3) Complex propositions
- [[Complex propositions]]
- “Statements can be joined together to make more complex statements.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=27&annotation=NWIGM7YS))
	- "Urbana is in Illinois and Margaret was born in Wisconsin"
		- Represent each statement by a variable
		- p: "Urbana is in Illinois"
		- q: "Margaret was born in Wisconsin
		- p $\land$ q
	- Statement true when both p and q are true
		- ![[Screenshot 2023-08-19 at 1.49.16 AM.png]]
			- Given [[truth table]]
- $\lnot p$ shorthand for "not p"
	- $\lnot p$ true when p is false
- p $\lor$ q is shorthand for "p or q"
	- True when either one is true
		- ![[Screenshot 2023-08-19 at 1.50.33 AM.png]]
			- Given truth table
	- "[[or]]" is meant to be understood inclusively
- [[Exclusive or]]
	- ![[Screenshot 2023-08-19 at 1.51.33 AM.png]]
		- Truth table using $\oplus$
	- “important applications in computer science, especially in encoding strings of letters for security reasons.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=28&annotation=MCPI8XDS))
### (2.4) Implication
- [[Implication]]
- “Two propositions p and q can also be joined into the conditional statement.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=28&annotation=NCKF33ZB))
	- "If p, then q"
		- p called [[hypothesis]]
		- q is the [[conclusion]]
- Other ways of saying it
	- "if p, then q"
	- "p implies q"
	- "q follows from p"
- Shorthand $p \implies q$
	- ![[Screenshot 2023-08-19 at 1.53.46 AM.png]]
		- Truth table
- “The easiest way to remember the right output values for this operation is to remember that the value is false in exactly one case: when p is true and q is false.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=29&annotation=XLYFPVQZ))
	- “Normal English requires that conditional sentences have some sort of causal connection between the two propositions, i.e. one proposition is true because the other is true.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=29&annotation=ZG8JQ8FU))
	- “In [[mathematical English]], this statement is just fine: there doesn’t have to be any causal connection.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=29&annotation=9JXTIQWX))
		- "If Urbana is in Illinois, then Margaret was born in Wisconsin"
- “Unless we make a special effort to build a model of time, propositional logic is timeless.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=29&annotation=D7WQZXH3))
	- “mathematical proofs normally discuss a world that is static.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=29&annotation=YIDXDJCQ))
	- “It has a cast of characters (e.g. variables, sets, functions) with a fixed set of properties, and we are just reasoning about what those properties are.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=29&annotation=ID5PKJMC))
		- “Only very occasionally do we talk about taking an object and modifying it.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=30&annotation=73XEG7RR))
- “In computer programming, we often see things that look like conditional statements, e.g. “if x>0, then increment y”” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=30&annotation=FZBPHFZ5))
	- “these are commands for the computer to do something” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=30&annotation=XRRALGS6))
		- “Formalizing what it means for a computer program to “do what it’s supposed to” requires modeling how the world changes over time.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=30&annotation=4YF59PPU))
	- “the similar-looking mathematical statements are timeless.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=30&annotation=BG2ZFYAS))
### (2.5) Converse, contrapositive, biconditional
- [[Converse]] of $p \implies q$ is $q \implies p$
	- Two statements not equivalent
		- ![[Screenshot 2023-08-19 at 1.59.12 AM.png]]
			- Truth table of converse
- “implications frequently hold in only one direction.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=30&annotation=IJFUDU7X))
- “Second, the phrase “p implies q, and conversely” means that p and q are true under exactly the same conditions. The shorthand for this is the [[biconditional]] operator p ↔ q.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=30&annotation=QX57ZKYH))
	- ![[Screenshot 2023-08-19 at 1.59.41 AM.png]]
		- Truth Table
- “biconditional is “p if and only if q.”” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=30&annotation=JRIA2HD3))
- [[Contrapositive]] of $p \implies q$ is $\lnot q \implies \lnot p$ 
	- Equivalent to original statement. Truth table shows why
		- ![[Screenshot 2023-08-19 at 2.00.33 AM.png]]
- Examples in English
	- Conditional: If it's below zero, my car won't start
	- Converse: If my car won't start, it's below zero
	- Contrapositive: If my car will start, then it's not below zero
### (2.6) Complex statements
- [[Complex statements]]
- “Very complex statements can be made using combinations of connectives.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=31&annotation=RXF68UNM))
	- Example
		- “If it’s below zero or my car does not have gas, then my car won’t start and I can’t go get groceries.”” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=31&annotation=2WSH5FLN))
			- ![[Screenshot 2023-08-19 at 2.12.52 AM.png]]
- “In particular, you apply the “not” operators first, then the “and” and “or”. Then you take the results and do the implication operations.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=32&annotation=SXAASZDM))
- Truth table for complex statements
	- ![[Screenshot 2023-08-19 at 2.16.16 AM.png]]
- “Truth tables are a nice way to show equivalence for compound propositions which use only 2-3 variables.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=32&annotation=K5FVUMMG))
	- If k variables, your table needs $2^k$ lines to cover all possible combinations of input truth values
		- Cumbersome for large numbers of variables
### (2.7) Logical Equivalence
- [[Logical equivalence]]
- “Two (simple or compound) propositions p and q are logically equivalent if they are true for exactly the same input values.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=32&annotation=7XRTV74C))
	- “shorthand notation for this is p ≡ q” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=32&annotation=FHUP69LM))
- “One way to establish logical equivalence is with a [[truth table]].” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=32&annotation=7JL2Q6JV))
- Implication has this truth table
	- ![[Screenshot 2023-08-19 at 2.20.29 AM.png]]
- $p \implies q$ is logically equivalent to $\lnot p \lor q$ ^5upwyw
	- ![[Screenshot 2023-08-19 at 2.20.59 AM.png]]
		- Truth table shows they match
- Two well known equivalences are [[De Morgan's Laws]]
	- $\lnot(p \land q)$ $\equiv$ $\lnot p \lor \lnot q$ 
	- $\lnot(p \lor q) \equiv \lnot p \land \lnot q$
- “Similar rules in other domains (e.g. set theory) are also called De Morgan’s Laws.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=33&annotation=XMYIVYBD))
- “they tell you how to  simplify the negation of a complex statement involving “and” and “or”.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=33&annotation=3ZLY8DNP))
- One of De Morgan's Laws shown in truth table
	- ![[Screenshot 2023-08-19 at 2.23.04 AM.png]]
- “T and F are special [[constant propositions]] with no variables that are, respectively, always true and always false.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=33&annotation=IAFNTP2B))
	- Since $p \land \lnot p$ is always false
		- $p \land \lnot p \equiv F$
- In mathematics, the [[equal operator]] (=) can only be applied to objects such as numbers
- When comparing logical expressions that return true/false values, you must use $\equiv$ ([[equivalent]])
	- “If use ≡ to create complex logical equations, use indenting and whitespace to make sure the result is easy to read.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=33&annotation=T9ZDZEUP))
### (2.8) Some useful logical equivalences
- $\land$ and $\lor$ are [[Commutative Property|commutative]]
	- $p \land q \equiv q \land p$
- [[Distributive laws]]
	- One rule for algebra
		- a(b + c) = ab + ac
	- Two rules in logic
		- ![[Screenshot 2023-08-19 at 2.28.44 AM.png]]
- “So, in logic, you can distribute either operator over the other.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=34&annotation=PFAWN49V))
	- “order of operations is less clear for the logic, so more parentheses are required.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=34&annotation=G7WFZ78V))
### (2.9) Negating propositions
- “important use of logical equivalences is to help you correctly state the [[negation]] of a complex proposition” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=34&annotation=34L4GLUQ))
	- “important when you are trying to prove a claim false or convert a statement to its contrapositive.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=34&annotation=X2YS9GVS))
	- “looking at the negation of a definition or claim is often helpful for understanding precisely what the definition or claim means.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=34&annotation=WV5WNLBY))
- “If M is [[regular]], then M is [[paracompact]] or M is not [[Lindelof|Lindelöf]].”” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=34&annotation=BLGN9ZQK))
	- r: "M is regular"
	- p: "M is paracompact"
	- l: "M is Lindelöf"
- Claim
	- $r \implies (p \lor \lnot l)$
- When starting negation
	- $r \implies (p \lor \lnot l)$ is $\lnot(r \implies (p \lor \lnot l))$
- Important [[equivalences]]
	- $\lnot(\lnot p) \equiv p$
	- $\lnot(p \land q) \equiv \lnot p \lor \lnot q$
	- $\lnot ( p \lor q) \equiv \lnot p \land \lnot q$
	- $\lnot (p \implies q) \equiv p \land \lnot q$
- ![[Screenshot 2023-08-19 at 2.40.38 AM.png]]
	- We find that "M is regular and M is not paracompact and M is Lindelöf"
	- We also derived a new logical equivalence
		-  $\lnot(r \implies (p \lor \lnot l))$ $\equiv$ $r \land \lnot p \land l$
			- “This is how we establish new equivalences when truth tables get unwieldy.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=35&annotation=VTST5RHA))
- “Knowing the [[mechanical rules]] helps you handle situations where your logical intuitions aren’t fully up to the task of just seeing instinctively what the negation should look like” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=35&annotation=BTEIB79P))
### (2.10) Predicates and Variables
- We need [[predicate logic]] which “allows variables and predicates that take variables as input.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=36&annotation=SIWGLEJH))
- “A [[predicate]] is a statement that becomes true or false if you substitute in values for its variables.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=36&annotation=GUE5ZICD))
	- $x^2 \ge 10$
		- Called P(x)
	- "y is winter hardy" 
		- Called Q(y)
		- True if y is "mint" but false if y is "tomato"
		- “A winter hardy plant is a plant that can survive the winter in a cold climate, e.g. here in central Illinois.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=36&annotation=K9MUIN27))
- “If we substitute concrete values for all the variables in a predicate, we’re back to having a proposition” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=36&annotation=J6SFRVKZ))
- “The main use of predicates is to make general statements about what happens when you substitute a variety of values for the variables.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=36&annotation=PTQHM3KY))
	- P(x) is true for every x
	- "For every integer x, $x^2$ $\ge$ 10" (false)
	- "For all x, 2x $\ge$ x" (false when x is an integer but true when x is a natural number)
- “In order to decide whether a statement involving [[quantifiers]] is true, you need to know what types of values are allowed for each variable.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=36&annotation=TKR36PKI))
	- “state the type of the variable explicitly when you introduce it, e.g. “For all natural numbers x, 2x ≥ x.”” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=36&annotation=DXWIFIPP))
	- When you don't need to specify the type
		- “Exceptions involve cases where the type is very, very clear from the context, e.g. when a whole long discussion is all about (say) the integers.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=36&annotation=89CZPFQZ))
	- “redundant type statement is a minor problem whereas a missing type statement is sometimes a big problem.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=36&annotation=NYH64P5E))
### (2.11) Other quantifiers
- “The general idea of a [[quantifiers|quantifier]] is that it expresses how many of the values in the [[Domain (Math)|domain]] make the claim true.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=36&annotation=KA8GADLF))
	- English quantifiers
		- A couple
		- A few
		- Many
		- Most
- “By contrast, mathematics uses only three quantifiers, one of which is used rarely.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=37&annotation=5TJGC6SG))
	- [[Universal quantifier]] "for all"
	- [[Existential quantifier]] "there exists"
		- There is an integer x such that $x^2 = 0$
- “Mathematicians, however, are happy to say things like that. When they say “there exists an x,” with certain properties, they mean that there exists at least one x with those properties” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=37&annotation=V7NLHIZP))
- “it is sometimes important to point out when one and only one x has some set of properties.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=37&annotation=EJEUZQZE))
	- “this uses the [[unique existence quantifier]], as in” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=37&annotation=LQUEQVYV))
		- "There is a unique integer x such that $x^2 = 0$"
- “Mathematicians use the adjective “unique” to mean that there’s only one such object (similar to the normal usage but not quite the same).” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=37&annotation=YFF5H3FB))
### (2.12) Notation
- [[Universal quantifier]] has shorthand $\forall$ 
	- ![[Screenshot 2023-08-19 at 2.54.36 AM.png]]
		- $\forall$ is the [[quantifiers|quantifier]]
		- “x ∈ R declares the variable and the set (R) from which its values can be taken, called its [[Domain (Math)|domain]] or its [[replacement set]].” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=38&annotation=VINJR37R))
			- “As computer scientists, we can also think of this as declaring the type of x, just as in a computer program.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=38&annotation=N3VFEHR2))
		- $x^2 + 3 \ge 0$ is the [[predicate]]
- [[Existential quantifier]] written $\exists$
	- ![[Screenshot 2023-08-19 at 2.56.07 AM.png]]
	- We don' write "such that" when the quantifier is in shorthand
- [[Unique existence quantifier]]
	-  ![[Screenshot 2023-08-19 at 2.58.46 AM.png]]
- “When existential quantifiers are written in English, rather than shorthand, we need to add the phrase “such that” to make the English sound right” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=38&annotation=SS5YFM6M))
	- There exists a real number y such that $y = \sqrt{2}$
	- ““Such that” is sometimes abbreviated “s.t.”” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=38&annotation=SS3NTDGJ))
	- Great for [[mathematical English]]
### (2.13) Useful notation
- “If you want to state a claim about two numbers, you can use two quantifiers as in” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=38&annotation=MGP5LQAN))
	- ![[Screenshot 2023-08-19 at 3.00.22 AM.png]]
	- Abbreviated to
		- ![[Screenshot 2023-08-19 at 3.00.31 AM.png]]
			- Means "for all real numbers x and y, x + y $\ge$ x" (which isn't true)
- “two variables x and y might contain different values, but it’s important to realize that they might also be equal.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=39&annotation=MBFTBH2Q))
	- ![[Screenshot 2023-08-19 at 3.02.17 AM.png]]
		- True
- Universals also have a contrapositive
	- $\forall x, \text{ if } p(x), \text{ then } q(x)$
	- Contrapositive
		- $\forall x, \text{ if } \lnot q(x), \text{ then } \lnot p(x)$
- Notice the quantifier stays the same, only if/then statement is transformed inside of it
### (2.14) Notation for D points
- “When writing mathematics that involves 2D points and quantifiers, you have several notational options.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=39&annotation=RAN98Z6U))
- $\forall x, y \in \mathbb{Z}$ can be read as "for any integers x and y"
	- can later refer to the pair (x, y)
- Could treat the pair (x, y) as a single variable whose [[replacement set]] is all 2D points
	- Following says that the real plane $\mathbb{R^2}$ contains a point on the unit circle
		- ![[Screenshot 2023-08-19 at 3.20.39 AM.png]]
	- Another approach
		- ![[Screenshot 2023-08-19 at 3.20.58 AM.png]]
			- “When you later need to make precise what it means to be “on the unit circle,” you will have to break up p into its two coordinates.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=39&annotation=NVCME94V))
			- “since p is a point on the plane, it must have the form (x, y), where x and y are real numbers.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=40&annotation=QYX2H4RD))
			- “This defines the [[component variables]] you need to expand the definition of “on the unit circle” into the equation x2 + y2 =1.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=40&annotation=FTYSE66I))
### (2.15) Negating statements with quantifiers
- Given $\forall x \in \mathbb{R}, x^2 \ge 0$ 
	- Claim will be false if at least one real number x such that $x^2 < 0$
	- "for all x in A, P(x)" is false exactly when some value x in A such that P(x) is false
	- When there exists x in A such that P(x) is not true
- [[Negation]] of [[quantifiers]]
	- ![[Screenshot 2023-08-19 at 3.29.33 AM.png]]
	- ![[Screenshot 2023-08-19 at 3.29.44 AM.png]]
- “So this is a bit like the de Morgan’s laws: when you move the negation across the operator, you change it to the other similar operator.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=40&annotation=6XNI89D9))
- “We saw above how to move negation operators from the outside to the inside of expressions involving ∧, ∨, and the other propositional operators.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=40&annotation=C7EAQNGV))
- “we now have a mechanical procedure for working out the negation of any random statement in predicate logic.” ([pdf](zotero://open-pdf/library/items/ESNUMDJL?page=40&annotation=IPNEUBFM))
	- Given
		- ![[Screenshot 2023-08-19 at 3.32.13 AM.png]]
	- Negation is
		- ![[Screenshot 2023-08-19 at 3.32.26 AM.png]]
### (2.16) Binding and scope
### (2.17) Variations in Notation
## (3) Proofs
### (3.1) Proving a universal statement
### (3.2) Another example of direct proof involving odd and even
### (3.3) Direct proof outline
### (3.4) Proving existential statements
### (3.5) Disproving a universal statement
### (3.6) Disproving an existential statement
### (3.7) Recap of proof methods
### (3.8) Direct proof: example with two variables
### (3.9) Another example with two variables
### (3.10) Proof by cases
### (3.11) Rephrasing claims
### (3.12) Proof by contrapositive
### (3.13) Another example of proof by contrapositive
## (4) Number Theory
### (4.1) Factors and multiples
### (4.2) Direct proof with divisibility
### (4.3) Stay in the Set
### (4.4) Prime numbers
### (4.5) GCD and LCM
### (4.6) The division algorithm
### (4.7) Euclidean algorithm
### (4.8) Pseudocode
### (4.9) A recursive version of gcd
### (4.10) Congruence mod k
### (4.11) Proofs with congruence mod k
### (4.12) Equivalence classes
### (4.13) Wider perspective on equivalence
### (4.14) Variation in Terminology
## (5) Sets
### (5.1) Sets
### (5.2) Things to be careful about
### (5.3) Cardinality, inclusion
### (5.4) Vacuous truth
### (5.5) Set operations
### (5.6) Set identities
### (5.7) Size of set union
### (5.8) Product rule
### (5.9) Combining these basic rules
### (5.10) Proving facts about set inclusion
### (5.11) An abstract example
### (5.12) An example with products
### (5.13) A proof using sets and contrapositive
### (5.14) Variation in notation
## (6) Relations
### (6.1) Relations
### (6.2) Properties of relations: reflexive
### (6.3) Symmetric and antisymmetric
### (6.4) Transitive
### (6.5) Types of relations
### (6.6) Proving that a relation is an equivalence relation
### (6.7) Proving antisymmetry
## (7) Functions and onto
### (7.1) Functions
### (7.2) When are functions equal?
### (7.3) What isn't a function?
### (7.4) Images and Onto
### (7.5) Why are some functions not onto?
### (7.6) Negating onto
### (7.7) Nested quantifiers
### (7.8) Proving that a function is onto
### (7.9) A 2D example
### (7.10) Composing two functions
### (7.11) A proof involving composition
### (7.12) Variation in terminology
## (8) Functions and one-to-one
### (8.1) One-to-one
### (8.2) Bijections
### (8.3) Pigeonhole Principle
### (8.4) Permutations
### (8.5) Further applications of permutations
### (8.6) Proving that a function is one-to-one
### (8.7) Composition and one-to-one
### (8.8) Strictly increasing functions are one-to-one
### (8.9) Making this proof more succinct
### (8.10) Variation in terminology
## (9) Graphs
### (9.1) Graphs
### (9.2) Degrees
### (9.3) Complete graphs
### (9.4) Cycle graphs and wheels
### (9.5) Isomorphism
### (9.6) Subgraphs
### (9.7) Walks, paths, and cycles
### (9.8) Connectivity
### (9.9) Distances
### (9.10) Euler circuits
### (9.11) Bipartite graphs
### (9.12) Variation in terminology
## (10) 2-way Bounding
### (10.1) Marker Making
### (10.2) Pigeonhole point placement
### (10.3) Graph coloring
### (10.4) Why care about graph coloring?
### (10.5) Proving set equality
### (10.6) Variation in terminology
## (11) Induction
### (11.1) Introduction to induction
### (11.2) An Example
### (11.3) Why is this legit?
### (11.4) Building an inductive proof
### (11.5) Another example
### (11.6) Some comments about style
### (11.7) A geometrical example
### (11.8) Graph coloring
### (11.9) Postage example
### (11.10) Nim
### (11.1) Prime factorization
### (11.12) Variation in notation
## (12) Recursive Definition
### (12.1) Recursive definitions
### (12.2) Finding closed forms
### (12.3) Divide and conquer
### (12.4) Hypercubes
### (12.5) Proofs with recursive definitions
### (12.6) Inductive definition and strong induction
### (12.7) Variation in notation
## (13) Trees
### (13.1) Why trees?
### (13.2) Defining trees
### (13.3) m-ary trees
### (13.4) Height vs number of nodes
### (13.5) Context-free grammars
### (13.6) Recursion trees
### (13.7) Another recursion tree example
### (13.8) Tree induction
### (13.9) Heap Example
### (13.10) Proof using grammar trees
### (13.11) Variation in terminology
## (14) Big-O
### (14.1) Running times of programs
### (14.2) Asymptotic relationships
### (14.3) Ordering primitive functions
### (14.4) The dominant term method
### (14.5) Big-O
### (14.6) Applying the definition of big-O
### (14.7) Proving a primitive function relationship
### (14.8) Variation in notation
## (15) Algorithms
### (15.1) Introduction
### (15.2) Basic data structures
### (15.3) Nested loops
### (15.4) Merging two lists
### (15.5) A reachability algorithm
### (15.6) Binary search
### (15.7) Mergesort
### (15.8) Tower of Hanoi
### (15.9) Multiplying big integers
## (16) NP
### (16.1) Finding parse trees
### (16.2) What is NP?
### (16.3) Circuit SAT
### (16.4) What is NP complete?
### (16.5) Variation in notation
## (17) Proof by Contradiction
### (17.1) The method
### (17.2) Root 2 is irrational
### (17.3) There are infinitely many prime numbers
### (17.4) Lossless compression
### (17.5) Philosophy
## (18) Collection of Sets
### (18.1) Sets containing sets
### (18.2) Power sets and set-valued functions
### (18.3) Partitions
### (18.4) Combinations
### (18.5) Applying the combinations formula
### (18.6) Combinations with repetition
### (18.7) Identities for binomial coefficients
### (18.8) Binomial Theorem
### (18.9) Variation in notation
## (19) State Diagrams
### (19.1) Introduction
### (19.2) Wolf-goat-cabbage puzzle
### (19.3) Phone lattices
### (19.4) Representing functions
### (19.5) Transition functions
### (19.6) Shared states
### (19.7) Counting states
### (19.8) Variation in notation
## (20) Countability
### (20.1) The rationals and the reals
### (20.2) Completeness
### (20.3) Cardinality
### (20.4) Cantor Schroeder Bernstein Theorem
### (20.5) More countably infinite sets
### (20.6) P(N) isn't countable
### (20.7) More uncountability results
### (20.8) Uncomputability
### (20.9) Variation in notation
## (21) Planar Graphs
### (21.1) Planar graphs
### (21.2) Faces
### (21.3) Trees
### (21.4) Proof of Euler's formula
### (21.5) Some corollaries of Euler's formula
### (21.6) K_{3,3} is not planar
### (21.7) Kuratowski's Theorem
### (21.8) Coloring planar graphs
### (21.9) Application: Platonic solids
## (A) Jargon
### (A.1) Strange technical terms
### (A.2) Odd uses of normal words
### (A.3) Constructions
### (A.4) Unexpectedly normal
## (B) Acknowledgements and Supplementary Readings
## (C) Where did it go? 
## References
[^1]: [[(11) Algebra - Ch. 24 - Complex Numbers (11 of 28) Multiplying Complex Conjugates]]
[^2]: [[(25) PreCalculus - Logarithmic Function (12 of 23) Solving Logarithms by Changing the Base]]
[^3]: [[binomial coefficient#^18f898]]
[^4]: [[Google's SGE]]
[^5]: ChatGPT