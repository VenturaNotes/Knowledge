---
aliases: conditional probabilities
---
## Synthesis
- 
## Source[^1]
### Formula
- $$P(A|B) = \frac{P(A \cap B)}{P(B)}$$
## Source[^2]
- Example
	- Given
		- S = {1, 2, 3, 4, 5, 6}
		- A = {1, 3, 5}
		- B = {1, 2, 3}
		- $A \cap B$ = {1, 3}
	- Find $P(B|A) = \frac{P(A \cap B)}{P(A)}$ = $\frac{\frac26}{\frac36}$ = $\frac 23$
		- P(A) = $\frac 36$
		- $P(A \cap B)$ = $\frac 26$ 
			- Since events A and B have 2 sample points, there are 2 elements in the set
			- Then , we divide by the sample space of 4 giving $\frac 26$ )
## Source[^3]
- Find $P(A_1 \cap A_2 \cap A_3) = P(A_1)*P(A_2|A_1)*P(A_3|A_1 \cap A_2)$ = $\frac 36 * \frac 23 *\frac 12 = \frac16$
	- This is the case with 3 [[independent events]]
	- Given
		- S = {1, 2, 3, 4, 5, 6}
		- $A_1$ = {1, 2, 3}
		- $A_2$ = {2, 3, 4}
		- $A_3$ = {3, 4, 5}
		- $A_1 \cap A_2$ = $\frac 26$
			- Because 2 elements are outcomes when intersecting them in sample space of 6
	- We calculate
		- $P(A_1) = \frac 36$
			- 3 elements in A and sample space of 6
		- $P(A_2 |A_1) = \frac {P(A_1 \cap A_2)}{P(A_1)}$ = $\frac{\frac 26}{\frac36}$ = $\frac 23$ 
			- $P(A_1) = \frac 36$
			- $P(A_1 \cap A_2)$ = $\frac 26$
			- Intuitive approach
				- Result of $A_1$ is {1, 2, 3}
				- Since the overlap with $A_2$ is {2, 3}, there will be a $\frac 23$ chance that 2 or 3 will be selected from {1, 2, 3}
		- $P(A_3 |A_1 \cap A_2)$ = $\frac 12$ 
			- #comment I think we need to look at this one more intuitively
			- So we know the outcome of $A_1 \cap A_2$ is {2, 3}
			- Since $A_3$ has an outcome of {3, 4, 5}, and it's guaranteed at least {2, 3}, that means the chances of it being {3} is $\frac 12$ 
			- Interestingly $\frac{\frac 16}{\frac26}$ = $\frac 12$ 
- #question what kind of application could I use for this?
## Source[^4]
- $n$. Another name for posterior probability: the probability assigned to an event in accordance with Bayes' theorem in the light of empirical evidence as to its observed relative frequency. See also CONDITIONAL REASONING. Compare PRIOR PROBABILITY (2).

## References

[^1]: [[(45) L04.6 A Coin Tossing Example#^6e5c6f]]
[^2]: [[(55) Probability & Statistics (55 of 62) Conditional Probability - Example]]
[^3]: [[(56) Probability & Statistics (56 of 62) Conditional Probability - 'Theorem 1']]
[^4]: [[(Home Page) A Dictionary of Psychology 4th Edition by Oxford Reference]]