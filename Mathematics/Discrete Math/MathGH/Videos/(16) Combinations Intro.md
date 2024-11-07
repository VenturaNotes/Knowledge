[Video](https://www.youtube.com/watch?v=EIpXtBjNMW4)

- ![[Screenshot 2024-01-04 at 11.33.51 PM.png]]
	- [[Combination|Combinations]]
		- Description [^1]
		- Generally smaller than permutations
	- How to calculate Combinations:
		- (1) [[Combinations with repetition]]: More difficult to calculate than when repetition is not allowed
			- We are going to show a special technique to calculate these that turns them into a special example of type 2 where repetition is allowed
			- Example: We have 5 flavors of ice cream: Chocolate, Strawberry, Vanilla, Cookie Dough, Cotton Candy. We can have three scoops and want to know how many variations there can be
			- Notice: There are n=5 things to choose from and we are choosing r=3 of them
			- The general form ends up being $r + n - 1 \choose r$ = $\frac{(r + n - 1)!}{r!(n-1)!}$
			- Consider the ice cream being in boxes, where we can control to either move past the box or scoop
				- So, if we pass on chocolate and strawberry, then say three scoops of vanilla we will have
		- (2) [[Combinations without repetition]]: Simply treat it like a permutation then modify it so order does not matter
			- Consider our example of a race: The race has 10 runners and now we want to determine how many different GROUPS of people could form the top 3 (we don't care about the places within the top 3)
			- Begin by calculating our permutation
			- Then recognize that many of these will be the same to us now
			- Reduce the permutations formula by how many ways the objects could be in order (because we don't care about the order anymore)
			- $\frac{n!}{(n-r)!}*\frac{1}{r!}=\frac{n!}{r!(n-r)!}=$$n \choose r$
				- This last notation is read as "n choose r"
- ![[Screenshot 2024-01-04 at 11.36.43 PM.png]]
	- Practice
		- (1) How many 5 card hands can be drawn from a standard deck of 52 cards?
		- (2) How many ways could I draw 1 diamond, 2 hearts, and 2 clubs?
## References
[^1]: [[(11) Practice with Permutations and Combinations]]