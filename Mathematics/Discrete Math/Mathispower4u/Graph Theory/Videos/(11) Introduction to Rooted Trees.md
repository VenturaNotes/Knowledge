---
Source:
  - https://www.youtube.com/watch?v=DdNFA74H0ow
Reviewed: false
---
- ![[Screenshot 2025-02-08 at 9.15.31 AM.png]]
	- [[Rooted Trees]]
		- So far, we have thought of trees only as a particular kind of graph. However, it is often useful to add additional structure to trees to help solve problems. Data is often structured like a tree. This book, for example, has a tree structure
			- (1) Draw a vertex for the book itself
			- (2) Then draw vertices for each chapter, connected to the book vertex
			- (3) Under each chapter, draw a vertex for each section, connecting it to the chapter it belongs to
				- #comment pretty much how I format my book notes
		- The graph will not have any cycles; it will be a tree. But a tree with clear hierarchy which is not present if we don't identify the book vertex as the "top"
		- As soon as one vertex of a tree is designated as the root, then every other vertex on the tree can be characterized by its position relative to the root. This works because there is a unique path between any two vertices in a tree. So from any vertex, we can travel back to the root in exactly one way. This also allows us to describe how distinct vertices in a rooted tree are related.
	- Rooted Trees
		- If two vertices are adjacent, then we say one of them is the parent of the other, which is called the child of the parent. Of the two, the parent is the vertex that is closer to the root. Thus, the root if a tree is a parent, but is not the child of any vertex. All non-root vertices have exactly one parent. Not surprisingly, the child of a child of a vertex is called the grandchild of the vertex (and it is the grandparent). More in general, we say that a vertex $x$ is a descendent of a vertex $u$ provided $u$ is a vertex on the path from $v$ to the root. Then we would call $u$ an ancestor of $v$
		- For most trees (in fact, all except paths with one end the root), there will be pairs of vertices neither of which is a descendant of the other. We might call these cousins or siblings.  In fact, vertices $v$ and $w$ are called siblings if they have the same parent. Note that siblings are never adjacent
		- Since vertices $e$ and $f$ are on the same level, but have different parents, they are considered cousins
