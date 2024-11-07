[Video](https://youtube.com/watch?v=aa8USttcDoE)

## Matching Pennies
- ![[Screenshot 2023-01-07 at 8.10.13 PM.png|400]]
	- Flipping a coin served as a mixed strategy for Nash Equilibrium
		- This was relatively easy to guess because all of those payoffs are 1s and -1s

## Zero-Sum Mixed Strategy Game
- ![[Screenshot 2023-01-07 at 8.13.27 PM.png|400]]
	- Different weights for each outcome

## Solving for Player 1's Mixed Strategy
- $EU_L = EU_R$ 
	- What we're trying to do with the mixed strategy for Player 1 is come up with a mixed strategy that makes Player 2's expected utility for "Left" (payoff for selecting "left" as a pure strategy) equal to her payoff (expected utility) for choosing "right" as a pure strategy.
- $EU_L = f(\sigma_U)$ 
	- Player 2's expected utility for "left", is a function of a mixed strategy (sigma u), which represents the probability that Player 1 plays "up"
	- If player 2 plays left, then she's at the mercy of player 1's decision between Up and Down to determine what her payoff is (-3 or 1)
- $EU_R = f(\sigma_U)$
	- If player 2 is selecting "Right", she's at the mercy of Player 1's decision to choose up or down. That is what the sigma u ($\sigma_U$) is representing. It is a probability that player 1 plays "Up" and a probability that player 1 plays "Down"
- We have three equations and three unknowns.
	- $EU_L$
		- Expected Utility for Left
	- $EU_R$
		- Expected Utility for Right
	- f($\sigma_U$)
		- Probability distribution which we're representing with sigma up
	- Se we can solve for them!

## Solving
- What is $EU_L = f(\sigma_U)$?
	- Some percentage of the time, player two gets -3
	- The rest of the time she gets 1.
	- $EU_L = \sigma_U(-3) + (1 - \sigma_U)(1)$
		- $\sigma_U$(-3)
			- Represents the probability that player 1 plays up
				- And that probability of the time, player 2 will get -3
		- +
			- Need to add payoff to what happens the rest of the time
		- (1 - $\sigma_U$)(1)
			- Represents the probability that player 1 plays down
				- Player 2 will be earning 1 point of utility
- What is $EU_R = f(\sigma_U)$?
	- Some percentage of the time, player two gets 2.
	- The rest of the time, she gets 0.
	- $EU_R = \sigma_U(2) + (1 - \sigma_U)(0)$
		- When player 1 goes up, player 2 gets "2"
		- When player 1 plays down, player 2 gets "0"
- $EU_L = EU_R$ 
	- $EU_L = \sigma_U(-3) + (1 - \sigma_U)(1)$
	- $EU_R = \sigma_U(2) + (1 - \sigma_U)(0)$
	- $\sigma_U(-3) + (1 - \sigma_U)(1)$ = $\sigma_U(2) + (1 - \sigma_U)(0)$
		- ![[Screenshot 2023-01-07 at 8.33.59 PM.png]]
			- If player 1 plays "Up" 1/6 of the time and "Down" 5/6 of the time, then Player 2 is indifferent between Left and Right regardless of her choice, she still winds up with the same expected utility. This mixture for player 1 leaves player 2 indifferent.

## Solving for Player 2's Mixed Strategy
- $EU_U = EU_D$
	- What is player 1's expected utility for Up and what is player 1's expected utility for down?
- $EU_U = f(\sigma_L)$
	- Player 1's expected utility for up is a function of player 2's mixed strategy. Solving for player 2's mixed strategy. This is represented by the function sigma L ($f(\sigma_L)$)
- $EU_D = f(\sigma_L)$
	- Player 1's expected utility for "down" is also a function of sigma L.
- We have three equations and three unknowns
	- So we can solve for them!

## Solving
- What is $EU_U = f(\sigma_L)$?
	- Some percentage of the time, player one gets 3.
	- The rest of the time, he gets -2.
	- $EU_U = \sigma_L(3) + (1 - \sigma_L)(-2)$
- What is $EU_D = f(\sigma_L)$?
	- Some percentage of the time, player one gets -1.
	- The rest of the time, he gets 0.
	- $EU_D = \sigma_L(-1) + (1 - \sigma_L)(0)$
- ![[Screenshot 2023-01-07 at 8.43.01 PM.png]]
	- If player 2 is playing left with probability of 1/3 and playing right with probability of 2/3, then player 1 is indifferent in choosing up or down. The equation ensures that the expected utility is the same whether he plays up or down.
 
## The Mixed Strategy Nash Equilibrium
- $<\sigma_U = 1/6, \sigma_L = 1/3>$
	- No one can profitably deviate and change their strategy and expect to do better based off of what everyone else is doing. This leads to a mixed strategy Nash Equilibrium