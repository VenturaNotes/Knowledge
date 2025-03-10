---
aliases:
  - OOP
---
## Synthesis
- 
## Source [^1]
- A programming paradigm based on the concept of “objects,” which are data structures that contain data in the form of fields (often known as attributes or properties) and code in the form of procedures (often known as methods).

## Source[^2]
- A programming technique that involves objects
- Object-oriented programming (OOP) is a programming technique that combines data abstraction and inheritance. The central feature is the object, which in practical terms is a development of a data structure. The latter is a composite data type, consisting of a collection of appropriate variables. The object comprises a data structure definition and its defined procedures in a single structure.
- Objects are instances of a class, each instance having its own private instance variables. The class definition defines the properties of the objects in a class. A particularly important feature is inheritance, which allows new classes to be defined in terms of existing classes, inheriting some or all of the properties of an existing class. This facilitates sharing of code, since users can inherit objects from system collections of code.
- The procedures of an object (often called methods) are activated by messages sent to the object by another object. Thus in an object-oriented programming system the basic control structure is message passing. The programmer identifies the real-world objects of the problem and the processing requirements of those objects, encapsulating these in class definitions, and the communications between objects. The program is then essentially a simulation of the real world in which objects pass messages to other objects to initiate actions. The interior structure of the object is entirely hidden from any other object (a property called encapsulation).
- Objects add several capabilities to the data structure. The most important are briefly described below.
### Procedures
- Objects can contain procedures (methods) as well as variables (also called properties). For example, a data type representing an automobile might be defined in C as follows:
	- ![[Screenshot 2025-03-09 at 3.56.24 AM.png]]
- Variables of type ‘automobile’ would then be instantiated, initialized by assigning appropriate values to their component subvariables, and manipulated by appropriate procedures. In OOP, the automobile structure could be reformulated in C++ to include a procedure:
	- ![[Screenshot 2025-03-09 at 3.57.29 AM.png]]
- Assuming a variable of type ‘automobile’ called ‘gasGuzzler,’ the method ‘travel’ could be called thus:
	- ![[Screenshot 2025-03-09 at 3.57.58 AM.png]]
- (The significance of the keyword ‘virtual’ is explained below.)
### Inheritance

## References

[^1]: https://spdload.com/blog/software-development-glossary/
[^2]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]