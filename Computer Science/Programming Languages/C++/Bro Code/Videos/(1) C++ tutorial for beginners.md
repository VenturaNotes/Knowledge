---
Source:
  - https://www.youtube.com/watch?v=S3nx34WFXjI
---
- ![[Screenshot 2024-12-13 at 9.49.05 AM.png]]
	- [[C++]] is a fast language
		- Used in advanced graphics apps (adobe applications, video editing software)
		- Considered a middle-level language
			- Used with embedded systems
		- Creates video games
	- Compared to other programming languages, c++ is a middle level language
		- Higher level a programming language, the more it resembles human language
		- Languages that are closer to being lower level resemble hardware instructions 
	- Spectrum (the higher the level of a programming language, the more it resembles a human language)
		- Human language
		- High Level: python, java, c#
			- Easier to write with but tends to be slower
		- Middle Level: C++, C
			- More effort to write but very fast (benefit of working closely with machine hardware while still somewhat resembling human language)
			- High learning curve with C++
		- Low Level: ASM
		- Hardware
	- On glassdoor.com, the average salary for a C++ Software Engineer is $124,550/yr (April 15, 2022)
		- Entry level does show 64k
		- Important to create a portfolio
		- Work on job interview skills
	- What do you need to get started?
		- (1) Text editor: VSCode, Code::Blocks, or even notepad
			- VSCode and Code::Blocks considered IDEs.
				- Integrated Development Environments
					- They are a text-editor as well as a workshop that contain a lot of useful developer tools
			- Video will show to download VSCode
- ![[Screenshot 2024-12-13 at 3.59.31 PM.png]]
	- (2) [[Compiler]]: It's a piece of software that parses source code to machine instructions
		- If using windows or linux, best to go with gcc. If on mac, will probably go with clang
	- Can download VSCode from https://code.visualstudio.com
		- Get the extension C/C++
		- Next extension is code runner
		- Make sure to get .cpp extension at end of file
			- It's a C++ file
	- Now download compiler
		- code.visualstudio.com/docs
		- Compiler depends on operating system you're running on
			- GCC on Linux and Windows
			- Clang for macOS
	- Installing compilers for these operating systems
		- For Linux
			- Check in terminal `gcc -v` to see if it's installed
			- Otherwise, enter `sudo apt-get update`
			- Then install GNP compiler tools by typing in `sudo apt-get install build-essential gdb`
		- For Mac
			- On terminal, `clang --version`
			- If not installed, type `xcode-select --install`
		- For Windows
			- Install` Mingw-w62` (link to installer) can be found on https:code.visualstudio.com/docs/cpp/config-mingw on step 3
			- Then follow instructions on MSYS2 website (https://msys2.org)
				- In terminal type `pacman -Syu`
				- Type `Y` to proceed with installation
				- Type `Y` again to confirm to proceed
			- Find `MSYS2 MSYS` from start menu
			- Then type command in new terminal `pacman -Su`
				- Type `Y`
				- Then type `pacman -S --needed base-devel mingw-w64-x86_64-toolchain`
				- Type `Y` or enter
			- Now find `Mingw-w64` bin folder
				- Likely in C drive in following folders:
					- `msys64`
					- `mingw64`
					- `bin`
						- Then copy address of this location
			- Add that path to Windows PATH environment variable
				- Search `settings`
				- Search `edit environment variables`
				- Go to `path` $\to$ `edit`
				- Click `New` and then paste address (okay all)
			- Open command prompt to make sure working
				- `g++ --version`
			- Then good to go!
```c++
#include <iostream>

int main() {

    //This is a comment
    /*
        This
        is
        a
        multi-line
        comment
    */

    std::cout << "I like pizza!" << '\n';
    std::cout << "It's really good!" << '\n';
    return 0;
}
```
- `<iostream>` is a header file that contains functions for basic input and output operations
	- By writing `#include <iostream>`, we're including that header file
	- Then we have access to a bunch of useful input and output operations
- main function is where the program begins
	- Begin program by invoking main function
		- Reading any code in main function starting at top and working our way down
		- At end of main function, will want `return 0`
			- If we reach this, that means there were no problems in this program
			- If `1` is returned, that means there was a problem / issue
	- Will write some basic output in this function
		- `std` means standard
			- `cout`: `c` means character and `out` means output
		- All together `std::cout` means standard character output
			- Will display some characters as output
		- Then followed with two left angle brackets `<<`
			- These characters mean output. Also known as left shift operator when used with numbers
		- Add end of statements, we end it with a semicolon `;`
			- Lets compiler know that this statement is done
		- Can end line by doing `<< std::endl`
			- `endl` means end line
		- Another option for a new line which is better performance wise is to add `\n`
			- Adding a new line character does the same thing and is better performance-wise
		- Benefit of using `endl` though is that it will flush the output buffer
		- A comment is ignored by the compiler
			- `//This is a comment`
				- Used for yourself for notes or notes for another developer
		- A multi-line comment is used like this: `/* Hello */`