---
aliases:
  - macro
  - macros
---
## Synthesis
- 
## Source [^1]
- An instruction in a programming language that is replaced by a sequence of instructions prior to assembly or compiling. A macroassembler is an assembler that permits the user to define macros, specifying the macroinstruction form, its arguments, and a replacement text (otherwise called the body of the macro), and then allows macroinstructions to be interspersed among the assembly code. On encountering a macro the assembler replaces it by the macro body, substituting the parameters provided in the places marked in the macro body. The macro thus provides a mechanism for inserting a particular body of text at various places in a program (and is thus the same thing as an open subroutine, though this nomenclature is obsolete).
- A macroprocessor provides similar facilities, though not in combination with an assembler. It accepts macro definitions and then reads arbitrary text in which macro calls (i.e. instances of a macro name) can occur. Text is copied to the output until a macro name is encountered: when this happens the arguments (parameters) are found and the macro call is replaced by the macro body in the output stream, with appropriate substitution of the parameters.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]