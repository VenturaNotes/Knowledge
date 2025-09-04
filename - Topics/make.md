## Synthesis
- 
## Source [^1]
- A utility program—developed initially to run under UNIX—that can interpret a build script (provided as an input file) containing instructions defining how, for example, to build a program from a set of source text files. The instructions can indicate the tools (such as language compilers, link editors, etc.) to be used to transform the text to intermediate forms, and then to convert these intermediate forms into an executable binary. An important feature of make is its ability to rebuild a program after some of its components have been changed. When operating in this mode, make will interpret the interdependency information inherent in the build script and use this to carry out the minimum set of operations. Thus, for example, if a source language module (or any of the definition files upon which it depends) has not been changed, then it will not recompile the module. Make was designed to work closely with sccs.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]