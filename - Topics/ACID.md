---
aliases:
  - atomicity, consistency, isolation, and durability
---
## Synthesis
- 
## Source [^1]
- These are the essential qualities of a transaction in database processing: either all or none of the subtasks composing the transaction must be performed (atomicity); the database satisfy all its constraints both at the beginning and at the end of the transaction (consistency); no other database user can access the data being manipulated by the transaction while it is an intermediate, and possibly inconsistent, state (isolation); and, once completed, the effect of the transaction will not be reversed, for example by a system crash and subsequent recovery (durability). See also BASE, CAP THEOREM
## Source[^2]
- In transaction processing, ACID (atomicity, consistency, isolation, and durability) is an acronym and mnemonic device used to refer to the four essential properties a transaction should possess to ensure the integrity and reliability of the data involved in the transaction.
## References

[^1]: [[Home Page - A Dictionary of Computer Science by Oxford Reference]]
[^2]: https://www.techtarget.com/searchdatamanagement/definition/ACID