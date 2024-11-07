---
aliases:
  - hashmap
---
## Synthesis
- A data structure that stores key-value pairs

- Stores key-value pairs for efficient retrieval
	- Implemented as dictionaries in python
## Source[^1]
- More efficient data structure than [[array]]
	- Allows for faster insertion and retrieval of data
	- Allows to access and insert data in constant time on average

## Source[^2]
 - A [[data structure]] used to store key-value pairs for efficient retrieval. A value stored in a hash map is retrieved using the key under which it was stored 
### Code Snippet
```python
states = {
  'TN': "Tennessee",
  'CA': "California",
  'NY': "New York",
  'FL': "Florida"
}

west_coast_state = states['CA']
print(west_coast_state)
```

Output:
```
California
```
## Source [^3]
- In python, they're implemented through [[dictionary (Python)|dictionaries]]

## Source[^4]
- A hash table should be able to
	- `add` a key-value pair
	- `get` a value by key
	- `remove` a value by key
	- `list` all key-value pairs
	- `count` the number of items in table
		- #question by items, do they mean key-value pairs? 
## References

[^1]: https://www.turing.com/kb/how-to-use-hashmap-in-python
[^2]: https://www.codecademy.com/learn/learn-data-structures-and-algorithms-with-python/modules/hash-maps/cheatsheet
[^3]: https://www.datacamp.com/tutorial/guide-to-python-hashmaps
[^4]: https://khalilstemmler.com/blogs/data-structures-algorithms/hash-tables/