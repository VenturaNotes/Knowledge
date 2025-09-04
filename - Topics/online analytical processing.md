---
aliases:
  - OLAP
---
## Synthesis
- 
## Source [^1]
- The use of a database for data analysis. The design of databases used primarily for OLAP differs from those whose primary purpose is online transaction processing (OLTP). In particular the normal basic rule of a relational database, that data should not be duplicated, is relaxed. Every possibly useful aggregate is precomputed and stored in a data structure called a cube, a multi-dimensional array with axes for, in principle, every useful measure of the data. The advantage of such a design is the high speed at which query results are returned, which makes it useful for data mining. In practice space constraints often prevent the storage of all possible aggregates and choices must be made at design time. An important precondition for an OLAP database is that its data is relatively stable: each update will affect many aggregates and so is an expensive operation. A common practice is to update an OLAP database periodically from an OLTP database used to collect the data.
## Source[^2]
- (OLAP) A software application that enables users to extract very specific types of data from a large, multidimensional database and to analyze that information in several ways at once. OLAP systems can therefore provide swift answers to very detailed and complex inquiries from managers about e.g. products, sales, and marketing costs. See DATA WAREHOUSING.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) A Dictionary of Business and Management 6th Edition by Oxford Reference]]