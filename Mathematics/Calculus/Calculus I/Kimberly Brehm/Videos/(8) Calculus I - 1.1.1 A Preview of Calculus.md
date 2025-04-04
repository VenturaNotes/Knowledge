---
Source:
  - https://www.youtube.com/watch?v=2-eZ6wkZrh8
Reviewed: false
---
- ![[Screenshot 2023-05-25 at 4.17.55 AM.png]]
	- What is [[Calculus]]?
		- Calculus is the mathematics of change
		- In any course prior to Calculus, we may be interested in finding the area of a figure or the speed of an object traveling at a constant speed.
		- In Calculus we would want to find the area at a specific moment in time of an object that is increasing or the speed of an object at a specific moment in time of an object that is decelerating
		- There are two main "problems" in calculus, which will introduce on the following slides
			- The [[tangent line problem]]
			- The [[area problem]]
- ![[Screenshot 2023-05-25 at 4.18.43 AM.png]]
	- The tangent line problem
		- In Algebra, we can find slope of a straight line very easily. But what happens if the line is curved? Then we find the slope of the [[tangent line]]...
		- How do we find the slope with just one point?
- ![[Screenshot 2023-05-25 at 4.19.52 AM.png]]
	- Almost the slope of the tangent line
		- On approximation is to find the slope of a [[secant line]]. Let's use Q = (2, 4).
			- Decent approximation of slope of the line is 3
- ![[Screenshot 2023-05-25 at 4.20.38 AM.png]]
	- Even closer to the slope of the tangent
		- Find the slope of RP where R = (1.5, 2.25)
- ![[Screenshot 2023-05-25 at 4.22.09 AM.png]]
	- Back to the tangent line problem
		- We can see that as the other point on our secant line gets closer and closer to point P, we get a better approximation of the slope of the tangent line.
		- How close can we get?
		- we can get infinitely close. As Q approaches P, our secant line more closely approximates the slope of our tangent line.
		- Using Calculus, we will calculate the [[limit]] of the slope of the tangent line as Q becomes infinitely close to P. This will be the exact value of the slope of the tangent line at P.
		- We will revisit this later.
- ![[Screenshot 2023-05-25 at 4.23.23 AM.png]]
	- [[The Area Problem]]
		- The other "big problem" in Calculus is the area problem.
		- We know how to find the area of rectangles, circles, etc. But how can you find the area under a curve from the interval of a to b?
- ![[Screenshot 2023-05-25 at 4.24.38 AM.png]]
	- The Area Problem
		- Let's break our graph into 3 rectangles using the left side of the interval...
		- The length of each rectangle is f(1) = 4.5, f(2) = 2, f(3) = 1.5, respectively. The width of each rectangle is 1.
		- The area is 1(4.5 + 2 + 1.5) = 8
- ![[Screenshot 2023-05-25 at 4.25.29 AM.png]]
	- The area Problem
		- Let's now break our graph into 6 rectangles using the left side of the interval...
		- The area is
- ![[Screenshot 2023-05-25 at 4.27.32 AM.png]]
	- Back to the Area Problem
		- As you increase the number of rectangles, the approximation tends to become better and better because the amount of area missed by the rectangles decreases. 
		- Your goal is to determine the limit of the sum of the areas of the rectangles as the number of rectangles increases without bound.
		- The notion of limits allows us to do just that.
		- We can move the point Q infinitely close to the point P to find the slope of the secant line or to increase the number of rectangles without bound to find the area under the curve.
		- Either method will provide us with an EXACT measure, rather than the approximations we have found up to this point.