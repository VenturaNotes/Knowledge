[Video](https://youtube.com/watch?v=yJf5uVL_xQ8)

- Setup (by Julian Ventura)
	- Add the extension "Pascal" on VSCode
	- Download FreePascal from [here](https://www.freepascal.org/download.html)
		- Turn off the "Tags: Autogenerate" Extension
	- Write in terminal `Brew install global`
		- Brew might already need to be installed?
- Pascal is a General purpose high-level programming language
- Created in early 1970s
- Can be compiled on a variety of computer platforms (windows, linux, and mac works)
- Strongly typed (normal for languages such as c++ and nim)
	- Specific
		- If something is a number, you have to specify that it's a number
		- If it's a piece of text, you have to specify it's a piece of text
	- You can't change later what you set it as
- Pascal is primarily a functional programming language (does not have oop)
	- It does now support object-oriented programming in Delphi
		- "Delphi is a general-purpose programming language and a software product that uses the Delphi dialect of the Object Pascal programming language" [^1]
- .pas means it's a pascal file
- To run code
	- `fpc <name_of_file.pas>
- "main.o" is an object file
	- Can use to link files together
- main
	- Allow us to run the program in terminal `./main`

```Pascal
program MyFirstProgram;

//allows us to use read key (allows us to see the console which displays an output)
uses crt; //similar to importing modules in python

{
    Multline
    comment
}
(*
    Also a block comment
*)

//this is a scope
begin
    WRiteLn('Hello World'); //must use single quotes

    readkey; //waits for you to press a key before program ends
end. //needs to be a dot

//Pascal is not case sensitive
```

## References

[^1]: https://en.wikipedia.org/wiki/Delphi_(software)