---
aliases:
  - OLTP
---
## Synthesis
- 
## Source [^1]
- The use of a database for data storage, maintenance, and interrogation. The term is used especially to distinguish this 'normal' use of databases from the more specialized online analytical processing, and also to distinguish the differing designs appropriate for each use. A basic rule of OTLP databases is that data should not be duplicated in any way. This ensures data consistency and efficient update, but causes complex analytical queries to perform slowly because all aggregates much be recomputed every time. Today most OLTP databases use the relational database model.
## Source[^2]
- Online transaction processing (OLTP) is a database system paradigm for handling transactional data. In computing, a transaction is defined as a sequence of discrete actions that are treated as a single unit. For example, withdrawing money from a bank account is a transaction that involves multiple steps (debiting the first account and crediting the second). OLTP systems need to be atomic: if one step fails, the entire transaction should fail. They also need to be highly available, fast, and capable of handling potentially large amounts of concurrent transactions. The OLTP paradigm is contrasted with online analytical processing (OLAP), which is a database architecture for performing business queries and analytics.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[Home Page - Glossary by Capterra]]