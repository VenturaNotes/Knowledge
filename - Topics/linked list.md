---
aliases:
  - chained list
tags:
  - in-progress
---
## Synthesis

[1]
### Description
- It's a linear data structure where elements are not stored in contiguous memory locations. Instead, each element (called a node) is a separate object that contains two parts:
	- **Data**: The value stored in the node.
	- **Next**: A pointer or reference to the next node in the sequence.
- The first node is called the head, and the last node points to None (or null), indicating the end of the list.
### Visual Example
- List with three elements (10, 20, and 30) looks like this:
```
[ Head ]
   │
   ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Data: 10     │      │ Data: 20     │      │ Data: 30     │
│ Next: ─────────────>│ Next: ─────────────>│ Next: None   │
└──────────────┘      └──────────────┘      └──────────────┘
```
### Code Example (Python)
- Singly linked list

```python
# Step 1: Define the Node class
class Node:
    def __init__(self, data):
        self.data = data  # Stores the actual value
        self.next = None  # Points to the next Node (starts as None)

# Step 2: Define the LinkedList class to manage the nodes
class LinkedList:
    def __init__(self):
        self.head = None  # The list starts empty

    # Method to add a new node at the end of the list
    def append(self, data):
        new_node = Node(data)

        # If the list is empty, make the new node the head
        if self.head is None:
            self.head = new_node
            return

        # Otherwise, traverse to the last node
        current = self.head
        while current.next is not None:
            current = current.next

        # Set the next of the last node to the new node
        current.next = new_node

    # Method to print the entire linked list
    def display(self):
        current = self.head
        elements = []
        while current is not None:
            elements.append(str(current.data))
            current = current.next
        print(" -> ".join(elements) + " -> None")

# --- Example Usage ---

# 1. Create a new Linked List
my_list = LinkedList()

# 2. Add elements
my_list.append(10)
my_list.append(20)
my_list.append(30)

# 3. Display the list
my_list.display()
```

- Output

```
10 -> 20 -> 30 -> None
```

### Why use a Linked List instead of an Array?
- **Dynamic Size:** Unlike standard arrays in many languages, you do not need to define the size of a linked list ahead of time. It can grow or shrink dynamically as memory is allocated on the fly.
- **Efficient Insertions/Deletions:** Inserting or deleting a node at the beginning of the list is very efficient ( $O(1)$ time complexity) because you only need to update pointers, whereas in an array you might have to shift all subsequent elements.

However, searching for an element in a linked list is slower ( $O(n)$ time complexity) because you must start at the head and follow the pointers sequentially, unlike an array which allows direct access via indexes.
[/1]

## Source [^1]
### Description
- A linear data structure where each element is a separate object connected to each other.
- Head pointer is maintained
- Each node contains two fields
	- Value (Integer)
	- Pointer to next node
- Last node called "Tail" where next pointer is NULL address
### Primary Operations
- Insertion: Inserting element at beginning/end or kth position
- Deletion: Deleting element from list
- Display: Traverses the whole linked list and outputs each element
## Source[^2]
- aka chained list
- A list representation in which items are not necessarily sequential in storage. Access is made possible by the use in every item of a link that contains the address of the next item in the list. The last item in the list has a special [[null link]] to indicate that there are no more items in the list. See also DOUBLY LINKED LIST, SINGLY LINKED LIST.
## References

[^1]: [[(Home Page) Learn Data Structures and Algorithms - Roadmap by codechef#1 1 1 Linked List - Concept]]
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]