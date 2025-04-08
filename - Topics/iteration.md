## Synthesis
- 
## Source [^1]
```
for i in range(10):
   print(i+1)
```
- This program uses iteration
```
count = 0

while count < 3:
    answer = input ("What is 2+2?")
    count += 1
    if answer =="4":
        print("Well done")
        break
    else:
        print("That isn't right")
```
- In iteration, there are two types, count controlled and condition controlled loops
	- This one is condition controlled
```
for i in range(10):
   print("I'm a celebrity")
   print("Get me out of here")
```
- This is count controlled

## Source[^2]
- A method uses iteration if it yields [[successive approximation|successive approximations]] to a required value by repetition of a certain procedure. Examples are fixed-point iteration and Newton's method for finding a root of an equation $f(x) = 0$ 

## Source[^3]
- (1) The repetition of a numerical or nonnumerical process where the results from one or more stages are used to form the input to the next. Generally the recycling of the process continues until some preset bound is achieved, or the process result is constantly repeated. This is one of the key ideas used in the design of numerical methods (see also ITERATIVE METHODS). 
- An iterative process is $\mathbf{m}$-stage if the new value is derived from $m$ previous values; it is $\mathbf{m}$-stage, sequential if the new value depends upon the last $m$ values, i.e.$$x^{k+1}=G k\left(x^{k}, x^{k-1}, \ldots, x^{k-m+1}\right)$$The iteration is stationary if the function $G k$ is independent of $k$, i.e. the new value is calculated from the old values using the same formula. For example,$$x^{k+1}=1 / 2\left(x^{k}+a / x^{k}\right)$$is a stationary, one-stage iteration (used for evaluating the square root of $a$ ); this is a particular application of Newton's method. The secant method is a stationary two-stage sequential iteration. False position is an example of a nonsequential iteration. 
- (2) (of a formal language). See Kleene star.
## References

[^1]: https://computerscienced.co.uk/site/ocr-computer-science-gcse-j277/2-2-programming-fundamentals-quizzes/2-2-programming-fundamentals-quiz-10-questions/
[^2]: [[Home Page - The Concise Oxford Dictionary of Mathematics 6th Edition by Oxford Reference]]
[^3]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]