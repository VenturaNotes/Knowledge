---
aliases:
  - red-black trees
tags:
  - in-progress
---
## Synthesis
### Description
- A type of self-balancing [[binary search tree]].
- Each node stores an extra bit for "color" (red or black), which is used to ensure the tree remains approximately balanced during insertions and deletions. 
	- #question Why would you want to keep a tree balanced?
	- #question What does it mean for a tree to be balanced?
	- #question What is meant by 'bit' here? Like a bit in memory or something else?
- Balance is crucial because it guarantees basic operations like searching, inserting, and deleting take $O(\log n)$ time, even in the worst-case scenario.
### 5 Essential Rules

## Organize 

### 5 Essential Rules
- To be a Red-Black Tree:
	1. Every node is either red or black.
	2. The root is always black.
	3. Every leaf (NIL) is black.
		- #question What is NIL?
	4. If a node is red, both its children must be black (No two red nodes can be adjacent).
		- #question Does this mean the parent of a red node needs to be black? 
	5. Every path from a node to its descendant NIL leaves must contain the same number of black nodes.
		- #question What does NIL mean? 
### Algorithm
- When inserting a new node, always start by coloring it Red. This preserves the "black height" (Rule 5) but might violate Rule 4 (no two reds in a row). To fix this, the algorithm performs two types of "repairs":

#### 1. Recoloring

If the "uncle" of the new node is also red, we simply change the colors of the parent, uncle, and grandparent to maintain the rules.

#### 2. Rotation

If the "uncle" is black, recoloring isn't enough. We perform Left or Right Rotations to physically restructure the tree and restore balance.

---
### Python Implementation

Below is a simplified version focusing on the Insertion logic and the Left Rotation helper function.
- #question What is meant by "simplified" version? What would the normal version look like or rather what are we missing?

Python

```python
class Node:
    def __init__(self, data, color="Red"):
        self.data = data
        self.parent = None
        self.left = None
        self.right = None
        self.color = color  # "Red" or "Black"

class RedBlackTree:
    def __init__(self):
        self.NIL = Node(0, color="Black") # Sentinels for leaves
        self.root = self.NIL

    def left_rotate(self, x):
        y = x.right
        x.right = y.left
        if y.left != self.NIL:
            y.left.parent = x
        y.parent = x.parent
        if x.parent == None:
            self.root = y
        elif x == x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        y.left = x
        x.parent = y

    def insert_fixup(self, k):
        while k.parent.color == "Red":
            if k.parent == k.parent.parent.right:
                u = k.parent.parent.left # The uncle
                if u.color == "Red":
                    # Case 1: Uncle is red (Recolor)
                    u.color = "Black"
                    k.parent.color = "Black"
                    k.parent.parent.color = "Red"
                    k = k.parent.parent
                else:
                    if k == k.parent.left:
                        # Case 2: Uncle is black, k is left child
                        k = k.parent
                        self.right_rotate(k)
                    # Case 3: Uncle is black, k is right child
                    k.parent.color = "Black"
                    k.parent.parent.color = "Red"
                    self.left_rotate(k.parent.parent)
            else:
                # Mirror cases for when parent is a left child...
                break
        self.root.color = "Black"
```

---
### Example
- Insert 10, 20, and 30 into empty tree
	1. Insert 10
		- Becomes root. Rule 2 means it's colored Black
	2. Insert 20
	3. 
- 

- Imagine you insert the numbers 10, 20, and 30 into an empty tree:
	1. Insert 10: It becomes the root. By Rule 2, it is colored Black.
	2. Insert 20: It is added as the right child of 10. It is colored Red. No rules are broken.
	3. Insert 30: It is added as the right child of 20. It is colored Red.
	    - The Conflict: Now we have two red nodes in a row (20 and 30).
	    - The Fix: Since the "uncle" of 30 is a NIL node (Black), we perform a Left Rotation on node 10.
	    - Result: 20 becomes the new root (Black), with 10 (Red) as its left child and 30 (Red) as its right child. The tree is now perfectly balanced!
## Source [^1]
- 
## References

[^1]: