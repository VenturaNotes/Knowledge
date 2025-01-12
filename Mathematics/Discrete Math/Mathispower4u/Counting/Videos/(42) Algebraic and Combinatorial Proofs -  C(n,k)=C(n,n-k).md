---
Source:
  - https://www.youtube.com/watch?v=rgf9ubp_FJ8
Reviewed: false
---
- ![[Screenshot 2025-01-12 at 2.49.03 AM.png]]
	- Algebraic Proofs
		- Prove the [[binomial identity]] $n \choose k$ = $n \choose n-k$ 
		- Will use factorial definition for this
		- The explanatory proofs are typically called combinatorial proofs
	- Combinatorial proofs
		- #comment written for previous video
	- Combinatorial Proof
		- Why is this true? $n \choose k$ counts the number of ways to select k things from n choices. On the other hand, $n \choose n-k$ counts the number of ways to select $n-k$ things from $n$ choices. Are these really the same? Well, what if instead of selecting the $n-k$ things, you choose to exclude them. How many ways are there to choose $n-k$ things to exclude from $n$ choices. Clearly this is $n \choose n-k$ as well (it doesn't matter whether you include or exclude the things once you have chosen them). And if you exclude $n-k$ things, then you are including the other $k$ things. So the set of outcomes should be the same. Therefore, $n \choose k$ = $n \choose n-k$ 
	- Combinatorial Proof
		- Let's try the pizza counting example like we did above. How many ways are there to pick $k$ toppings from a list of $n$ choices? On the one hand, the answer is simply $n \choose k$. Alternatively, you could make a list of all the toppings you don't want. To end up with a pizza containing exactly $k$ toppings, you need to pick $n-k$ toppings to not put on the pizza. You have $n \choose n-k$ choices for the toppings you don't want. Both of these ways give you a pizza with $k$ toppings, in fact all the ways to get a pizza with $k$ toppings. Thus, these two answers must be the same: $n \choose k$ = $n \choose n-k$ 
- ![[Screenshot 2025-01-12 at 2.50.59 AM.png]]
	- Combinatorial Proofs
		- You can also prove (explain) this identity using bit strings, subsets, or lattice paths. The bit string argument is nice: $n \choose k$ counts the number of bit strings of length $n$ with k 1's. This is also the number of bit string of length $n$ with k 0's (just replace each 1 with a 0 and each 0 with a 1). But if a string of length $n$ has k 0's, it must have $n-k$ 1's. And there are exactly $n \choose n-k$ strings of length $n$ with $n-k$ 1's.
			- Therefore, $n \choose k$ = $n \choose n-k$ 
