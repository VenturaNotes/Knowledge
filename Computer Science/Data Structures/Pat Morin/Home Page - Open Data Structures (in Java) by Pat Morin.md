---
Source:
  - zotero://open-pdf/library/items/UCIXKDGW?page=1&annotation=IZVE3B84
  - http://opendatastructures.org/
Length: "334"
Progress: "15"
tags:
  - status/incomplete
  - type/textbook
Reviewed: false
---
- Note
	- ([2015](https://www.pdfdrive.com/open-data-structures-in-java-e11947462.html) may have been the release date)

## (1) Introduction
### Why This Book?
- “The source code available there is released under a <mark style="background: #FFF3A3A6;">Creative Commons Attribution license</mark>, meaning that anyone is free to share: to copy, distribute and transmit the work; and to remix: to adapt the work, <mark style="background: #FFF3A3A6;">including the right to make commercial use of the work</mark>. The only condition on these rights is attribution: you must acknowledge that the derived work contains code and/or text from opendatastructures.org.” ([Morin, p. xi](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=11&annotation=5PDSIUEY))

### Chapter 1
- How [[data structures]] are used
	- “<mark style="background: #FFF3A3A6;">Open a file</mark>: File system data structures are used to locate the parts of that file on disk so they can be retrieved. This isn’t easy; disks contain hundreds of millions of blocks.” ([Morin, p. 1](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=13&annotation=DAZFPTES))
	- “<mark style="background: #FFF3A3A6;">Look up a contact on your phone:</mark>” ([Morin, p. 1](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=13&annotation=ZBHCBIUD))
		- “A data structure is used to look up a phone number in your contact list based on partial information even before you finish dialing/typing.” ([Morin, p. 1](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=13&annotation=HMQRAEEZ))
	- “<mark style="background: #FFF3A3A6;">Log in to your favorite social network:</mark>” ([Morin, p. 1](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=13&annotation=Q6VD4FXJ)) ^pyv43d
		- “The [[Network Servers|networks servers]] use your login information to look up your account information. This isn’t easy; the most popular social networks have hundreds of millions of active users.” ([Morin, p. 1](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=13&annotation=3Z7B4QU7))
	- <mark style="background: #FFF3A3A6;">Do a web search</mark>
		- “The search engine uses data structures to find the web pages containing your search terms.” ([Morin, p. 1](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=13&annotation=5ET4BRTA))
	- “<mark style="background: #FFF3A3A6;">Phone emergency services (9-1-1):</mark>” ([Morin, p. 2](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=14&annotation=G2QKCN3F))
		- “The emergency services network looks up your phone number in a data structure that maps phone numbers to addresses so that police cars, ambulances, or fire trucks can be sent there without delay.” ([Morin, p. 2](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=14&annotation=G34GDA9Q))
			- Might be using maps here?
### (1.1) The Need for Efficiency
- “We can store the data in an [[array]] or a [[linked list]] and each operation can be implemented by iterating over all the elements of the array or list and possibly adding or removing an element.” ([Morin, p. 2](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=14&annotation=J9AFA9HM))
	- Implementation easy but not efficient
- Does efficiency matter? (yes)
	- Number of operations
		- “Imagine an application with a moderately-sized data set, say of one million items.” ([Morin, p. 2](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=14&annotation=FHZK8H7U))
		- “If each of these searches inspects each of the 106 items, this gives a total of 1 trillion inspections.” ([Morin, p. 2](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=14&annotation=ANNXTSLY))
	- [[Processor speeds]]
		- A fast desktop computer can not do more than one billion operations per second
			- Computer speeds at most a few gigahertz (billions of cycles per second), and each operation takes a few cycles
		- Would take 16 minutes to compute 1 trillion inspections
	- Bigger data sets
		- Google receives approximately 4,500 queries per second
			- This means they have 38,250 very fast servers to keep up
- The solution
	- “data structures do not scale well when the number of items, n, in the data structure and the number of operations, m, performed on the data structure are both large.” ([Morin, p. 3](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=15&annotation=IX4LJ98E))
	- “In these cases, the time (measured in, say, machine instructions) is roughly n × m.” ([Morin, p. 3](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=15&annotation=ST8ZFP4V))
	- “carefully organize data within the data structure so that not every operation requires every data item to be inspected.” ([Morin, p. 3](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=15&annotation=XBC8V3A7))
	- “we will see data structures where a search requires looking at only two items on average, independent of the number of items stored in the data structure.” ([Morin, p. 3](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=15&annotation=A5B5TLA9))
	- “In our billion instruction per second computer it takes only 0.000000002 seconds to search” ([Morin, p. 3](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=15&annotation=WYRSD8SI))
	- Keep items in sorted order (number of items inspected during an operation grows very slowly as a function of the number of items in the data structure)
	- “we can maintain a sorted set of one billion items while inspecting at most 60 items during any operation.” ([Morin, p. 3](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=15&annotation=73SQ4NMH))
- Remaining sections discuss
	- Mathematical Review
		- “[[exponentials]], [[Logarithm|logarithms]], [[factorials]], [[asymptotic notation]] or Big O notation, [[probability]], and [[randomization]];” ([Morin, p. 4](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=16&annotation=GP24YDME))
	- [[Model of computation]]
	- “[[correctness]], [[running time]], and [[space]];” ([Morin, p. 4](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=16&annotation=DJQS2JSP))
	- “sample code and [[typesetting conventions]].” ([Morin, p. 4](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=16&annotation=KYCYSVAY))
### (1.2) Interfaces
- Data structure's interface and its implementation
	- [[Programming Interface|Interface]]: Describes what a data structure does
	- [[Implementation]]: Describes how the data structure does it
- [[Programming Interface|Interface]] sometimes called an abstract data type
	- “defines the set of operations supported by a data structure and the semantics, or meaning, of those operations.” ([Morin, p. 4](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=16&annotation=5SJ942BZ))
	- “tells us nothing about how the data structure implements these operations;” ([Morin, p. 4](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=16&annotation=PGRYBAUD))
	- “only provides a list of supported operations along with specifications about what types of arguments each operation accepts and the value returned by each operation.” ([Morin, p. 4](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=16&annotation=8BFJH3YT))
- [[Implementation]]
	- “includes the internal representation of the data structure as well as the definitions of the algorithms that implement the operations supported by the data structure.” ([Morin, p. 4](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=16&annotation=RRH3DDJJ))
	- “there can be many implementations of a single interface.” ([Morin, p. 4](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=16&annotation=WMQPIKBP))
		- “Each implements the same interface, List, but in different ways.” ([Morin, p. 4](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=16&annotation=6AUDP8YZ))
			- “we will see implementations of the [[List interface]] using arrays” ([Morin, p. 4](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=16&annotation=QHSV83DW))
			- “we will see implementations of the List interface using [[pointer-based data structures]]” ([Morin, p. 4](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=16&annotation=HR9G68PH))
#### (1.2.1) The Queue, Stack, and Deque Interfaces
- [[Queue Interface]]
	- “represents a collection of elements to which we can add elements and remove the next element.” ([Morin, p. 5](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=17&annotation=DK4V4R8Q))
	- Precisely
		- “add(x): add the value x to the Queue” ([Morin, p. 5](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=17&annotation=WH6T997F))
		- “remove(): remove the next (previously added) value, y, from the Queue and return y” ([Morin, p. 5](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=17&annotation=4A4YH5UA))
			- Takes no argument
			- “The Queue’s [[Queueing Discipline|queueing discipline]] decides which element should be removed.” ([Morin, p. 5](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=17&annotation=NVLSHFEX))
				- “most common of which include [[First In First Out Queue|FIFO]], [[Priority Queue|priority]], and [[Last In First Out Queue|LIFO]].” ([Morin, p. 5](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=17&annotation=87AAXDUA)) ^4scvjk
- ![[Screenshot 2023-06-03 at 5.58.37 PM.png]]
	- FIFO (first-in-first-out) Queue
		- “removes items in the same order they were added” ([Morin, p. 5](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=17&annotation=L3AD29UZ))
			- Think of a line at a grocery store
		- Most common kind of queue
			- so qualifier FIFO is often omitted
		- “In other texts, the add(x) and remove() operations on a FIFO Queue are often called enqueue(x) and dequeue(), respectively.” ([Morin, p. 5](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=17&annotation=AT4X9UVP))
- ![[Screenshot 2023-06-03 at 6.01.49 PM.png]]
	- [[Priority Queue]]
		- “always removes the smallest element from the Queue, breaking ties arbitrarily” ([Morin, p. 5](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=17&annotation=2QL58F7I))
			- Think of patients in a hospital emergency room. (Doctor treats patient first with the most life threatening condition)
		- “The remove() operation on a priority Queue is usually called deleteMin() in other texts.” ([Morin, p. 5](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=17&annotation=3SSFREAA))
- ![[Screenshot 2023-06-03 at 6.04.18 PM.png]]
	- LIFO - [[Last in first out queue]]
		- “most recently added element is the next one removed.” ([Morin, p. 5](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=17&annotation=US5IN9HZ))
			- Think of stack of plates $\textemdash$ placed on top of the stack and also removed from top of stack
		- “This structure is so common that it gets its own name: [[Stack]].” ([Morin, p. 6](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=18&annotation=GSGUBYAW))
			- “when discussing a Stack, the names of add(x) and remove() are changed to push(x) and pop();” ([Morin, p. 6](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=18&annotation=IH7ACFY4))
- [[Deque]]
	- “generalization of both the FIFO Queue and LIFO Queue (Stack).” ([Morin, p. 6](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=18&annotation=QYZQJXG2))
	- “Deque represents a sequence of elements, with a front and a back.” ([Morin, p. 6](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=18&annotation=S7CVHYKL))
		- “Elements can be added at the front of the sequence or the back of the sequence.” ([Morin, p. 6](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=18&annotation=YLEN2XIG))
		- “names of the Deque operations are self-explanatory: addFirst(x), removeFirst(), addLast(x), and removeLast().” ([Morin, p. 6](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=18&annotation=MEI9VW4M))
			- “a [[Stack]] can be implemented using only addFirst(x) and removeFirst()” ([Morin, p. 6](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=18&annotation=2N2JQUQQ))
			- “FIFO Queue can be implemented using addLast(x) and removeFirst().” ([Morin, p. 6](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=18&annotation=L4FADH2W))
#### (1.2.2) The List Interface - Linear Sequences
- “book will talk very little about the FIFO Queue, Stack, or Deque interfaces.” ([Morin, p. 6](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=18&annotation=QDFQXE5S))
	- “these interfaces are subsumed by the List interface.” ([Morin, p. 6](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=18&annotation=UVEEFVYE))
		- Subsumed means "include or absorb (something) in something else" [^1]
- ![[Screenshot 2023-06-03 at 6.15.14 PM.png]]
	- [[List]]
		- Represents a sequence $x_0, ..., x_{n-1}$ of values
		- “A List represents a sequence indexed by 0, 1, 2, . . . , n − 1. In this List a call to get(2) would return the value c.” ([Morin, p. 7](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=19&annotation=LRCV4UUE))
			- size(): return n, the length of the list
			- get(i): return the value $x_i$
			- set(i, x), set the value $x_i$ equal to x
			- add(i, x): add x at position i, displacing $x_i,...,x_{n-1};$
				- Set $x_{j+1} = x_j$ for all j $\in$ {n-1,...,i}, increment n, and set $x_i = x$
			- remove(i) remove the value $x_i$, displacing $x_{i+1}, ..., x_{n-1};$
				- Set $x_j = x_{j+1}$, for all j $\in$ {i,...,n-2} and decrement n
		- “A List represents a sequence indexed by 0, 1, 2, . . . , n − 1. In this List a call to get(2) would return the value c.” ([Morin, p. 7](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=19&annotation=LRCV4UUE))
			- ![[Screenshot 2023-06-03 at 6.37.17 PM.png]]
		- “terms Stack and Deque are sometimes used in the names of data structures that implement the List interface.” ([Morin, p. 7](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=19&annotation=3G3H4JVH))
			- “highlights the fact that these data structures can be used to implement the Stack or Deque interface very efficiently.” ([Morin, p. 7](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=19&annotation=PDK9FNJE))
				- “ArrayDeque class is an implementation of the List interface that implements all the Deque operations in constant time per operation.” ([Morin, p. 7](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=19&annotation=BNJZWIVR))
#### (1.2.3) The USet Interface - Unordered Sets
- “The [[USet interface]] represents an unordered set of unique elements, which mimics a mathematical set.” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=3RCUXADE))
	- “contains n distinct elements; no element appears more than once; the elements are in no specific order.” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=9JTNPU9G))
	- Supports following operations
		- “size(): return the number, n, of elements in the set” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=YUP797ZW))
		- “add(x): add the element x to the set if not already present; Add x to the set provided that there is no element y in the set such that x equals y. Return true if x was added to the set and false otherwise.” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=7V4K7B68))
		- “remove(x): remove x from the set;” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=G63RNSPN))
			- “Return y, or null if no such element exists.” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=ECTZ4NXD))
		- “find(x): find x in the set if it exists;” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=J5N9HYPX))
			- “Find an element y in the set such that y equals x. Return y, or null if no such element exists.” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=63FCU3WK))
