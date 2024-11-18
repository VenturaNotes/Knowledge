[Video](https://youtube.com/watch?v=RMF55lUCFZ8)

- ![[Screenshot 2023-09-26 at 10.58.23 PM.png]]
	- Good = All - Bad
		- Problem: How many integer solutions in non-negative integers to the equation:
		- Subject to the constraints
		- Answer
	- Trying to count a set of objects, call them "good"
		- Might be easier to count all the objects first and then count the bad ones
			- Subtract small one from big one
	- Solving the problem
		- Add an artificial object for $x_1$ and $x_2$ (takes 63 to 65)
		- To get $x_3$ $\ge$ 2, we need to make a set aside. Size of this is one
			- It's just one because if we give something and have set aside a one, then it will be greater than or equal to 2 (setting aside goes from 65 to 64)
		- Therefore, it should be $63 \choose 3$
			- Two artificial objects for $x_1$ and $x_2$ (takes 63 to 65)
			- Then make set aside for $x_3$ where $x_3$ is greater than 5 (so set aside 5)
				- 65 - 5 = 60
				- Then we subtract 1 to get 59 for the $59 \choose 3$ part