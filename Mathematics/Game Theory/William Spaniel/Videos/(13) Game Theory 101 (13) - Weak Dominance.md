---
Source:
  - https://youtube.com/watch?v=OlV190noZOw
Reviewed: false
---
## Solving Simultaneous Move Games
- Goal: find all Nash equilibria
- Iterated elimination of strictly dominated strategies never eliminates Nash equilibria.
	- This is why we are free to use it, and you should eliminate any strictly dominated strategy immediately

## Weak Dominance
- ![[Screenshot 2023-01-07 at 9.38.27 PM.png|500]]
	- ![[Screenshot 2023-01-07 at 9.39.07 PM.png|200]]
	- ![[Screenshot 2023-01-07 at 9.39.22 PM.png|200]]
	- Left is always at least as good as right and sometimes better for Player 2. This is referred to as weak dominance where Left weakly dominates right. If left were to strictly dominate right, it would require the indifference to be gone where if Player 1 chose down, Player 2 will always have a payoff of 2 regardless of choosing left or right. It's just as equally as good.

## Weak Dominance
- Left weakly dominates right for player two.
- That is, left is at least as good as right and sometimes better.

## Finding Nash Equilibrium
- Since Right is weakly dominated, we're left with
	- ![[Screenshot 2023-01-07 at 9.43.01 PM.png|300]]
- Since 3 > 2,  Player 1 will choose up resulting in
	- ![[Screenshot 2023-01-07 at 9.43.27 PM.png|300]]
	- Therefore, up-left is in Nash equilibrium

## Weak Dominance
- After using iterated elimination of weakly dominated strategies, any remaining Nash equilibrium must be a Nash equilibrium of the original game.
	- ...but there may be more Nash equilibria.
		- You won't know until you go back to the original game and check
		- Sometimes you could be accidentally eliminating Nash equilibrium from the game.

## Checking for other Nash Equilibria
- 