---
Source:
  - https://youtube.com/watch?v=GJPZTO5Yffw
Reviewed: false
---
- Delphi community edition is free for the first year
	- File $\rightarrow$ New $\rightarrow$ Console Application
	- .dproj extension important (similar to .pas for pascal)
	- "Ctrl + D" will format the code for you
	- Must use `sleep(5000);` instead of `rekey;
		- Keeps the console window open for 5 seconds on Delphi
- Data type is the type of information you want to store or have

```Pascal
program MyFirstProgram;

uses crt;

{
	Types of variables
			- integer -> -9 99 32 1 0 -2
			- real/double -> -9.21 3.14159 99.0 -99.0
			- boolean -> true (yes) false (no)
			- string -> 'sadasd' 'hello'
				- Strings must be single quotes
			- char -> 'x'
}

var
	age: integer;
	firstName, hobby: string; //one line to store everything with same data type
	//snake_case is discouraged
	//camelCase or PascalCase is recommended
	letter: char;

const //value that cannot change
    VAT = 0.15; 

begin
	age := 40;
    firstName := 'Mike';
    hobby := 'waching anime';

	Writeln('I am ', age, ' years old and tomorrow I will be ', age +1,' years old');
    age := age + 1;
    Writeln('My name is ', firstName, ' (', age, '). ', firstName,' is a cool name, but I want to');
    firstName := 'Jack';
    Writeln('change my name to ', firstName,'. I also like ', hobby, '.');
end.
```

Output
```
I am 40 years old and tomorrow I will be 41 years old
My name is Mike (41). Mike is a cool name, but I want to
change my name to Jack. I also like waching anime.
```