---
Source:
  - https://youtu.be/9HFbhPscPU0
Length: 10 minutes, 5 seconds
tags:
  - status/complete
  - type/video
---
- HashMap
	- A simple set of key-value pairs
		- Beans -> 1.85
		- Corn -> 2.38
		- Rice -> 1.92
	- We have beans, corn, and rice with a value next to them
		- A data structure for this kind of data
		- key is typically an integer or string (but can be any data type)
	- Important points
		- A HashMap is a set of key-value pairs
		- No duplicate keys
		- O(1) for add, get, delete functions
		- Also called dictionary, map, hash table, associative array
		- In Python, use dict (short for dictionary)
- Components of a Hashmap
	- Array - data structure used to store the data
	- Hash function - function to convert key into an array index
	- [[Collision handling]]
- Data
	-  Beans -> 1.85
	- Corn -> 2.38
	- Rice -> 1.92
- [[Hash Function]]
	- index = len(key) - 1
- Code
	- add('Beans', 1.85)
		- ![[Screenshot 2022-12-18 at 2.00.05 AM.png]]
	- get('Beans')
		- gets the index 4, and returns 2.38
	- add('Corn', 2.38)
		- ![[Screenshot 2022-12-18 at 2.00.44 AM.png]]
	- add ('Rice', 1.92)
		- Collision happens because rice has 4 characters in name, but corn does as well. Maps to the same cell in our array.
		- We can make each cell store a list of pairs in them
		- ![[Screenshot 2022-12-18 at 2.02.09 AM.png]]
		- Need to iterate through cell 3 to find key "rice" so that it returns 1.92 
		- Performance of HashMap is to keep as few items as possible in cell of array
			- Don't want to iterate through too many items
- A Better Hash Function
	- index =sum(ASCII value for each letter in key) % 5
- Python code for hash function
```python
for char in key:
	hash += ord(char)
hash %= 5
```
- Full python code
```python
class HashMap:
	def _init_ (self):
		self.size = 6
		self.map = [None] * self.size

	def _get_hash(self,key)
		hash = 0
		for char in str(key):
			hash += ord(char)
		return hash % self.size

	def add(self, key, value):
		key_hash = self._get_hash(key)
		key_value = [key, value]

		if self.map[key_hash] is None:
			self.map[key_hash] = list([key_value])
			return True
		else
			for pair in self.map[key_hash]:
				if pair[0] == key:
					pair[1] = value
					return True
			self.map[key_hash].append(key_value)
			return True

	def get(self, key):
		key_hash = self._get_hash(key)
		if self.map[key_hash] is not None:
			for pair in self.map[key_hash]:
				if pair[0] == key:
					return pair[1]
		return None

	def delete(self, key):
		key_hash = self._get_hash(key)

		if self.map[key_hash] is None:
			return False
		for i in range (0, len(self.map[key_hash])):
			if self.map[key_hash][i][0] == key:
				self.map[key_hash].pop(i)
				return True

	def print(self):
		print('---Phone Book----')
		for item in self.map:
			if item is not None:
				print((str(item)))

h = HashMap()
h.add('Bob', '567-8888')
h.add('Ming', '293-6753')
h.add('Ming', '333-8233')
h.add('Ankit', '293-8625')
h.add('Aditya', '852-6551')
h.add('Alicia', '632-4123')
h.add('Mike', '567-2188')
h.add('Aditya', '777-888')
h.print()
h.delete('Bob')
h.print()
print('Ming: ' + h.get('Ming'))
```

Output:
![[Screenshot 2022-12-18 at 2.14.43 AM.png]]

- [[HashMap (python)|hashmap]] is faster than [[HashSet]] [^1]

## References

[^1]: https://www.geeksforgeeks.org/difference-between-hashmap-and-hashset/