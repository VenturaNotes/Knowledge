[Video](https://www.youtube.com/watch?v=9UtInBqnCgA)


- Image
	- [[Anagram]]
		- "rat" and "car" not anagrams because even though they contain the same number of characters, "rat" has a "t" while "car" has a "c"
	- Want to count the occurrences of each character in both strings
		- Could use an [[array]] or a [[HashMap (python)|hashmap]]
			- hash map
				- Will have 2 hash maps (one for each string)
				- [[Key value]] in hash map is going to be the character in String S
					- The [[key]] is going to be the character
					- The [[value]] is going to be the count
				- Once we built the hash maps, we can then go through the keys and compare that the counts for each character are the exact same.
					- Just going to iterate through the keys of one of them (and make sure value of each key is the same)
					- If we make sure that each string is the same length, then we just need to iterate through one of the hash maps when comparing it to the other hash map
				- Time Complexity (S + T)
					- Need to iterate through both strings
				- Memory Complexity (S + T)
					- Hash maps of size S + T
				- Downside of solution is that we'll need some extra memory
				- `countS[s[i]] = 1 + countS.get(s[i], 0)`
					- This code adds 1