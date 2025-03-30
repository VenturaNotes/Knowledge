## Synthesis
- 
## Source [^1]
- The data model proposed by the CODASYL DBTG (see CODASYL) in which data is organized into records of different types and records are organized into sets of different types, both record and set types being named. A particular set type is defined as having an owner record type and one or more member record types. An instance of a set type consists of a single instance of its owner record type and zero, one, or more instances of each of its member record types. A member record instance may not occur in more than one instance of a particular set type.
- In practice sets usually have only one member record type when, in effect, the CODASYL network model provides for a one-many relationship between the two types of records to be maintained, modeled as an isomorphism between the owner record instances and the elements of a disjoint partition of the member record instances. A set is said to be mandatory if this partition is constrained to be a complete cover and optional if it need not be. A way of implementing database systems based on this model is by pointers embedded in the records, but pointers and this implementation technique are not inherent to the model, which is formulated in terms of abstractions.
- Interest in the CODASYL network model declined with the rise of the relational model from the 1980s.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]