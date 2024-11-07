[[(Organize) Comment]]

- If/else statements [^1]
	- General syntax
		```python
		if condition:
		    value = true-expr
		else:
		    value = false-expr
		```
		- If `condition` is true, the `true-expr` will be assigned to `value`. Otherwise, the `false-expr` will be assigned.
	- [[(Organize) Python#^2e19c9|Ternary Operator]] allows for a one-line conditional expression
		```python
		value = true-expr if condition else false-expr
		```
		- The `true-exp` will be assigned to `value` if the `condition` is true. Otherwise, the `false-expr` will be assigned
- Ternary Operator ^2e19c9
	- Uses tuples, dictionary and lambda, nested ternary operator
		- Nested ternary operator shows great example for regular if/then. This can be pasted in the normal if/else statements :) 
		- Mention this one `min = a < b and a or b`
		-  [^2]
- Assigning Variables
	- How to assign a string?
	- How to assign an integer?
	- How


- able to assign different types at once to variables [^3]
```python
a, b, c, d = 4, "geeks", 3.14, True
```
- On a side note, it's impossible to do `a,b = 5, a+5` since both variables are being declared at the same time.
- Important below [^4]
	- This is a way to assign equal variables
		- grade_1 = grade_2 = grade_3 = average = 0.0
	- This method is called "unpacking"
		- grade_1, grade_2, grade_3, average = 0.0, 0.0, 0.0, 0.0

hello will remain equal to 5 even if you change the other variables
```python
hello = hello2 = hello3 = 5

print(hello)
hello3 = 6
print(hello)
```
hello = hello2 = hello3 = 5
print(hello)
hello3 = 6
print(hello)

List Comprehension is a subject for python [^5]

## References

[^1]: https://www.golinuxcloud.com/python-if-else-one-line/
[^2]: https://www.geeksforgeeks.org/ternary-operator-in-python/
[^3]: https://www.geeksforgeeks.org/assigning-multiple-variables-in-one-line-in-python/
[^4]: https://stackoverflow.com/questions/30858392/initializing-variables-in-python
[^5]: https://www.w3schools.com/python/python_lists_comprehension.asp