- Distinguishing x and y may be fussy
	- “This is because x and y might actually be distinct objects that are nevertheless treated as equal.” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=R6PJ89R6))
		- “In Java, this is done by overriding the class’s equals(y) and hashCode() methods.” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=P4FDMF8H))
	- “Such a distinction is useful because it allows for the creation of [[dictionaries]] or [[maps]] that map keys onto values.” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=Z4VCUZBC))
- “To create a dictionary/map, one forms compound objects called [[pair|Pairs]], each of which contains a <mark style="background: #FFF3A3A6;">key</mark> and a <mark style="background: #FFF3A3A6;">value</mark>.” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=ZTPMZGXN))
	- “Two Pairs are treated as equal if their keys are equal.” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=RAQ6UD3H))
	- “it is possible to recover the value, v, given only the key, k.” ([Morin, p. 8](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=20&annotation=JZH8HAS7))
#### (1.2.4) The SSet Interface - Sorted Sets
- “[[SSet interface]] represents a sorted set of elements.” ([Morin, p. 9](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=21&annotation=FPRA7Y4Z))
	- “stores elements from some total order, so that any two elements x and y can be compared.” ([Morin, p. 9](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=21&annotation=P44Y2FKG))
	- “compare(x, y)” ([Morin, p. 9](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=21&annotation=Q93TY8U9))
		- ![[Screenshot 2023-06-03 at 6.46.19 PM.png]]
	- “SSet supports the size(), add(x), and remove(x) methods with exactly the same semantics as in the USet interface.” ([Morin, p. 9](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=21&annotation=I7X8J53Z))
	- “difference between a USet and an SSet is in the find(x) method:” ([Morin, p. 9](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=21&annotation=9IA3B4QE))
		- “find(x): locate x in the sorted set; Find the smallest element y in the set such that y ≥ x. Return y or null if no such element exists.” ([Morin, p. 9](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=21&annotation=FE6H7YRG))
		- “This version of the find(x) operation is sometimes referred to as a [[successor search]].” ([Morin, p. 9](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=21&annotation=TP77VHFN))
		- “it returns a meaningful result even when there is no element equal to x in the set.” ([Morin, p. 9](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=21&annotation=ZHV2UIJ7))
	- “extra functionality provided by an SSet usually comes with a price that includes both a larger running time and a higher implementation complexity.” ([Morin, p. 9](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=21&annotation=J2QYVWHZ))
		- “most of the SSet implementations discussed in this book all have find(x) operations with running times that are logarithmic in the size of the set.” ([Morin, p. 9](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=21&annotation=M9NLBQIC))
		- “the implementation of a USet as a ChainedHashTable in Chapter 5 has a find(x) operation that runs in constant expected time” ([Morin, p. 9](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=21&annotation=ZGQATKJ6))
		- “one should always use a USet unless the extra functionality offered by an SSet is truly needed.” ([Morin, p. 9](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=21&annotation=SF3ZFFDD))
