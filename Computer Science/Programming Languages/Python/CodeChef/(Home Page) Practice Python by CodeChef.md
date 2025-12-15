---
Source:
  - https://www.codechef.com/practice/python
Length: "192"
tags:
  - status/complete
  - type/website
Reviewed: false
---
- Only Free problems solved (pro version is paid)
	- So 39% total problems solved
## Problems
- `print(21+40)`
	- Adds two numbers and prints the results
- `print("Coding, Chef!")`
	- Prints the text "Coding, Chef"
	- Text should be enclosed in single/double quotes when using `print` to print
- `print(5)` prints the number 5
- `print(10-3)` This prints the difference of 10-3
- `print("Hello World"` is the correct syntax
- To print the string variable named `num`, you directly use `print(variable_name)`
- `print(6/2)` divides two numbers
	- The "/" operator is used to perform division
- `print(Hello World)` not correct because it needs to be enclosed by double quotes
	- #comment single quotes should work fine here too
- `print(9*12)` prints the number 108 using arithmetic operations
- `print("Learn Coding on CodeChef")` message is printed to console
- Printed the following pattern below
```python
print("*")
print("**")
print("***")
print("****")
print("*****")

# Output
"""
*
**
***
****
*****
"""
```
- `print("Code", "Chef")`
	- Output: Code Chef
	- Multiple outputs are joined together using the "," symbol and they use " " as the delimiter.
		- #errata "delimiter" misspelled during practice
- `print(5,5)`
	- Prints "5 5" with single space between them
	- `print(5," ",5)` appears to print 3 spaces between 5s
		- #errata website says "2 spaces" but this answer seems incorrect through testing
- What does code achieve?
```python
print(8) 
print(13, end=" ") 
print(21)

# Prints one number on the first line, two numbers on the next line
# end=" " is used to not skip to a new line
```
- `print(7, "\n", 5)`
	- Used to move to a new line
- `print("Python","Programming")`
	- Prints `Python` and `Programming` on the same line with a space
- `print("Hello", "World", 5, "endl", 2)`
	- Prints `Hello World 5 endl 2`
- What is output of following code?
```python
print("Hello")
print(" World!")

# Output
"""
Hello
 World
"""
```
- Printing numbers 1 to 5 on same line with spaces (two answers)
	- `print(1,2,3,4,5)`
	- `print("1 2 3 4 5")`
- Print so each word is on a new line `I Love CodeChef`
```python
print("I")
print("love")
print("CodeChef")
```
- Write program to output squares from 1 to 5 on separate lines with hyphen
```python

# Method 1
print("1 - 1")
print("2 - 4")
print("3 - 9")
print("4 - 16")
print("5 - 25")

# Method 2
print(1,"-",1**2)
print(2,"-",2**2)
print(3,"-",3**2)
print(4,"-",4**2)
print(5,"-",5**2)
```
- Write program to output a square of stars of size 4
```python
print("****")
print("****")
print("****")
print("****")
```
- `age = 25`
	- The code age = 25 initializes the variable age with the value 25.
	- Storing the value 25 in the age variable
- Correct syntax to initialize a single character in Python
	- Python does not have a dedicated char data type like C or Java. Instead, a single character in Python is simply a string of length 1.
	- In Python, all characters are represented as strings using the str class.
- `print(7.0 / 2)` gives 3.5
	- When dividing a decimal value by an integer the result is a decimal value. As 7.0 is a double value the result will be 3.5, even if the value would have been 7(integer value) the result would still be 3.5 as single / does decimal division in python.
- Identify the incorrect syntax
```python
bool b = false
bool b = 1;
bool b = 2;

"""
Syntax above is all incorrect.
In Python we dont have to explicitly mention the data type hence var = "True"/"False" would do the work. And also we don't need ; in python.
"""
```
- `ch = 'B'`
	- Storing the character 'B' in the variable ch
	- The code ch = 'B' initializes the variable ch with the character 'B'
