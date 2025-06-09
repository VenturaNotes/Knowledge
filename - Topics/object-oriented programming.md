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
- The fact that objects can be defined in terms of other objects is an important feature of OOP. A 'child' object type (or subclass) inherits all of its parent's methods and properties (which may have been inherited in turn from its parent) as well as defining its own. This facility allows complex hierarchies of related objects to be created. A child object type may override a method or property of its parent by defining a new method or property of the same name:
	- ![[Screenshot 2025-03-20 at 3.26.43 PM.png]]
- If the 'travel' method of a variable of type 'stretchLimo' is called, it is stretchLimo's own version that is invoked rather the version inherited from class 'automobile.'
- Child object types may be treated as if they are one of their ancestor types. The following is a legal assignment using C++ pointers:
	- ![[Screenshot 2025-03-20 at 3.27.07 PM.png]]
- No data is lost, but only those properties and methods defined for class 'automobile' will be available to variable myLimo.
### Polymorphism
- If a method has been overridden, it is usually the overriding method defined in a child class that is invoked. For example,
	- ![[Screenshot 2025-03-20 at 3.27.39 PM.png]]
	- will invoke the 'travel' method defined in class stretchLimo because 'myLimo' is in fact a stretchLimo object. (Note that in C++ methods must be designated 'virtual' to achieve this behavior; in such languages as Java it is automatic.)
- This capability, called polymorphism, gives object-oriented programming its great power. The class 'automobile' could have numerous subclasses defined, each extending it in ways appropriate to a particular brand of automobile; and each might have its own version of the 'travel' method, tuned to suit its own characteristics. Yet, when an object of any subclass is assigned to pointer variable of class 'automobile' and the 'travel' method invoked, it is the variant defined for the appropriate subclass that is invoked. Each object thus carries the knowledge of how to manipulate itself, and the code that uses such objects need not be aware of exactly which type of object it is manipulating. This enhances encapsulation, reducing the complexity and increasing the robustness of almost any nontrivial programming project.
- An important application of polymorphism is in interfaces. These may be defined as abstract classes: that is, classes that define properties and methods but which do not provide any implementations for the methods. An implementation of an interface is a subclass that overrides all the interface's methods with versions that provide appropriate functionality.
### Languages
- The first complete realization of an object-oriented programming system was Smalltalk. A more recent example is Ruby. In addition a large number of modern programming languages contain features of object-oriented systems; examples are C++, C\#, Java, and Visual Basic.

## Source[^3]
- In object-oriented programming, a [[subclass]] can redefine a method from its [[superclass]]
	- #question What is a subclass and what is a superclass?
	- #question Do subclasses and superclasses only exist in object-oriented programming? 
## Source[^4]
- Object-oriented programming, or OOP, is a programming style focused on objects rather than long lists of functions. Objects tend to contain all the functions within them. Many objects can be reused which means that programmers don't have to recreate code for problems that have already been solved. OOP is highly structured and avoids repetition and bugs.
## References

[^1]: https://spdload.com/blog/software-development-glossary/
[^2]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: ChatGPT
[^4]: [[Home Page - Glossary by Capterra]]