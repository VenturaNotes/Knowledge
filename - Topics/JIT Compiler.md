---
aliases: just-in-time compiler
---
## Synthesis
- 
## Source [^1]
- Compiles code before it is executed

## Source[^2]
- JIT compiler (just-in-time compiler) A software utility that translates a program unit into machine code when it is first called at runtime. The resulting machine code is then cached for reuse on subsequent calls. JIT compilers have the advantage over traditional compilers that they are aware of the program's runtime environment and can optimize the code they generate accordingly. They are most often used as part of a two-stage compilation process. A program's source code is compiled by a traditional compiler into a machine-independent intermediate code, which forms the program image stored on disk and is loaded when the program is launched. Units of this intermediate code are then translated on demand by a JIT compiler into appropriate machine code for the platform that is executing the program. Thus, the 'just-in-time' element is usually confined to the comparatively fast process of code generation, where it can be used to its greatest advantage. Programs that use this approach have a small compilation overhead at runtime, which usually manifests especially when they are first launched; however, this is acceptable for many types of application and subsequent speeds are equivalent to traditionally compiled code. Where this overhead is unacceptable, traditional compilation remains the appropriate technique.
## References
[^1]: [[Home Page - Beginning Software Engineering by Rod Stephens#^gp3rl7]]
[^2]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]