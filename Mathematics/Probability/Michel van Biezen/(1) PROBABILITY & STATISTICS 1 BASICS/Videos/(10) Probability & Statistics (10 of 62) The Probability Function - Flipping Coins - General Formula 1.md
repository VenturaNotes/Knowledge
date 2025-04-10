---
Source:
  - https://www.youtube.com/watch?v=7utYtIpTDSU
Reviewed: false
---

- ![[Mathematics/Probability/Michel van Biezen/(1) PROBABILITY & STATISTICS 1 BASICS/Videos/- Attachments/download.png]]
	- The number of outcomes = $2^{\text{number of coins}}$
		- So 1 coin gives 2 outcomes
		- 2 coins gives 4 outcomes
		- 3 coins gives $2^3$ or 8 outcomes
		- 4 coins gives $2^4$ or 16 outcomes
	- Notice the coefficients and notice the number of elements in the events. 
	- There is a lot of similarity between binomial expansions and the number of elements you find in the events of a sample space when you flip a certain number of coins
	- The coefficients in this [[binomial expansion]] should remind you of [[pascal's triangle]]
		- To develop pascal's triangle, you add 1 to both sides
		- For example, to solve the 4th row
			- When the first row is 1, 2, 1
			- The 4th row is 1, 1+2=3, 2+1=3, 1 or 1,3,3,1
			- Can keep expanding it this way
			- In the case of having 3 coins, you would use the 4th row
	- If you want to determine how many possibilities you have with a certain number of heads and tails when flipping a coin, you can use pascal's triangle to come up with the number, and therefore the probability. Adding them up all horizontally gives you the number of outcomes.
		- If your working with 6 coins (1, 6, 15, 20, 15, 6, 1)
			- P(4H, 2T) = $\frac{15}{64}$
	- We should be able to come up with a more general equation to find out the probability of any outcome for any number of coins flipped. We are going to do this in the next video. 