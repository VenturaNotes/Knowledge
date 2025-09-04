## Synthesis
- 
## Source [^1]
- Correctness checks built into data processing systems and applied to batches of input data, particularly in the data-preparation stage. There are two main forms of batch control: sequence control involves numbering the records in a batch consecutively so that the presence of each record can be confirmed during data validation; control totals involve establishing record counts, or totals of the values in selected fields within each record, and checking these totals during data validation. Control totals may be 'meaningful', in the sense that they may have a use (for instance to an auditor) that is additional to their function within the system. Most commonly, however, they are meaningless totals (e.g. of employee numbers), often referred to as hash totals.
- The scope of batch control may extend beyond the data validation stage for as far into the system as batches retain their separate identities. In particular, they may be used to check that incorrect records, rejected during data validation, are resubmitted before a batch is released for further processing.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]