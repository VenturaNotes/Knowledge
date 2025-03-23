## Synthesis
- 
## Source [^1]
- (1) See APPLICATION PACKAGE. 
- (2) In Ada, a self-contained collection of entities (data objects and procedures) that are available for other parts of a program to use. A package consists of two parts that can be separately compiled: its specification and its body. The specification provides the public information about the entities that the package makes available, in the form of declarations of constants, variables, and data types, and procedure headers. It may also contain a private part giving further information about types and constants that is needed by the compiler but not by a programmer using the package. The package body contains the procedure bodies for the procedures that form part of the package, together with local variables and types that these procedures may need. The separation of specification and body means that the implementation of the procedures is hidden from the users, thus a package is a realization of an abstract data type.
- Similar features are found in other languages, particularly Modula 2: here the term module is used in preference to package. In Modula 2 a module comprises a definition part and an implementation part, corresponding to the specification and body of the Ada package. The main difference is that the definition part of a module contains declarations of all the objects required by the module, together with an export list specifying which objects are visible outside the module.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]