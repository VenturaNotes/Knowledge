## Synthesis
- 
## Source [^1]
- A data structure for storing and querying spatial data. Similar to B-trees in organization and operation, R-Trees store location information at each node in the form of minimum bounding rectangles (MBR). At a leaf node this describes the boundaries of the object defined in that node; at a non-leaf nodes this describe the MBR that will contain all the MBRs of that node's children. It does not matter if the spaces described by MBRs of separate nodes overlap. Searches for objects within a specified area can use the MBR information to confine the search efficiently to possible targets by excluding quickly all objects that cannot fall within the area. R-Trees are thus useful for large databases where the time to retrieve data from backing store is significant.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]