### (1.3) Mathematical Background
- “Readers who feel they are missing this background are encouraged to read, and do exercises from, the appropriate sections of the very good (and free) [[Home Page - Mathematics for Computer Science by Lehman et al|textbook on mathematics for computer science]] $[50]$.” ([Morin, p. 10](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=22&annotation=7IB5E6V5))
#### (1.3.1) Exponentials and Logarithms

- $b^x =\underbrace {b \times b \times b ... \times b}_\text{x}$
- $b^x = \frac {1}{b^{-x}}$
- [[Exponential function]] $e^x$ is defined in terms of the [[exponential series]]
- “the expression $log_bk$ denotes the base-b logarithm of k.” ([Morin, p. 10](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=22&annotation=B34IYTDY))
	- So it 
- “Most of the logarithms in this book are base 2 ([[binary logarithms]]).” ([Morin, p. 10](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=22&annotation=UFID6Q8I))
	- “so that log k is shorthand for $log_2k$.” ([Morin, p. 10](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=22&annotation=6U4RGNX4))
- “think of $log_bk$ as the number of times we have to divide k by b before the result is less than or equal to 1.” ([Morin, p. 10](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=22&annotation=XNK5EPG2))
- “when one does [[binary search]], each comparison reduces the number of possible answers by a factor of 2.” ([Morin, p. 10](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=22&annotation=UGFXUJWX))
	- “This is repeated until there is at most one possible answer” ([Morin, p. 10](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=22&annotation=UI2IV3BW))
	- Therefore, the number of comparison done by binary search when there are initially at most n+1 possible answers is at most $[log_2(n+1)]$
