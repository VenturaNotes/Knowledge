---
aliases:
  - binomial coefficients
---
## Synthesis
### Example
- (1) Find $5 \choose 4$ and show {1, 2, 3, 4, 5}
	- $5 \choose 4$ = 5
		- Number of ways to choose 4 elements from 5
	- Subsets
		- {1, 2, 3, 4}
		- {1, 2, 3, 5}
		- {1, 2, 4, 5}
		- {1, 3, 4, 5}
		- {2, 3, 4, 5}

## Source [^1]
- The binomial coefficient represents the number of [[combination|combinations]] of n objects taken k at a time, and is read “n choose k.” ^18f898
## Source [^2]
### Description
- Formula
	- $$\binom nk = \frac{n!}{k!(n-k)!}$$
	- Restrictions
		- n is a non-negative integer
		- k $\in$ {0, ..., n}

## Source[^3]
- Can be represented as $C(n,k)$
- True formula
	- $n \choose k$ = $n \choose {n-k}$ 

### Examples
- (1) Using the [[binomial theorem]], find the coefficient of $x^2y^5$ in $(2x +y)^7 = \Sigma_{k=0}^7$ $7 \choose k$ $(2x)^k$ $y^{7-k}$
	- (a) Finding variables
		- $\textcolor{hotpink}{\text{n = 7}}$, $\textcolor{orange}{\text{k = 2}}$ 
			- Given
				- $(2x +y)^7 = \Sigma_{k=0}^7$ $\textcolor{hotpink}{7} \choose k$ $(2x)^\textcolor{orange}{k}$ $y^{7-\textcolor{orange}{k}}$
				- $x^\textcolor{orange}{2}y^5$ 
			- Binomial Theorem
				- $(x+y)^n$ = $\Sigma_{k=0}^n$ $\textcolor{hotpink}{n} \choose k$ $x^ky^{n-k}$ 
	- (b) Plugging in when $\textcolor {orange} {\text{k = 2}}$ 
		- $\textcolor{hotpink}{7} \choose \textcolor{orange}{2}$$(2x)^\textcolor{orange}{2}y^{7 -\textcolor{orange}{2}}$
			- = $7 \choose 2$$4x^2y^5$ 
		- Solution
			- 4$7 \choose 2$
- (2) Find $3 \choose 2$ and show {1, 2, 3}
	- $3 \choose 2$ = 3
	- Subsets
		- {1, 2}
		- {1, 3}
		- (2, 3)

## Source[^4]
- (2) What is the coefficient of $x^5$ in the expansion of $(2 - x)^7$
	- Variation 1
		- $(2 - x)^7$ = $\Sigma_{k=0}^{7}$$7 \choose k$$2^k$$(-x)^{7-k}$ 
		- Since we have $x^5$
			- Using $(-x)^{7-k}$ 
			- 7-k = 5
				- k = 2
		- Plugging in
			- $7 \choose 2$$2^2(-x)^5$
		- Finding coefficient (ignore variables)
			- $7 \choose 2$$4*(-1)^5$ 
				- = -4$7 \choose 2$ 
				- Used [[Exponent|Rules of Exponent]]
		- Using formula on $7 \choose 2$
			- = $\frac{7!}{2!(7-2)!}$
			- = $\frac {7!}{2!*5!}$
			- = $\frac {7*6}{2}$
			- = 21
		- Solution
			- $21*-4 = -84$ 
	- Variation 2
		- $(2 - x)^7$ = $\Sigma_{k=0}^{7}$$7 \choose k$$(-x)^k$$(2)^{7-k}$ 
			- The $x$ and $y$ variables are switched from previous variation
		- Since we have $x^5$
			- $(-x)^k$ 
				- k = 5
		- Plugging in
			- $7 \choose 5$$(-x)^5(2)^2$
			- = $4$$7 \choose 5$$(-x)^5$
		- Using formula on $7 \choose 5$ (same as C(7,2) because $n \choose k$ = $n \choose n-k$)
			- =$\frac {7!}{5!(7-5)!}$
			- $=\frac{7!}{5!*2!}$
			- $=\frac{7*6}{2}$
			- $= 21$ 
		- Solution
			- $-4*21$ = $-84$ 
## References

[^1]: https://math.libretexts.org/Bookshelves/Combinatorics_and_Discrete_Mathematics/Applied_Discrete_Structures_(Doerr_and_Levasseur)/02%3A_Combinatorics/2.04%3A_Combinations_and_the_Binomial_Theorem
[^2]: [[Home Page - Open Data Structures (in Java) by Pat Morin#^f1b1p2]]
[^3]: [[(10) Counting Subsets and the Binomial Theorem (full lecture)]]
[^4]: [[(12) Mathematical Reasoning - Test 1 Review]]
