## Synthesis
- A note-taking and personal knowledge management application that stores notes as plain text markdown files on your local machine
- When doing `tags.isType("list")`, this returns true
	- So `tags` is type list which I assume holds all the different types of tags within the list. Each element within `tags` is a string
### Filtering out Nested Tags in Bases
- `!tags.filter(value.startsWith("#task/"))`
	- This removes all documents with a nested tag
### Design Limitations
- Scroll-to-change is a UI quirk of the number field for properties, so it's better to keep it as a text field to prevent accidental changes and simply using the `number()` function to transform the string to a number in comparisons
### String to Text Conversion
- number(`text property`) works
## Source [^1]
### Functions

#### List
##### map()
- `list.map(value: Any): list`
	- Example:
		- `[1, 2, 3, 4].map(value + 1)` returns `[2, 3, 4, 5]`
	- `map` transforms each element of the list by calling a conversion function which uses the variables `index` and `value`, and returns the new value to be placed in the list
		- `value` is the value of an item in the list
		- `index` is the index of the current value
##### flat()
- `list.flat(): list`
	- This flattens nested list into a single list
	- Example
		- `[1, [2,3]].flat()` returns `[1, 2, 3]`
##### join()
- `list.join(separator: string): string`
	- `separator` is the string to insert between elements
	- Joins all list elements into a single string
	- Example
		- `[1, 2, 3].join(",")` returns "1,2,3"
			- #comment Seems to join each element by a comma here
##### filter()
- `list.filter(value: Boolean): list`
	- Filter the elements of this list by calling a filter function, which uses the variables `index` and `value`, and returns a boolean value for whether the element should be kept
		- #comment But the function itself seems to return another list with the values that are accepted within the filter function
	- Example
		- `[1,2,3,4].filter(value > 2)` returns `[3,4]`
#### String
##### startsWith()
- `string.startsWith(query: string): boolean`
	- `query` is the string to check at the beginning
	- Returns true if this string starts with `query`
	- Example: `"hello".startsWith("he")` returns `true`

## References

[^1]: https://help.obsidian.md/bases/functions