- “Another logarithm that comes up several times in this book is the [[Natural Logarithm]].” ([Morin, p. 10](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=22&annotation=T6ZMLA9C))
	- “we use the notation ln k to denote $log_ek$, where e $\textemdash$ [[Euler’s constant]] — is given by” ([Morin, p. 10](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=22&annotation=AEN23SHP))
		- ![[Screenshot 2023-06-03 at 7.05.47 PM.png]]
- “natural logarithm comes up frequently because it is the value of a particularly common integral:” ([Morin, p. 11](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=23&annotation=5JG8NPHM))
	- ![[Screenshot 2023-06-03 at 7.06.21 PM.png]]
- Remove logarithms from an exponent and changing their base. “we can use these two manipulations to compare the natural and binary logarithms” ([Morin, p. 11](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=23&annotation=NCDTFUHF))
	- ![[Screenshot 2023-06-03 at 7.07.27 PM.png]]
#### (1.3.2) Factorials
- “For a nonnegative integer n, the notation n! (pronounced “n [[factorial]]”) is defined to mean” ([Morin, p. 11](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=23&annotation=W66J4AWA))
	- ![[Screenshot 2023-06-03 at 7.08.50 PM.png]]
- “n! counts the number of distinct [[Permutation|permutations]]” ([Morin, p. 11](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=23&annotation=GM8VLP22))
	- “orderings, of n distinct elements.” ([Morin, p. 11](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=23&annotation=HZIAEHXX))
	- “For the special case n=0, 0! is defined as 1.” ([Morin, p. 11](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=23&annotation=8RZZWCFA))
