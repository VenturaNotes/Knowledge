## Synthesis
- 
## Source [^1]
- (Minimax Theorem) Due to Von Neumann, the theorem states: 
	- in a matrix game, with $E(x,y)$ denoting the expectation, where $x$ and $y$ are mixed strategies for the two players, then $$max_x ~~min_y~E(x,y)=min_y~~max_x~~E(x,y).$$
- By using a maximin strategy (see CONSERVATIVE STRATEGY), one player, R, ensures that the expectation is at least as large as the left-hand side of the equation. Similarly, by using a minimax strategy, the other player, C, ensures that the expectation is less than or equal to the right-hand side. Such strategies may be called optimal strategies for R and C. Since, by the theorem, the two sides of the equation are equal, then if R and C use optimal strategies the expectation is equal to the common value, which is called the value of the game.
- For example, consider the game given by the matrix$$\begin{bmatrix} 4 & 2 \\ 3 & 4 \end{bmatrix}.$$if $x^* = (\frac{1}{3}, \frac{2}{3})$, it can be shown that $E(x^*, y) \ge 10/3$ for all $y$. Also, if $y^* = (\frac{2}{3}, \frac{1}{3})$, then $E(x, y^*) \le 10/3$ for all $x$. It follows that the value of the game is $10/3$, and $x^*$ and $y^*$ are optimal strategies for the two players.
## References

[^1]: [[(Home Page) The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]