[Video](https://youtube.com/watch?v=aqQj-3bSv7k)

- When propositional logic fails
	- If i say,
		- All candy made with chocolate is delicious
		- M&M's are made with chocolate
	- Does it follow that M&M's are delicious?
- We can't model this relationship with propositions.
- This is where we need predicate logic which include:
	- Variables: 
		- x, y, z, these are the subjects of the statement(s)
	- Predicates: 
		- a property the variable can have. (ex. "is greater than 3")
	- Quantifiers
		- covered in the next video
- Predicates
	- Statements involving variables, such as "x < 2" and "x + y = z" are often found in mathematical assertions, in computer programs and in system specifications. The statements are neither true nor false when the values of the variables aren't specified.
		- If x = 5, the "x < 2" statement would be False
	- The statement "x is less than 2" has two parts. First, the variable x is the subject of the statement. The second part, the predicate "is less than 2" refers to the property that the subject of our statement can have. The predicate, "is less than 2" can be denoted by P(x), where P denotes the predicate and x is the variable.
- Propositional Functions
	- Propositional functions become propositions (and have truth values) when their variables are each replaced by a value from the domain (or bound by a quantifier, as we will see later)
		- (My Note): Propositional function that becomes a proposition when we replace the variable w/ some value from the domain
	- The statement P(x) is said to be the value of the propositional function P at x.
	- For example, let P(x) denote "x > 0" and the domain be the integers.
	- Then
		- P(-3) is false
			- -3 > 0 F
		- P(0) is false
			- 0 > 0 F
		- P(3) is true
			- 3 > 0 T
	- Often the domain is denoted by U. So in this example U is the integers (domain).
- Examples of propositional functions
	- Let "x + y = z" be denoted by R(x, y, z) and U (for all three variables) be the integers. Find these truth values
		- R(2, -1, 5)
			- 2 + -1 = 5
				- 1 = 5
					- FALSE
		- R(3,4,7)
			- 3 + 4 = 7
				- 7 = 7
					- TRUE
		- P(x, 3, z)
			- Not a proposition
				- Need to give values to each value to turn the propositional function into a proposition
			- In a propositional function, all variables need to be assigned to become a proposition
	- A proposition has a truth value of true or false
- Compound Expressions
	- Connectives from propositional logic carry over to predicate logic. If P(x) denotes "x > 0," find these truth values:
		- ![[Screenshot 2022-12-17 at 6.42.54 PM.png]]
	- Expressions with variables are not propositions and therefore do not have truth values. For example,
		- ![[Screenshot 2022-12-17 at 6.43.21 PM.png]]
	- When used with quantifiers (to be introduced next), these expressions (propositional functions) become propositions.