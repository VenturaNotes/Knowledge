---
Source:
  - https://youtube.com/watch?v=fwrAypC51ds
Reviewed: false
---
- ![[Screenshot 2023-09-06 at 10.11.47 PM.png]]
- Are these two sequences the same?
	- S = 101011011010111011000011000101010100
		- T = 101011011010111010000011000101010100
	- The two sequences are not the same because at index 17, S has a 1 while T has a 0.
		- It is much easier to prove the sequences are different because you just need to show one example. It's more difficult to prove the sequences are the same because you need to loop through every value in the sequence to ensure each one is identical
- Slightly Harder Problem
	- I have two DVD's which are supposed to be identical installation disks for the new Windows 10. How can I be sure that they are indeed identical?
		- You cannot verify bit by bit that 2 DVD's are the same in a 3.7 GB file. We can't assure that every entry is the same.
		- We are addressing the notion of a hash
			- md5sum
			- sha1sum
			- sha256sum
			- sha512sum
		- These are methods that hash a huge file down into a little string. They are not exact but work in a probabilistic setting
		- If 2 disks hash to the same string, then they are almost certainly identical
			- Nobody has every bit of 2 DVD's to see if whether or not they are bit by bit identical. That we don't do