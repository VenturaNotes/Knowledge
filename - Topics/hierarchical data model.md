## Synthesis
- 
## Source [^1]
- A data model based on one-many relationships between aggregations of fixed numbers of data items, such an aggregation being termed a segment. A database record type comprises a number of segment types, arranged in a hierarchy, commencing with the root segment type; below the root segment type there is zero, one, or more segment types at the first level, with a similar structure below each of these first-level types at the second level, and so on. Thus each segment type except the root is dependent on a segment type at the immediately higher level. A database record instance comprises a single instance of the root segment type and zero, one, or more instances of each of its types at the first level. Corresponding to each of these first-level instances, there will be zero, one, or more instances of each of the appropriate second-level types, and so on. Only the root segment can have an independent existence.
- IMS, an important database management system supplied by IBM, is based on and implements this data model.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]