- `perimeter = 12.8`
	- In python, a double variable is declared just by specifying the variable name and its double value assigned to it. Also, semicolon is not required.
	- This is how a variable of type float is declared in python
		- #question Is it possible to declare a float variable without assigning the value? I don't think this is even considered declaring a variable.
- `num = 954200`
	- Declaring a variable of type long storing the above value
	- The correct way to declare a long variable in Python is simply by assigning the value using = (e.g., num = 954200). Python automatically treats integers as long if needed, so no special syntax is required.
- `b = True`
	- The correct syntax to declare a boolean variable is  (variable name)b = (value)True
- Dividing two variables
```python
x = 20
y = 6
print(x // y)
# Output: 3
```
- Converting temperature
```python
temperature = 25.5
print("Celsius -",temperature)
print("Kelvin -",temperature+273)

# Output
"""
Celsius - 25.5
Kelvin - 298.5
"""
```
- Area and perimeter of square
```python
print(4.5*4.5)
print(4.5*4)

# Output:
"""
20.25
18.0
"""
```
- `print(42)`
	- Outputs 42 on screen
- Program that takes an input and prints it to the output
```python
N = input()
print(N)
```
- Input two integers and output their sum
	- #comment 
		- Uses [[input() (Python)|input()]] to take in input as a string `"3 5"`
		- [[split() (python)|split()]] will split the string with whitespaces into a list `["3", "5"]`
		- [[map() (Python)|map()]] applies the `int` function to each item in list converting them to integers
			- #question How does map work?
		- `a,b =`  unpacks the two integers from the result and assigns them variables `a` and `b`
			- #question What does unpacking mean?
```
a, b = map(int, input().split()) 
c = a + b
print(c)
```
- What will code produce if first line is 1 and 2nd line 2
	- Since the code is accepting input as `input`, `1` and `2` will be treated like strings so their addition will be treated as [[string concatenation]] giving the result of `12`
```python
a = input()
b = input()
c = a + b
print(c)
```
- Chef and Instant Noodles problem
```python
a,b = map(int, input().split())
print(a*b)
```
- Counting Courses
	- Each language has 2 courses. So if you have 10 languages, you'll have 20 courses
- Printing number of courses
	- `print(int(input())*2)`
- Scope of code is defined through indentation
	- Indentation using tabs is used in Python to define code blocks, similar to spaces.
		- #question Did they mean similar to curly braces instead?
- Grade Assignment Logic
	- The code assigns the grade 'A' if the marks are greater than or equal to 60, otherwise 'B' is assigned.
```python
marks = 75
if marks >= 60:
    grade = 'A'
else:
    grade = 'B'
```
- Conditional Statements
```python
x = 62
y = 62
if x > y:
    print("x is greater")
else y > x: # #This throws an error. Need muiltple elif to check for multiple cases
    print("y is greater")
else:
    print("both are equal")
```
- The 'elif ' part in an if-else if-else ladder is used to check an additional condition if none of the previous conditions is true
- Output of following code
```python
a = 15
if a > 10:
    print("Greater than 10")
if a > 5:
    print("Greater than 5")

# Output:
"""
Greater than 10
Greater than 5 
"""
```
- Output of following code
```python
x = 5
y = 5
if x > y:
    print("x is greater")
elif y >= x:
    print("y is greater")
else:
    print("Both are equal")

#Output
"""
y is greater
"""
```
- Purpose of 'if-elif-else' ladder is to check multiple conditions sequentially
- Checks if number is odd
	- `if (num % 2 != 0)`, then it is odd.
- Positive and Negative
```python
x = int(input())
if x == 0:
    print("Zero")
elif x > 0:
    print("Positive")
elif x < 0:
    print("Negative")
```
- Grades of a student
```python
# cook your dish here
x = int(input())
if x > 90:
    print("A")
elif x > 70:
    print("B")
elif x >= 40:
    print("C")
else:
    print("F")
```
- Finding average score
```python
x = map(float, input().split())
print(sum(x)/3)
```
- If `a` equals 2, print 9
	- == is the equality comparison operator.
	- Since condition is true, it prints 9
	- A single `=` sign is an assignment operator
