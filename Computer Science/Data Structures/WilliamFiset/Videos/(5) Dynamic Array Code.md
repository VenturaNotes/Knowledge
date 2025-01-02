---
Source:
  - https://www.youtube.com/watch?v=tvw4v7FEF1w
Reviewed: false
---
- Image
	- Dynamic Array Source Code
	- Source Code Link:
		- Implementation Source code and tests can all be found at the following link:
			- github.com/williamfiset/data-structures
		- Note: Make sure you have understood part 1 from the Array series before continuing!
	- Example
		- In the array class. Designed an array class to support [[Generic|generics]] of type T. So whatever type of data we want in this array, it's fine.
		- Started with instance variables
		- There is two constructors
			- First one will initialize array to be of size 16.
			- The other one will be given a capacity which must be greater than or equal to 0.
			- Then we initialize the array and cast it to a type T.
		- Added a "SuppressWarnings" unchecked because of annoying generics in Java