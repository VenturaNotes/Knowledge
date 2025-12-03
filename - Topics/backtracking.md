## Synthesis
- This is a type of problem that involves making a series of choices to find a solution, where you systematically explore all possible paths and "backtrack" when a path leads to a dead end.
	- #question What might be an easy backtracking problem initially with examples
## Source [^1]
- A technique for solving problems recursively.

## Source[^2]
- A property of an algorithm that implies some kind of tentative search for a goal, and the possibility that any search path may turn out to be a dead end; the algorithm then retreats back down the search path to try another path. The technique is generally suitable for solving problems where a potentially large but finite number of solutions have to be inspected. It amounts to a systematic tree search, bottom-up.
## Source[^3]
- Question 1
	- Backtracking algorithms
		- Knight tour problem
		- N queen problem
		- M Coloring problem
		-  #question What do these algorithms look like?
	- Tower of Hanoi is not a backtracking algorithm. It uses simple recursion
- Question 2
	- Backtracking can be used to solve combinatorial optimization problems. These problems involve finding the best possible solution from a finite set of possible solutions. These problems often require exploring a large solution space to determine the optimal solution.
- Question 3
	- Backtracking may lead to a solution that is suboptimal. When using backtracking to solve a problem, the algorithm explores different possibilities and choices in a systematic manner. It makes choices at each step and backtracks if those choices don't lead to a valid or desired solution. While backtracking can help find solutions, there's no guarantee that the solution it eventually finds is the best or optimal solution.
- Question 4
	- Backtracking is best suited for solving problems that involve exploring all possible solutions within a search space. It is particularly effective when the problem requires finding one or more solutions among a large set of potential candidates by systematically trying out different options and undoing choices that lead to dead ends. Backtracking is commonly used when an exhaustive search is required and when there is a need to find a valid solution or all possible solutions.
		- #question Are there other efficient methods aside from backtracking? 
- Question 5
	- Backtracking can be used to solve sudoku puzzles
- Question 6
	- Breadth-first exploration is not a characteristic of the backtracking algorithm. Backtracking follows a depth-first exploration strategy, and the other options (Recursive Approach, depth-first exploration, and trial and error) are all characteristics that are associated with the backtracking approach.
		- #question Since when is it breadth-first exploration? I thought it was always breadth-first search
		- #question What does BFS look like?
- Question 7
	- Backtracking goes back to a previous step if the current step doesn't work
	- Backtracking is a technique used in solving problems where you systematically explore different possibilities by making choices at each step. If a choice leads to a dead end or an invalid solution, the algorithm "backs up" to a previous step (backtracks) and tries a different choice. This process continues until a valid solution is found or all possibilities have been explored.
- Question 8
	- The term "backtracking" was popularized and introduced to the field of computer science by American mathematician and computer scientist D. H. Lehmer. He used the term in his 1950 paper titled "A machine program for theorem-proving" published in the journal Communications of the ACM. Backtracking refers to the technique of systematically searching through a problem's solution space by trying out different possibilities and "backtracking" or undoing choices that lead to dead ends.
- Question 9
	- The backtracking algorithm is implemented by constructing a tree of choices known as the "search tree" or "state space tree." Each node in the tree represents a decision point or a possible solution, and the branches of the tree represent the different choices that can be made at each decision point. As the algorithm explores the tree, it backtracks (reverses its steps) whenever it encounters a dead end or a solution that doesn't meet the required conditions. This tree structure helps visualize the process of exploring various possibilities and finding a valid solution through systematic trial and error.                                 
- Question 10
	- When the backtracking algorithm finds a complete solution:It means the algorithm has figured out a way to solve the problem completely. The algorithm **either stops** looking for more solutions because it has already found one that works, or continues searching for other possible solutions.
## References

[^1]: [[(Home Page) Glossary by ada computer science]]
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: https://www.geeksforgeeks.org/quizzes/top-mcqs-on-backtracking-algorithm-with-answers/