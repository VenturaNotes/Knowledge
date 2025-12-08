## Synthesis
- 
## Source [^1]
- (height-balanced tree) A binary search tree such that for each node the heights of the left and right subtrees differ by at most one. Thus the balance of each node is $-1,0$, or +1 . During insertion or deletion, a node in an AVL tree may become critical or unbalanced and then the tree has to be reorganized to maintain its balanced property. The tree is named after its originators, Georgy Maximovitch Adel'son-Vel'skii and Yevgeney Mikhailovitch Landis.
## Source[^2]
- #comment It seems like this article has broken english 
- A self-balancing binary search tree where the difference between heights of left and right subtrees for any node cannot be more than one
	- #question What is meant by binary search tree here? Can't you just say binary tree here? 
### Example of an AVL Tree
- ![[Screenshot 2025-12-07 at 8.32.37 PM.png|400]]
	- #question How do you calculate the balance factors. Isn't the difference here between 12 and 18 the number 6? Or is height just based on distance between two nodes? 
	- Balance factors for different nodes:
		- 12: +1
		- 8: +1
		- 18: +1
		- 5: +1
		- 11: 0
		- 17: 0
		- 4: 0
	- Since all differences are between -1 and 1, the tree is an AVL tree
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: https://www.geeksforgeeks.org/dsa/introduction-to-avl-tree/