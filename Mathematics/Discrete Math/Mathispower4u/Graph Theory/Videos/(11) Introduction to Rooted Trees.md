---
Source:
  - https://www.youtube.com/watch?v=DdNFA74H0ow
Reviewed: false
---
- Image
	- [[Rooted Trees]]
		- So far, we have thought of trees only as a particular kind of graph. However, it is often useful to add additional structure to trees to help solve problems. Data is often structured like a tree. This book, for example, has a tree structure
			- (1) Draw a vertex for the book itself
			- (2) Then draw vertices for each chapter, connected to the book vertex
			- (3) Under each chapter, draw a vertex for each section, connecting it to the chapter it belongs to
		- The graph will not have any cycles; it will be a tree. But a tree with clear hierarchy which is not present if we don't identify the book vertex as the "top"
		- As soon as one vertex of a tree is designated as the root, then every other vertex on the tree can be characterized by its position relative to the root. This works because there is a unique path between any two vertices in a tree. So from any vertex, we can travel back to the root in exactly one way. This also allows us to describe how distinct vertices in a rooted tree are related.
