---
Source:
  - https://youtube.com/watch?v=q6RicK1FCUs
Length: 9 minutes, 31 seconds
tags:
  - type/video
  - status/complete
---
- Uses small example as swell as large examples with 3 discs
- Problem
	- 3 towers given
	- 1 of towers have stack of discs in decreasing order from bottom towards top
	- All discs must move from tower A to C
	- During any moment of time, a larger disc can't be kept over a smaller disc
	- An auxiliary tower is given in the middle to use for transferring disc
	- There can be any number of discs given in the first tower
- ![[Pasted image 20221217163206.png]]
- Solution for Single Disc
	- Move a disc from A to C
- Solution for 2 Disc
	-   Move a disc from A to B using C (if C is applicable)
	-   Move a Disc from A to C
	-   Move a Disc from B to C using A (if A is applicable)
- Solution for 3 Disc
	-   Move 2 Discs from A to B using C
	-   Move a Disc from A to C
	-   Move 2 Discs from B to C using A
- Solution for n Disc
	-   Move n-1 Discs from A to B using C
	-   Move a Disc from A to C
	-   Move n-1 Discs from B to C using A
- ![[Screenshot 2022-12-17 at 4.35.42 PM.png]]
- Solution for n Disc (in code)
```C
void TOH(int n, int A, int C)
{
		if(n>0)
		{
			TOH(n-1,A,C,B);
			printf("Move a Disc from %d to %d", A, C);
			TOH(n-1,B, A, C);
		}
}
```
- (%d is a format specifier in C language. It specifies the type of variable as decimal.)
- ![[Screenshot 2022-12-17 at 4.39.09 PM.png]]
	- You would use the bottom movements to solve a Tower of Hanoi with 3 discs
	- The code above would work with any number of discs
- Solution in python
```python
def TOH(n,A,B,C):
	if (n>0):
		TOH(n-1,A,C,B)
		print("Move a Disc from %d to %d" % (A,C))
		TOH(n-1, B, A, C)
```
- "From", "Using" and "To" is a great way to break this problem down overall
``
