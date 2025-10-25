---
aliases:
  - DS
---
## Synthesis
- It's just a method of storing information
	- #question How many data structure storing methods are there?
## Source [^1]
- (information structure) An aspect of data type expressing the nature of values that are composite, i.e. not atoms. The nonatomic values have constituent parts (which need not themselves be atoms), and the data structure expresses how constituents may be combined to form a compound value or selected from a compound value. Thus 'date' regarded as a data structure is a set containing a member for every possible day, combined with operations to construct a date from its constituents$\textemdash$year, month, and day$\textemdash$and to select a desired constituent.
	- #question Is data structure also known as information structure? Could this be an alias? How common is that?
	- #question What kinds of data types are there? 
	- #question What is meant by nature of values that are composite or not atoms? Could you give some examples? One that I could come up with is that an integer is basically an atom since it's a single value like `3` or `-4`. Would expressing the nature of values that are composite be similar to lists since they can hold multiple values such as multiple integers (both `3` and `-4`)?
- An implementation of a data structure involves both choosing a storage structure and providing a set of procedures/functions that implement the appropriate operations using the chosen storage structure. Formally, a data structure is defined as a distinguished domain in an abstract data type that specifies the structure. Computer solution of a real-world problem involves designing some ideal data structures, and then mapping these onto available data structures (e.g. arrays, records, lists, queues, and trees) for the implementation.
- Note that terms for data structures are used to denote both the structure and data having that structure.
- See also DYNAMIC DATA STRUCTURE, STATIC DATA STRUCTURE.
## Source[^2]
- Method to store information
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) Algorithms, Part I by by Princeton University#1 2 Lecture Slides]]