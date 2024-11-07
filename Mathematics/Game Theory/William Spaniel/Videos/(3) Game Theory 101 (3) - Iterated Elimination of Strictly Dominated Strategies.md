[Video](https://youtube.com/watch?v=O8T9spKHVWQ)

- Keeping quiet in The Prisoner's Dilemma was a strictly dominated strategy
- Iterated Elimination of Strictly Dominated Strategies (IESDS Game)
	- ![[Screenshot 2023-01-07 at 7.00.25 PM.png]]
	- Each player has 3 strategies
	- Leads to 9 different outcomes
	- Player 2 should never play "Right" because "Right" is always worse than "Center". If Player 1 chose "Up", 4 > 3, if player 1 chose "Middle", 3 > 2, if player 1 chose "Down", 8 > -1.
		- ![[Screenshot 2023-01-07 at 7.30.22 PM.png|400]]
	- Player 1 knows Player 2 will never play "Right". Therefore, Player 1 should never play "Down" because "middle" is strictly dominates "Down".
		- ![[Screenshot 2023-01-07 at 7.30.39 PM.png|400]]
	- Player 2 can now infer that Player 1 will never play "Down". Then when choosing between Left and Center, Player 2 would never want to play left since Center has higher numbers
		- ![[Screenshot 2023-01-07 at 7.32.12 PM.png|400]]
	- With Player 1 knowing this, then Player 1 will choose middle since 3 > 1.
		- ![[Screenshot 2023-01-07 at 7.33.08 PM.png|400]]
	- This will give us a solution of middle-center giving the players 3 points a piece in the game.
		- ![[Screenshot 2023-01-07 at 7.33.40 PM.png]]

## Iterated Elimination of Strictly Dominated Strategies
- This process is called IESDS.
- If you ever see a strictly dominated strategy, eliminate it immediately.
	- Order does not matter.
	- If IESDS leads to a single outcome, you will arrive at that outcome whether you eliminate strategy #1 or strategy #2 first.
