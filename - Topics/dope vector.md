## Synthesis
- 
## Source [^1]
- A vector of data used to assist in accessing the elements in an array. The dope vector contains
	- (a) the address of a fixed element in the array-this may be the first element present or the element that has all subscripts equated to zero;
	- (b) the number of subscripts associated with the array, i.e. its dimensionality;
	- (c) the [[stride]] associated with each subscript position, i.e. the number of stored elements that must be skipped over when a subscript's value is changed by 1
- The position in memory of an element is found by taking the inner product of the strides with the differences between the actual subscript values and those that correspond to the fixed element referred to in (a), and adding to this the address of the fixed element.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]