- n! approximation using [[Stirling's Approximation]]
	- ![[Screenshot 2023-06-03 at 7.11.07 PM.png]]
- Stirling's Approximation also approximates ln(n!)
	- ![[Screenshot 2023-06-03 at 7.11.57 PM.png]]
- Proving Stirling's Approximation
	- Approximate 
		- $ln(n!) = ln(1) + ln(2) + ... + ln(n)$
	- by the integral
		- $\int_{1}^{n} \text{ln} ndn = n\text{ln}n - n +1$
- [[binomial coefficient|Binomial Coefficients]] ^f1b1p2
	- For a non-negative integer n and an integer k $\in$ {0, ..., n}, the notation $n \choose k$ denotes
		- ![[Screenshot 2023-06-03 at 7.16.25 PM.png]]
			- It counts the number of subsets of an n element set that have size k, i.e., the number of ways of choosing k distinct integers from the set {1, ..., n}
#### (1.3.3) Asymptotic Notation
- “When we talk about the running time of an operation we are referring to the number of computer instructions performed during the operation.” ([Morin, p. 12](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=24&annotation=7D8JMIK9))
	- “instead of analyzing running times exactly, we will use the so-called big-Oh notation:” ([Morin, p. 12](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=24&annotation=B94Z963I))
		- “For a unction f (n), O(f(n)) denotes a set of functions” ([Morin, p. 12](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=24&annotation=NDNEY3MI))
			- ![[Screenshot 2023-06-03 at 7.32.30 PM.png]]
				- g(n): there exists c > 0, and $n_0$ such that g(n) $\le$ c $*$ f(n) for all n $\ge$ $n_0$
				- This set consists of the functions g(n) where $c*f(n)$ starts to dominate g(n) when n is sufficiently large.
- We use asymptotic notation to simplify functions
	- We can write O(nlogn) in place of $5nlogn + 8n-200$
		- ![[Screenshot 2023-06-03 at 7.40.03 PM.png]]
			- First line is true because you added 200 to the right side
			- Second line just transforms 8n $\rightarrow$ 8nlogn since the greater the number, the less relevant it'll be
			- Then you just add the logs together getting 13nlogn
			- ![[Screenshot 2023-06-03 at 7.42.42 PM.png]]
				- This shows $n$ must be $\ge 2$ because that is the intersection point of the first 2 lines, and the second line is equal or larger than the first line after that point
		- “This demonstrates that the function f (n) = 5nlogn + 8n − 200 is in the set O(n log n) using the constants c = 13 and $n_0$ = 2.” ([Morin, p. 12](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=24&annotation=ZTX3HZRR))
- Shortcuts when using asymptotic notation
	- First, $O(n^{c_1}) \subset O(n^{c_2})$ for any $c_1 < c_2$ 
		- ![[Pasted image 20230603194829.png|500]]
	- Second, For any constants a, b, c > 0: $O(a) \subset O(log n) \subset O(n^b) \subset O(c^n)$
		- ![[Screenshot 2023-06-03 at 7.53.20 PM.png]]
	- These [[inclusion relations]] can be multiplied by any positive value, and they still hold. For example, multiplying by n yields:
		- $O(n) \subset O(nlogn) \subset (n^{1+b}) \subset O(nc^n)$
- “Continuing in a long and distinguished tradition, we will abuse this notation by writing things like f1(n) = O(f (n)) when what we really mean is f1(n) ∈ O(f (n)).” ([Morin, p. 13](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=25&annotation=KWG42YQP))
	- We will say "the running time of this operation is O(f(n))" when this statement should be "the running time of this operation is a member of O(f(n))". 
- Given $T(n) = 2logn + O(1)$
	- More correctly written as $T(n) \le 2logn + [\text{some member of } O(1)]$
		- Since no variable in O(1), we assume it should be read as
			- $T(n) = 2logn + O(f(n))$ where f(n) = 1
- [[big-O notation|Big-Oh notation]] used by number theorist [[Paul Bachmann]] as early as 1894
	- Immensely useful for describing the running times of computer algorithms
```java
void snippet() {
	for (int i = 0; i < n; i++)
	a[i] = i;
}
```
- Code
	- One execution of this method involves
		- 1 [[assignment]] (int i = 0)
		- n+1 [[comparisons]] (i < n)
		- n [[increments]] (i++)
		- n [[array offset calculations]] ($a[i]$)
		- [[indirect assignments]] ($a[i] = i$)
	- Running Time
		- T(n) = a + b(n+1) + cn + dn + en
			- where a, b, c, d, and e are constants
			- Problems
				- “it will not be possible to compare two running times to know which is faster without knowing the values of these constants.” ([Morin, p. 14](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=26&annotation=QE2ZRUFL))
				- “if we make the effort to determine these constants (say, through timing tests), then our conclusion will only be valid for the machine we run our tests on.” ([Morin, p. 14](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=26&annotation=K49V6X2X))
		- Big-Oh notation
			- T(n) = O(n)
			- “Big-Oh notation allows us to reason at a much higher level, making it possible to analyze more complicated functions.” ([Morin, p. 14](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=26&annotation=K57MRUZE))
- “if the two algorithms have demonstrably different big-Oh running times, then we can be certain that the one with the smaller running time will be faster for large enough values of n.” ([Morin, p. 15](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=27&annotation=V72UW27M))
- ![[Screenshot 2023-06-03 at 8.07.08 PM.png]]
	- “Figure 1.5, which compares the rate of growth of f1(n) = 15n versus f2(n) = 2n log n.” ([Morin, p. 15](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=27&annotation=XLTTRV3X))
	- “This illustrates that, although f1(n) is greater than f2(n) for small values of n, the opposite is true for large values of n.” ([Morin, p. 15](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=27&annotation=BD8EU7DS))
		- [[Linear time]] algorithm vs algorithm based on the [[divide and conquer]] paradigm.
			- “Analysis using big-Oh notation told us that this would happen, since O(n) ⊂ O(n log n)” ([Morin, p. 15](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=27&annotation=YJVZMTIW))
- In few cases, we will use asymptotic notation on functions with more than one variable. Currently no standard for this
	- ![[Screenshot 2023-06-03 at 8.10.10 PM.png]]
		- “when the arguments $n_1$, . . . , $n_k$ make g take on large values.” ([Morin, p. 15](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=27&annotation=8JZSWICV))
		- Definition also agrees with the [[univariate]] definition of O(f(n)) when f(n) is an increasing function of n.
		- “reader should be warned that, although this works for our purposes, other texts may treat multivariate functions and asymptotic notation differently.” ([Morin, p. 15](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=27&annotation=UI27F5ZP))
#### (1.3.4) Randomization and Probability
- “Some of the data structures presented in this book are [[randomized]];” ([Morin, p. 15](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=27&annotation=8AI6AKIC))
	- “they make random choices that are independent of the data being stored in them or the operations being performed on them” ([Morin, p. 15](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=27&annotation=XVJL3ZC2))
		- Therefore, performing the same set of operations could result in different running times
- When analyzing data structures, we are interested in their average or [[expected running times]]
- “the running time of an operation on a randomized data structure is a random variable, and we want to study its [[expected value]].” ([Morin, p. 17](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=29&annotation=26Q3WYPN))
- “[[Discrete Random Variable|discrete random variable]] X taking on values in some countable universe U , the expected value of X, denoted by E[X], is given by the formula” ([Morin, p. 17](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=29&annotation=SCTT4MVX))
	- ![[Screenshot 2023-06-03 at 8.16.51 PM.png]]
		- Pr($\varepsilon$) denotes the [[probability]] that the [[event]] $\varepsilon$ occurs
		- “In all of the examples in this book, these probabilities are only with respect to the random choices made by the randomized data structure” ([Morin, p. 17](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=29&annotation=WH8DNNYP))
- [[Linearity of expectation]]
	- For any two random variables X and Y
		- ![[Screenshot 2023-06-03 at 8.22.47 PM.png]]
	- More generally for any random variables $X_1, ..., X_k$
		- ![[Screenshot 2023-06-03 at 8.23.31 PM.png]]
	- “Linearity of expectation allows us to break down complicated random variables (like the left hand sides of the above equations) into sums of simpler random variables (the right hand sides).” ([Morin, p. 17](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=29&annotation=9KMPN394))
- [[Indicator random variables]]
	- “These binary variables are useful when we want to count something and are best illustrated by an example.” ([Morin, p. 17](zotero://select/library/items/AZMT4QS6)) ([pdf](zotero://open-pdf/library/items/UCIXKDGW?page=29&annotation=XVGKJ7JC))
	- If flipping a coin k times, we intuitively know that the expected number of times the coin turns up as heads is $\frac k2$. We can try to prove it using the definition of expected value
### (1.4) The Model of Computation
### (1.5) Correctness, Time Complexity, and Space Complexity
### (1.6) Code Samples
### (1.7) List of Data Structures
### (1.8) Discussion and Exercises
## (2) Array-Based Lists
### (2.1) ArrayStack: Fast Stack Operations Using an Array
#### (2.1.1) The Basics
#### (2.1.2) Growing and Shrinking
#### (2.1.3) Summary
### (2.2) FastArrayStack: An Optimized ArrayStack
### (2.3) ArrayQueue: An Array-Based Queue
#### (2.3.1) Summary
### (2.4) ArrayDeque: Fast Deque Operations Using an Array
#### (2.4.1) Summary
### (2.5) DualArrayDeque: Building a Deque from Two Stacks
#### (2.5.1) Balancing
#### (2.5.2) Summary
### (2.6) RootishArrayStack: A space-Efficient Array Stack
#### (2.6.1) Analysis of Growing and Shrinking
#### (2.6.2) Space Usage
#### (2.6.3) Summary
#### (2.6.4) Computing Square Roots
### (2.7) Discussion and Exercises
## (3) Linked Lists
### (3.1) SLList: A Singly-Linked List
#### (3.1.1) Queue Operations
#### (3.1.2) Summary
### (3.2) DLList: A Doubly-Linked List
#### (3.2.1) Adding and Removing
#### (3.2.2) Summary
### (3.3) SEList: A Space-Efficient Linked List
#### (3.3.1) Space Requirements
#### (3.3.2) Finding Elements
#### (3.3.3) Adding an Element
#### (3.3.4) Removing an Element
#### (3.3.5) Amortized Analysis of Spreading and Gathering
#### (3.3.6) Summary
### (3.4) Discussion and Exercises
## (4) Skiplists
### (4.1) The Basic Structure
### (4.2) SkiplistSSet: An Efficient SSet
#### (4.2.1) Summary
### (4.3) SkiplistList: An Efficient Random-Access List
#### (4.3.1) Summary
### (4.4) Analysis of Skiplists
### (4.5) Discussion and Exercises
## (5) Hash Tables
### (5.1) ChainedHashTable: Hashing with Chaining
#### (5.1.1) Multiplicative Hashing
#### (5.1.2) Summary
### (5.2) LinearHashTable: Linear Probing
#### (5.2.1) Analysis of Linear Probing
#### (5.2.2) Summary
#### (5.2.3) Tabulation Hashing
### (5.3) Hash Codes
#### (5.3.1) Hash Codes for Primitive Data Types
#### (5.3.2) Hash Codes for Compound Objects
#### (5.3.3) Hash Codes for Arrays and Strings
### (5.4) Discussion and Exercises
## (6) Binary Trees
### (6.1) BinaryTree: A Basic Binary Tree
#### (6.1.1) Recursive Algorithms
#### (6.1.2) Traversing Binary Trees
### (6.2) BinarySearchTree: An Unbalanced Binary Search Tree
#### (6.2.1) Searching
#### (6.2.2) Addition
#### (6.2.3) Removal
#### (6.2.4) Summary
### (6.3) Discussion and Exercises
## (7) Random Binary Search Trees
### (7.1) Random Binary Search Trees
#### (7.1.1) Proof of Lemma 7.1
#### (7.1.2) Summary
### (7.2) Treap: A Randomized Binary Search Tree
#### (7.2.1) Summary
### (7.3) Discussion and Exercises
## (8) Scapegoat Trees
### (8.1) ScapegoatTree: A Binary Search Tree with Partial Rebuilding
#### (8.1.1) Analysis of Correctness and Running-Time
#### (8.1.2) Summary
### (8.2) Discussion and Exercises
## (9) Red-Black Trees
### (9.1) 2-4 Trees
#### (9.1.1) Adding a leaf
#### (9.1.2) Removing a Leaf
### (9.2) RedBlackTree: A Simulated 2-4 Tree
#### (9.2.1) Red-Black Trees and 2-4 Trees
#### (9.2.2) Left-Leaning Red-Black Trees
#### (9.2.3) Addition
#### (9.2.4) Removal
### (9.3) Summary
### (9.4) Discussion and Exercises
## (10) Heaps
### (10.1) BinaryHeap: An Implicit Binary Tree
#### (10.1.1) Summary
### (10.2) MeldableHeap: A Randomized Meldable Heap
#### (10.2.1) Analysis of merge(h1, h2)
#### (10.2.2) Summary
### (10.3) Discussion and Exercises
## (11) Sorting Algorithms
### (11.1) Comparison-Based Sorting
#### (11.1.1) Merge-Sort
#### (11.1.2) Quicksort
#### (11.1.3) Heap-sort
#### (11.1.4) A Lower-Bound for Comparison-Based Sorting
### (11.2) Counting Sort and Radix Sort
#### (11.2.1) Counting Sort
#### (11.2.2) Radix-sort
### (11.3) Discussion and Exercises
## (12) Graphs
### (12.1) AdjacencyMatrix: Representing a Graph by a Matrix
### (12.2) AdjacencyLists: A Graph as a Collection of Lists
### (12.3) Graph Traversal
#### (12.3.1) Breadth-First Search
#### (12.3.2) Depth-First Search
### (12.4) Discussion and Exercises
## (13) Data Structures for Integers
### (13.1) BinaryTrie: A digital search tree
### (13.2) XFastTrie: Searching in Doubly-Logarithmic Time
### (13.3) YFastTrie: A Doubly-Logarithmic Time SSet
### (13.4) Discussion and Exercises
## (14) External Memory Searching
### (14.1) The Block Store
### (14.2) B-Trees
#### (14.2.1) Searching
#### (14.2.2) Addition
#### (14.2.3) Removal
#### (14.2.4) Amortized Analysis of B-Trees
### (14.3) Discussion and Exercises


 
## References
[^1]: https://www.google.com/search?q=define+subsumed&oq=define+subsumed&aqs=chrome..69i57j0i433i512l3j0i512l2j0i433i512j0i512j0i433i512j0i512.1844j1j7&sourceid=chrome&ie=UTF-8