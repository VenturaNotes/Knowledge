---
status: done
priority: normal
dateCreated: 2025-11-17T02:28:19.829-05:00
dateModified: 2025-11-18T03:21:10.172-05:00
tags:
  - task/personal
completedDate: 2025-11-18
---
## Synthesis

### Problems
#### (1) I should be able to filter by task and ignore nested tags
- I want to be able to filter tags if not nested in Obsidian bases
- The `file.tags.contains("task")` filter does check every document if it contains the `#task` tag, but I won't put this tag in a document unless it is a task to be completed
- It seems like I can manipulate tasks using this function but not sure how it works
	- `tags.map(value.split("/").slice(1)).join(", ")`
- Solution
	- `!tags.map(value.split("task/").slice(1)).flat()`
##### (1.1) If you have a tag 'contact' and another tag 'task/contact', 'contact' will disappear
- Solution
	- `!tags.filter(value.startsWith("#task/"))`
		- This filters all the files that start with a tag name `#task/`
	- `file.tags.contains("task")`
		- This ensures that the file has the `task` document within it.
- This is because `contact` is a tag returned which is not supposed to disappear
##### Troubleshooting 
- Maybe this will drop the first parent of `task` from all tags
	- `tags.map(value.split("task/").slice(1)).flat()`
		- A minor problem that happens with this is that if you have a tag such as `contact` and then another tag `task/contact`, then the one with just `contact` will disappear which isn't a good thing
###### How It Works
- (1) `value.split("task/")`
	- Splits each tag on exact string `task/`
		- `"task/home"` → `["", "home"]`
		- `"task/work/urgent"` → `["", "work/urgent"]`
		- `"foo/task/home"` → `["foo/", "home"]`
		- `"project/alpha"` → `["project/alpha"]` (because `"task/"` doesn't exist)
- (2) `slice(1)`
	- Takes everything after index 0
		- `["", "home"]` → `["home"]`
		- `["", "work/urgent"]` → `["work/urgent"]`
		- `["foo/", "home"]` → `["home"]`
		- `["project/alpha"]` → `[]` (empty array)
- (3) Flattens the resulting array
	- `["task/home", "task/work/urgent", "project/alpha"]`
		- $\to$ `["home", "work/urgent", ""]`
			- I don't think bases removes empty values because it called up a document with an empty value but still had the a blank value `[]`, but no documents without a tag was called. 
				- So it will appear if it has `[]` as an empty file but if it's empty, it won't appear at all. Seems like Obsidian changed the way it adds its front matter
### Work
[[(T) How do I Group Obsidian Tasks]]
## Source [^1]
- `tags.map(value.split("/").slice(1)).flat()`
	- This formula drops the first parent of all the tags
- `tags.map(value.split("/").slice(1)).join(", ")`
	- You can add a symbol of your choice between the child tags

## Source[^2]
- #comment This shows the list of functions within Bases to manipulate the data from 
## References

[^1]: https://forum.obsidian.md/t/show-only-subtags-in-bases-table/103238/6
[^2]: https://help.obsidian.md/bases/functions