```python
if a == 2:
    print(9)
```
- Chef and Brain Speed
```python
x,y = map(int,input().split())

if y > x:
    print("YES")
else:
    print("NO")
```
- Alice Happiness Condition
	- MCQ = multiple choice question
```python
if (X >= 2*Y):
    print("YES")

# Code below works the same as above.
"""
if (2*Y <= X):
    print("YES")
"""
```
- Alice and Marks
```python
x,y = map(int,input().split())
if x >= y*2:
    print("YES")
else:
    print("No")
```
- Is it `oneful` pair
	- (1, 55) Yes
	- (55, 1) Yes
	- (7, 13) Yes
	- These are all considered `oneful` pairs because using the formula $a+b+(a*b)=111$ will add up to 111 for the above
- `Oneful` pairs
```python
a,b = map(int,input().split())
if a+b+(a*b) == 111:
    print("YES")
else:
    print("NO")
```
- Loop and Print sequences
	- Prints numbers 0 to 4 with spaces
```python
count = 0
while count < 5:
    print(count, end=" ")
    count += 1
```
- Counter Using While Loop
```python
count = 0
while count < 5:
    print(count)
    count += 1

# Output
"""
0 
1 
2 
3 
4
"""
```
- While loop increment
	- #question Is there a difference between `end` and `endl`?
```python
x = 0
while x < 5:
    print(x, end=" ")
    x += 2

#Output
"""
0 2 4
"""
```
- In a while loop, the condition gets evaluated before each iteration
- If initial condition of while loop is false, the loop is skipped and code inside is not executed
- Suspicios Loop
	- Infinite loop because since initial value is 1 and it keeps increasing within the loop, `x` will never be less than or equal to 0 to end the loop
```python
x = 1
while x > 0:
    print(x, end="")
    x += 1
```
- Number evaluation
	- Loop runs exactly 5 times
```pyhon
x = 5
while x > 0:
    print(x, end=" ")
    x -= 1
```
- Printing using while
	- Prints even numbers from 10 to 2
```python
number = 10
while number > 0:
    print(number)
    number -= 2
```
- Print squares
```python
num = int(input())
count = 1
while count <= num:
    print(count*count, end=" ")
    count+=1
```
- Print factorial
	- #comment Optimization
		- Use Python's built-in factorial function
		- Much faster and optimized in C behind the scenes.
```python
x = int(input())
count = 1
total = 1
while count <= x:
    total*=count
    count+=1
print(total)

# Optimized version
"""
import math
x = int(input())
print(math.factorial(x))
"""
```
- Count Vowels
	- #question How could I optimize the below problem?
```python
x = input()
count = 0
tally = 0
while count < len(x):
    if "a" == x[count]:
        tally+=1
    elif "e" == x[count]:
        tally+=1
    elif "i" == x[count]:
        tally+=1
    elif "o" == x[count]:
        tally+=1
    elif "u" == x[count]:
        tally+=1
    count+=1
print(tally)
```
- Prints numbers from 1 to 10
```python
i = 1
while i <= 10:
    print(i)
    i = i + 1
```
- Add two numbers and output their sum
```python
t = int(input())
for i in range(0,t):
    a,b = map(int,input().split())
    print(a+b)
```
- A good roll of two dice is greater than 6
	- (4,4) and (3,4)
- Printing if dice roll is good (sum > 6)
```python
t = int(input())
for i in range(0,t):
    x,y = map(int,input().split())
    if (x+y) > 6:
        print("YES")
    else:
        print("NO")
```
- Drinking at least 2000ml of water
	- 2001ml and 2000ml are both answers
- Program for greater than or equal to 2000
```python
t = int(input())
for i in range(0,t):
    x =  int(input())
    if x >= 2000:
        print("YES")
    else:
        print("NO")
```
## References
