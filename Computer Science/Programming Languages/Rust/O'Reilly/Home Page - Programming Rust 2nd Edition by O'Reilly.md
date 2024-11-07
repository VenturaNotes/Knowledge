---
Source:
  - zotero://open-pdf/library/items/AJNCXBFI?page=1&annotation=BANS8583
Length: "736"
tags:
  - status/incomplete
  - type/textbook
Year: 2021-06-20
errata: https://www.oreilly.com/catalog/errata.csp?isbn=0636920258049
---
- Covers Rust 1.50

## Intro
- “[[Systems programming]] provides the foundation for the world’s computation.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=2&annotation=K5RMN6CA))
	- #question What is meant by "world's computation?"
	- #question What does systems programming mean exactly?
- [[Rust]]
	- Helps control [[memory]], [[processor time]], and other [[system resources]]
	- Catches broad classes of common mistakes from memory management errors to interthread [[data races]]
		- #question what is an interthread?
	- Enables memory safety and trustworthy [[concurrency]]
- “bridge the gap between performance and safety using Rust.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=2&annotation=CL5AGMY4))
- Authors are Jim Blandy, Jason Orendorff and Leonora Tindall

## Preface
- “[[Rust]] is a language for [[systems programming]].” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=17&annotation=RWR3QBW2))
- Closing [[laptop]] (system programmers did the below)
	- Operating system detects this
	- Suspends all running programs
	- Puts computer to sleep
	- Open laptop
		- Screen and other components powered on again
		- Program picks up where it left off
- What is system programming for?
	- [[Operating systems]]
	- [[Device driver|device drivers]]
	- [[Filesystem|Filesystems]]
	- Databases
	- Code running on cheap devices or devices that must be extremely reliable
		- #question Like what devices need to be extremely reliable?
	- [[Cryptography]]
	- [[Media codecs]]
		- Software for reading and writing audio, video, and image files
	- [[Media processing]] 
		- Examples: Speech recognition or photo editing software
	- [[Memory management]] such as implementing a [[garbage collector]]
	- [[Text rendering]] (converting text and fonts to pixels)
	- Implementing higher-level languages ([[javascript]] and [[Python]])
	- [[Networking]]
	- Visualization and software containers
		- #question what is this?
	- Scientific simulations
		- #question how is system programming related to simulations. MathWorks? 
	- Games
		- #question what kind of games is system programming for
- “systems programming is resource-constrained programming” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=18&annotation=JDLB49CS))
	- “every [[byte]] and every [[CPU cycle]] counts.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=18&annotation=UX57I475))
- Amount of systems code involved in supporting an app is staggering
	- #question what is systems code?
- Book won't teach systems programming but will cover many details of [[memory management]]
### Who Should Read This Book?
- Alternative to C++
- “Build something you’ve never built before, something that takes advantage of Rust’s speed, concurrency, and safety.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=18&annotation=RPCF47EK))

### Why We Wrote This Book
- Minimize learning by trial and error

### Navigating This Book
- “[[Traits]] are like interfaces in Java or C#.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=19&annotation=ZCVJTKD2))
	- “main way Rust supports integrating your types into the language itself.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=19&annotation=5MAY37NP))

### Using Code Examples
- Supplemental material can be explored here
	- https://github.com/ProgrammingRust
	- #question should i explore this?
- “Selling or distributing examples from O’Reilly books does require permission.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=20&annotation=4NZ74PQS))
- “We appreciate, but do not require, attribution.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=20&annotation=47TIXAXX))

## (1) Systems Programmers Can Have Nice Things
- “the context [[Rust]] is targeting—being 10x or even 2x faster than the competition is a make-or-break thing.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=23&annotation=R6VGMTIG))
- “All computers are now parallel... [[Parallel programming]] is programming” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=23&annotation=WB3VSMLH))
- “TrueType parser flaw” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=23&annotation=U75M83HB))
	- #question what is this?
- What is going on with the below code?
```c
int main(int argc, char **argv){
	unsigned long a[1];
	a[3] = 0x7fff7b36cebUL;
	return 0;
}
```
- Explanation
	- Storing this value in the fourth element of array corrupts the function call stack
		- #question what is a function call stack?
	- Instead of returning from main function, jumps into midst of code from the standard C library for retrieving a password from a file in the user's home directory. Doesn't go well
		- I believe the effect is different depending on the machine you're running the above code from
- #question learn what the code above does
	- “using `a[3]` is, according to the C programming language standard,[[undefined behavior]]:” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=24&annotation=LSLC47NA))
		- “Behavior, upon use of a nonportable or erroneous program construct or of erroneous data, for which this International Standard imposes no requirements” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=24&annotation=WN76DDZY))
			- #question what does nonportable mean?
			- “standard explicitly permits the program to do anything at all.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=24&annotation=7LKLFXPQ))
- “[[C]] and [[C++]] have hundreds of rules for avoiding undefined behavior.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=24&annotation=REEIBZF6))
	- Don't access memory you shouldn't
	- Don't let arithmetic operations overflow
	- Don't divide by zero
	- etc.
- [[Complier]] does not enforce the above rules.
	- “The responsibility for avoiding undefined behavior falls entirely on you, the programmer.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=24&annotation=Y28YZTD6)) ç
- “[[University of Utah]], researcher [[Peng Li]]” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=24&annotation=P6DA8NKU))
	- “modified C and C++ compilers to make the programs they translated report whether they executed certain forms of undefined behavior.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=24&annotation=CPRVCVZU))
- “1988 Morris Worm used a variation of the technique shown earlier to propagate from one computer to another on the early Internet.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=24&annotation=VM2DR8V9))
	- #question 1988 Morris Worm further research
	- Inadvertent undefined behavior has been a major cause of security flaws
- “So C and C++ put programmers in an awkward position: those languages are the industry standards for systems programming, but the demands they place on programmers all but guarantee a steady stream of crashes and security problems.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=24&annotation=3VZ64EHP))
### (1.1) Rust Shoulders the Load for You
- “[[Stuxnet]], a computer worm found breaking into industrial control equipment in 2010, gained control of the victims’ computers using, among many other techniques, undefined behavior in code that parsed [[TrueType]] fonts embedded in word processing documents.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=24&annotation=3T2XK7IA))
	- “any software that might handle data from an untrusted source could be the target of an exploit.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=KBG4EW9Q))
		- Not just operating systems and servers
- “The [[Rust]] language makes you a simple promise: if your program passes the compiler’s checks, it is free of undefined behavior.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=YWQFAWPT))
	- “[[Dangling pointers]], [[double-frees]], and [[null pointer dereferences]] are all caught at compile time.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=TLFSQM5W))
	- “[[Array references]] are secured with a mix of [[compile-time]] and [[run-time]] checks, so there are no [[buffer overruns]]” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=M8FK3PX8))
		- “Rust equivalent of our unfortunate C program exits safely with an error message.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=RSGAQ36X))
	- “Rust aims to be both safe and pleasant to use.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=NDDGSBUS))
		- “stronger guarantees about your program’s behavior, Rust imposes more restrictions on your code than C and C++ do, and these restrictions take practice and experience to get used to.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=5KL7QMGE))
		- “issues of memory management and pointer validity are taken care of.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=XZVKMT9A))
		- “[[debugging]] is much simpler when the potential consequences of a bug don’t include corrupting unrelated parts of your program.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=IGBJQY4V))
	- Still plenty of bugs that Rust cannot detect but undefined behavior is taken care of
### (1.2) Parallel Programming is Tamed
- [[parallel programming]]
- “[[Concurrency]] is notoriously difficult to use correctly in C and C++.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=KTN65Q3I))
- Concurrency only usually used when single-threaded code has proven unable to achieve performance needed
	- #question what is single-threaded code?
- [[parallelism]] really important to modern machines that it shouldn't be treated as a last resort
- “same restrictions that ensure memory safety in Rust also ensure that Rust programs are free of [[data races]].” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=U5KNYFZE))
	- “can share data freely between [[Thread|threads]], as long as it isn’t changing.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=K723ZHI4))
	- “[[Data]] that does change can only be accessed using synchronization primitives.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=DY9RBTCI))
		- #question what is synchronization primitives?
- “All the traditional concurrency tools are available: [[mutexes]], [[condition variables]], [[channels]], [[atomics]], and so on. Rust simply checks that you’re using them properly.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=53DFFBI6))
	- “This makes Rust an excellent language for exploiting the abilities of modern multicore machines.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=SZ4AARC6))
		- #question what is a multicore machine?
		- “Rust ecosystem offers libraries that go beyond the usual concurrency primitives and help you distribute complex loads evenly across pools of processors, use lock-free synchronization mechanisms like Read-Copy-Update, and more.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=25&annotation=RW9NSFXK))
			- #question what is meant by primitives
			- #question what is concurrency primitives?
			- #question what is a complex loads
			- #question what is meant by pools of processors
			- #question what are lock-free synchronization mechanisms
### (1.3) And Yet Rust is Still Fast
- “Rust shares the ambitions [[Bjarne Stroustrup]] articulates for C++ in his paper “Abstraction and the C++ Machine Model”:” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=26&annotation=64I7DZ7E))
	- #resource I wonder what is in his paper
	- “In general, C++ implementations obey the[[zero-overhead principle]]: What you don’t use, you don’t pay for. And further: What you do use, you couldn’t hand code any better.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=26&annotation=E5RSAW9W))
		- #question How can we be so sure that we can't hand code any better
		- #question What is meant by hand coding
- “[[Systems programming]] is often concerned with pushing the machine to its limits.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=26&annotation=XSE7KUPW))
	- For video games, machine should devote itself to creating best experience for player
	- For web browsers, efficiency of browser sets the ceiling on what content authors can do
		- #question what is a content author 
	- “Within the machine’s inherent limitations, as much [[memory]] and [[processor]] attention as possible must be left to the content itself.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=26&annotation=XR44BJMV))
	- “same principle applies to [[operating systems]]: the [[kernels|kernel]] should make the machine’s resources available to user programs, not consume them itself.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=26&annotation=PCEQ25SZ))
		- #question give examples of user programs
- “One can write slow code in any general-purpose language.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=26&annotation=BMMJLUYA))
	- #question what is a general-purpose language? 
- Rust is considered fast because if you make the best use of the underlying machines' capabilities, Rust supports you in that effort.
	- #question how though?
	- “The language is designed with efficient defaults and gives you the ability to control how memory gets used and how the processor’s attention is spent.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=26&annotation=UAQHZ5UH))
		- #question give examples of efficient defaults
		- #question what is the best way to control memory in rust?
		- #question How can you manipulate the processor
			- #question what does a processor even look like? 
### (1.4) Rust Makes Collaboration Easier
- Rust has support for code sharing and reuse
- “Rust’s package manager and build tool, [[Cargo]], makes it easy to use libraries published by others on Rust’s public package repository, the [[crates.io]] website.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=26&annotation=S2EH9VD9))
	- #resource Website might be helpful
	- “You simply add the library’s name and required version number to a file, and Cargo takes care of downloading the library, together with whatever other libraries it uses in turn, and linking the whole lot together.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=26&annotation=LX6MAB8A))
- “You can think of Cargo as Rust’s answer to [[NPM]] or [[RubyGems]], with an emphasis on sound version management and reproducible builds.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=26&annotation=36CLEZCS))
- Rust libraries can provide
	- serialization
	- HTTP clients and servers
	- Modern graphics APIs
- Language designed to support collaboration
	- “[[Rust]]’s [[Traits]] and [[Generic|generics]] let you create libraries with flexible interfaces so that they can serve in many different contexts.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=26&annotation=TMMPSBQS))
- “Rust’s standard library provides a core set of fundamental types that establish shared conventions for common cases, making different libraries easier to use together.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=26&annotation=QFV7VCSD))
	- #question more details about rust's standard library
## (2) A Tour of Rust
- Benefits of rust
	- Safe, performant systems programming
- A simple calculation on its command-line arguments with unit tests shows Rust's core types and introduces [[Traits]]
- “[[Rust]]’s promise to prevent undefined behavior with minimal impact on performance influences the design of every part of the system, from the standard data structures like vectors and strings to the way Rust programs use third-party libraries.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=27&annotation=J2JAXJC4))
### (2.1) rustup and Cargo
- Best way to install Rust is to use [[rustup]]
	- Tool used for managing Rust installations like [[RVM]] for [[Ruby]] or [[NVM]] for [[Node]]
	- Use https://rustup.rs/ to start
		- `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- Can also get pre-built packages on Rust website for Linux, [[macOS]], and Windows.
	- Can type `rustup update` to upgrade when new version of Rust is released
- 3 new commands available
	- `cargo --version`
		- [[Cargo]] is Rust's compilation manager, package manager, and general-purpose tool. Can use it to start a new project, build and run your program, and manage any external libraries your code depends on
			- #question I need examples
		- “Cargo can create a new Rust package for us, with some standard metadata arranged appropriately:” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=28&annotation=3NCCVTYK))
	- `rustc --version`
		- [[rustc]] “is the Rust compiler. Usually we let Cargo invoke the compiler for us, but sometimes it’s useful to run it directly.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=28&annotation=9CHFI58I))
	- `rustdoc --version`
		- “[[rustdoc]] is the Rust documentation tool. If you write documentation in comments of the appropriate form in your program’s source code, rustdoc can build nicely formatted HTML from them. Like rustc, we usually let Cargo run rustdoc for us.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=28&annotation=W3LYJKNI))
- Example
	- `$ cargo new hello`
		- Creates a new package directory named `hello`, ready to build a command-line executable
			- #question what is a package directory
			- #question go into detail about command-line executables
	- In the package's top-level directory #question check more details
		- ![[Screenshot 2024-08-13 at 6.44.25 PM.png|500]]
			- #question What does `ls -la` do?
		- Cargo created a [[Cargo.toml]] to hold [[metadata]] for the package
			- ![[Screenshot 2024-08-13 at 6.39.37 PM.png]]
			- If program needs [[dependency|dependencies]] on other libraries, we can record them in this file and Cargo will take care of downloading, building and updating those libraries for up
				- #question Does it work like a docker? 
		- Cargo has set up our package for use with the git version control system creating a `.git` metadata directory and a `.gitignore` file. You can use cargo to skip this step by passing `--vcs none to cargo new` on the command terminal
			- #question what makes a package?
			- #question what is the git version control system
			- #question is the --vcs code I wrote above correct?
		- The `scr` subdirectory contains the actual rust code `main.rs`
			- #question What is `ls -l` in a directory?
		- The `main.rs` file contains the text
			- ![[Screenshot 2024-08-13 at 6.47.41 PM.png|300]]
	- This is the extent of the boilerplate for a new Rust program: two files
		- #question what is a boilerplate
	- We can invoke the `cargo run` command from any directory in package to build and run program
	- “Here, Cargo has invoked the Rust compiler, rustc, and then run the executable it produced.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=30&annotation=LX2RGNGR))
	- “Cargo places the executable in the target subdirectory at the top of the package:” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=30&annotation=IRJZHMIJ))
		- ![[Screenshot 2024-08-13 at 7.29.42 PM.png]]
			- #comment I believe that the `hello` is the executable although
				- #question what type is this executable? It can't be a .exe since it's not explicitly shown and I'm running on a mac
	- `cargo clean`
		- This will clean up the generated files for us so tat the `target` subdirectory will no longer exist



### (2.2) Rust functions
- Here is a function that computes the [[greatest common divisor]] of two integers using [[Euclid's algorithm]]

```rust
fn gcd(mut n: u64, mut m: u64) -> u64 {
	assert!(n != 0 && m != 0);
	while m != 0 {
		if m < n {
			let t = m;
			m = n
			n = t;
		}
		m = m % n;
	}
	n
}
```
- #question Why is the n alone?
- #question what does assert do?
- #question What is the meaning of u64?
- #question what does mut mean?
- #question what does the arrow mean? Is it required or is it like python where it just suggests the type of output the function is looking for? 
- The [[fn (rust)|fn]] keyword (pronounced "fun") introduces a function.
	- The [[parameter (rust)|parameters]] n and m are of type [[u64]] which does means its an unsigned 64-bit integer
		- #question how do we know u64 is always just an integer? 
	- “The -> token precedes the return type:” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=31&annotation=E3KVRAZ2))
		- Our function returns a u64 value
		- Four-space indentation standard in Rust 
- [[i32]] is a signed 32-bit integer
- [[u8]] is an unsigned 8-bit integer (used for "byte" values)
	- #question what does "used for byte" values mean?
- [[isize (rust)|isize]] and [[usize (rust)|usize]] types hold pointer-sized signed and unsigned integers, 32 bits long on 32-bit platforms, and 64 bits long on 64-bit platforms
	- #question what does pointer-sized mean?
	- #question examples of 32-bit and 64-bit platforms
		- #question what is the difference between them and the calculation
- “Rust also has two floating-point types, [[f32]] and [[f64]], which are the IEEE single- and double-precision floating-point types, like [[float]] and [[double]] in C and C++.” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=31&annotation=LJEGER5Z))
	- #question What is IEEE single and double precision floating-point types?
- By default, once a variable is initialized, its value can't be changed, but placing the [[mut (rust)|mut]] keyword (pronounced "mute", short for [[mutable]]) before the parameters `n` and `m` allows our function body to assign to them
	- Most variables don't get assigned the `mut` keyword
- The function's body starts wit ha call to the assert! macro, verifying that neither argument is zero
	- #question what is meant by macro here?
	- The ! character marks this as a macro invocation, not a function call
		- #question What is a function call and how would you do one?
- There is a similar assert macro in C and C++
- Rust's assert! checks that the argument is true and terminates the program otherwise with the source location of the failing check. This kind of abrupt termination is called a [[panic]]
- In C and C++, assertions can be skipped while Rust always checks assertions regardless of how the program was compiled. 
	- #question Is Rust a compiled language or interpreted? Does it check the assertion first or something else? 
- There is a debug_assert! macro whose assertions are skipped when the program is compiled for speed
	- #question Is it necessary to have the exclamation point afterwards?
- Unlike C and C++, [[Rust]] does not require parentheses around the conditional expressions, but does require curly braces around the statements they control
- A [[let (rust)|let]] statement declares a [[local variable (rust)|rust]]. Don't need to write out type of variable as long as Rust can infer it from how the variable is used
	- Rust only infers types within function bodies: you must write out the types of function parameters and return values as before.
	- To spell out t's type, it'd be `let t: u64 = m`
- Rust has a [[return (rust)|return]] statement, but the gcd function doesn't need one. 
	- “If a function body ends with an expression that is not followed by a semicolon, that’s the function’s return value” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=32&annotation=PDAAJ8VN))
	- “any block surrounded by curly braces can function as an [[expression (rust)|expression]].” ([pdf](zotero://open-pdf/library/items/AJNCXBFI?page=32&annotation=TYX9CQYP))
		- #question what is the difference between functions and expressions in rust?
- Expression that prints a message and yields `x.cos()` as its value
```rust
{
	println!("evaluating cos x");
	x.cos()
}
```
- Typical in Rust to use this form to establish the function's value when control "falls off the end" of the function. Use return statements only for explicit early returns from the midst of a function
	- #comment falls of the end just means at the end of the function.
### (2.3) Writing and Running Unit Tests
- [[Unit test (rust)|unit tests]]  are built into the language
```rust
#[test]
fn test_gcd() {
	assert_eq!(gcd(14, 15), 1);

	assert_eq!(gcd(2*3*5*11*17,3*7*11*13*19), 3*11);
}
```
- This function checks that `gcd` returns correct values
- The `#[test]` marks `test_gcd` as a test [[function (rust)|function]] which skips it during normal compilations, but included and called automatically if we run our program with the `cargo test` command
- Test functions can be (1) scattered throughout our source tree or (2) placed next to the code they exercise, and `cargo test`  will gather them and run them together
	- #question what is a source tree in detail?
- The `#[test]` marker is an example of an [[attribute (rust)|attribute]]
	- #question what is a marker? 
- [[attribute (rust)|Attributes]] are an open-ended system for marking functions and other declarations with extra information (similar to [[attribute (C++)|attributes]] in C++ and [[attribute (C Sharp)|attributes]] in C#, or [[annotation (Java)|annotations]] in Java)
	- #question does this mean `#[test]` is a key term or could we name it anything?
	- Used to control compiler warnings and code style checks, include code conditionally (like [[ifdef (C)|#ifdef]] in C and C++), tell Rust how to interact with code written in other languages, and so on.
		- #question of compiler warnings?
		- #question more about code style checks
		- #question what does including code conditionally mean?
		- #question how can we make rust interact with other languages?
- Now the `gcd` and `test_gcd` definitions are added to the `hello` package
	- #question can we call them functions or definitions? Does it matter?
	- As long as our current directory is somewhere within the package's subtree, we can run `cargo test`. 
- ![[Screenshot 2024-08-14 at 6.48.38 AM.png]]
	- #question Analyze what ignored, measured, and filtered out means for a test
	- #question What does `ok` mean in this case?

### (2.4) Handling Command-Line Arguments
- How to take a series of numbers as command-line arguments and print their gcd
```rust
use std::str::FromStr;
use std::env;

fn main() {
	let mut numbers = Vec::new();

	for arg in env::args().skip(1) {
		numbers.push(u64::from_str(&arg)
					.expect("error parsing argument"));
	}
	if numbers.len() == 0 {
		eprintln!("Usage: gcd NUMBER ...");
		std::process::exit(1);
	}
	let mut d = numbers[0];
	for m in &numbers[1..] {
		d = gcd(d, *m);
	}
	println!("The greatest common divisor of {:?} is {}",
				numbers, d);
}
```
- Given `use std::str::FromStr;`
	- The first [[use (rust)|use]] [[declaration (rust)|declaration]] brings the standard library [[Traits|trait]] [[FromStr]] into [[scope]].
		- #question What are the standard libraries in Rust?
		- #question Why is `str` included when `FromStr` seems to explicitly state that we will be attempting to format strings? 
	- A [[Traits|trait]] is a collection of methods that types can implement
		- #question what is meant by types?
		- #question Is there a difference between methods, functions, and definitions?
			- #comment maybe definition could be like you can define a `let` to a variable but not sure.
	- Any [[type]] that implements the `FromStr` trait has a `from_str` method that tries to parse a value of that type from a string
		- The [[u64]] type implements `FromStr`, and we'll call `u64::from_str` to parse our command-line arguments.
			- #question Does it matter that `from_str` is lowercase? 
		- Even though we never use `FromStr` elsewhere in the program, a trait must be in scope in order to use its methods.
- Given `use std::env;`
	- The `std::env` [[module (rust)|module]] 
		- #question Why is it called a module now instead of a trait?
		- It provides several useful functions and types for interacting with the execution environment, including the [[args function (rust)|args function]], which gives us access to the program's command-line arguments
			- #question I would like to see a simpler example
			- #question What is the execution environment? What is meant by this?
- `fn main() {` doesn't return a value so we can omit the `->`and return type following the parameter list
- Given `let mut numbers = Vec::new();
	- A mutable local variable numbers is [[declare|declared]] and [[initialize|initialized]] to an empty [[vector]]. [[Vec (rust)|Vec]] is Rust's growable vector type analogous to 
		- C++'s std::vector
		- python list
		- Javascript array
	- Vectors are designed to be grown and shrunk dynamically, but we must mark the variable `mut` for Rust to let us push numbers onto its end
		- The type we're working with is `Vec<u64>` which doesn't need to be written out as Rust will infer that for us. It knows because we push onto the vector [[u64]] values, but also we pass the vector's elements to gcd, which accepts only u64 values
- Given `for arg in env::args().skip(1) {`
	- We us a [[for loop (rust)|for loop]] to process our command-line arguments, setting the variable `arg` to each argument in turn and evaluating the loop body
	- The `std::env` module's args function returns an [[iterator (rust)|iterator]], a value that produces each argument on demand, and indicates when we're done. 
		- Iterators are ubiquitous in Rust; the standard library includes other iterators that produce the elements of a vector, the lines of a file, messages received on a communications channel, and almost anything else that makes sense to loop over. 
			- #question I would like to see more of those examples.
	- Rust's iterators are very efficient: the [[compiler]] is usually able to translate them into the same code as a handwritten loop
		- #question what is the rust compiler like?
		- #question What is meant by handwritten loop?
	- Iterators include a broad selection of methods you can use directly
		- #question what kind of methods are these?
		- For example, the first value produced by the iterator returned by args is always the name of the program being run. To skip that, we call the iterator's `skip` method to produce a new iterator omitting the first value
			- #question What methods are within the iterator? 
### (2.5) Serving Pages to the Web
### (2.6) Concurrency
#### (2.6.1) What the Mandelbrot Set Actually Is
#### (2.6.2) Parsing Pair Command-Line Arguments
#### (2.6.3) Mapping from Pixels to Complex Numbers
#### (2.6.4) Plotting the Set
#### (2.6.5) Writing Image Files
#### (2.6.6) A concurrent Mandelbort Program
#### (2.6.7) Running the Mandelbrot Plotter
#### (2.6.8) Safety is Invisible
### (2.7) Filesystems and Command-Line Tools
#### (2.7.1) The Command-Line Interface
#### (2.7.2) Reading and Writing Files
#### (2.7.3) Find and Replace
## (3) Fundamental Types
### (3.1) Fixed-Width 
#### (3.1.1) Integer Types
#### (3.1.2) Checked, Wrapping, Saturating, and Overflowing Arithmetic
#### (3.1.3) Floating-Point Types
### (3.2) The bool Type
### (3.3) Characters
### (3.4) Tuples
### (3.5) Pointer Types
#### (3.5.1) References
#### (3.5.2) Boxes
#### (3.5.3) Raw Pointers
### (3.6) Arrays, Vectors, and Slices
#### (3.6.1) Arrays
#### (3.6.2) Vectors
#### (3.6.3) Slices
### (3.7) String Types
#### (3.7.1) String Literals
#### (3.7.2) Byte Strings
#### (3.7.3) Strings in Memory
#### (3.7.4) String
#### (3.7.5) Using Strings
#### (3.7.6) Other Strings
#### (3.7.7) Other String-Like Types
### (3.8) Type Aliases
### (3.9) Beyond the Basics
## (4) Ownership and Moves
### (4.1) Ownership
### (4.2) Moves
#### (4.2.1) More Operations That Move
#### (4.2.2) Moves and Control Flow
#### (4.2.3) Moves and Indexed content
### (4.3) Copy Types: The Exception to Moves
### (4.4) Rc and Arc: Shared Ownership

## (5) References
### (5.1) References to Values
### (5.2) Working with References
#### (5.2.1) Rust References Versus C++ References
#### (5.2.2) Assigning References
#### (5.2.3) References to References
#### (5.2.4) Comparing References
#### (5.2.5) References Are Never Null
#### (5.2.6) Borrowing References to Arbitrary Expressions
#### (5.2.7) References to Slices and trait Objects
### (5.3) Reference Safety
#### (5.3.1) Borrowing a Local Variable
#### (5.3.2) Receiving References as Function Arguments
#### (5.3.3) Passing References to Functions
#### (5.3.4) Returning References
#### (5.3.5) Structs Containing References
#### (5.3.6) Distinct Lifetime parameters
#### (5.3.7) Omitting Lifetime Parameters
### (5.4) Sharing Versus Mutation
### (5.5) Taking Arms Against a Sea of Objects
## (6) Expressions
### (6.1) An Expression Language
### (6.2) Precedence and Associativity
### (6.3) Blocks and Semicolons
### (6.4) Declarations
### (6.5) if and match
### (6.6) if let
### (6.7) Loops
### (6.8) Control Flow in Loops
### (6.9) return Expressions
### (6.10) Why Rust Has Loop
### (6.11) Function and Method Calls
### (6.12) Fields and Elements
### (6.13) Reference Operators
### (6.14) Arithmetic, Bitwise, Comparison, and Logical Operators
### (6.15) Assignment
### (6.16) Type Casts
### (6.17) Closures
### (6.18) Onward
## (7) Error Handling
### (7.1) Panic
#### (7.1.1) Unwinding
#### (7.1.2) Aborting
### (7.2) Result
#### (7.2.1) Catching Errors
#### (7.2.2) Result Type Aliases
#### (7.2.3) Printing Errors
#### (7.2.4) Propagating Errors
#### (7.2.5) Working with Multiple Error Types
#### (7.2.6) Dealing with Errors That "Can't Happen"
#### (7.2.7) Ignoring Errors
#### (7.2.8) Handling Errors in main()
#### (7.2.9) Declaring a Custom Error Type
#### (7.2.10) Why Results?
## (8) Crates and Modules
### (8.1) Crates
#### (8.1.1) Editions
#### (8.1.2) Build Profiles
### (8.2) Modules
#### (8.2.1) Nested Modules
#### (8.2.2) Modules in Separate Files
#### (8.2.3) Paths and Imports
#### (8.2.4) The Standard Prelude
#### (8.2.5) Making use Declarations pub
#### (8.2.6) Making Struct Fields pub
#### (8.2.7) Statics and Constants
### (8.3) Turning a Program into a Library
### (8.4) The src/bin Directory
### (8.5) Attributes
#### (8.5.1) Tests and Documentation
#### (8.5.2) Integration Tests
#### (8.5.3) Documentation
#### (8.5.4) Doc-Tests
### (8.6) Specifying Dependencies
#### (8.6.1) Versions
#### (8.6.2) Cargo.lock
### (8.7) Publishing Crates to crates.io
### (8.8) Workspaces
### (8.9) More Nice Things
## (9) Structs
### (9.1) Named-Field Structs
### (9.2) Tuple-Like Structs
### (9.3) Unit-Like Structs
### (9.4) Struct Layout
### (9.5) Defining Methods with impl
#### (9.5.1) Passing Self as a Box, Rc, or Arc
#### (9.5.2) Type-Associated functions
### (9.6) Associated Consts
### (9.7) Generic Structs
### (9.8) Structs with Lifetime Parameters
### (9.9) Deriving Common Traits for Struct Types
### (9.10) Interior Mutability
## (10) Enums and Patterns
### (10.1) Enums
#### (10.1.1) Enums with data
#### (10.1.2) Enums in Memory
#### (10.1.3) Rich Data Structures Using Enums
#### (10.1.4) Generic Enums
### (10.2) Patterns
#### (10.2.1) Literals, Variables, and Wildcards in Patterns
#### (10.2.2) Tuple and Struct Patterns
#### (10.2.3) Array and Slice Patterns
#### (10.2.4) Reference Patterns
#### (10.2.5) Match Guards
#### (10.2.6) Matching Multiple Possibilities
#### (10.2.7) Binding with @ Patterns
#### (10.2.8) Where Patterns Are Allowed
#### (10.2.9) Populating a Binary Tree
### (10.3) The Big Picture
## (11) Traits and Generics
### (11.1) Using Traits
#### (11.1.1) Trait Objects
#### (11.1.2) Generic Functions and Type Parameters
#### (11.1.3) Which to Use
### (11.2) Defining and Implementing Traits
#### (11.2.1) Default Methods
#### (11.2.2) Traits and Other People's Types
#### (11.2.3) Self in Traits
#### (11.2.4) Subtraits
#### (11.2.5) Type-Associated Functions
### (11.3) Fully Qualified Method Calls
### (11.4) Traits That Define Relationships Between Types
#### (11.4.1) Associated Types (or How Iterators Work)
#### (11.4.2) Generic Traits (or How Operator Overloading Works)
#### (11.4.3) impl Trait
#### (11.4.4) Associated Consts
### (11.5) Reverse-Engineering Bounds
### (11.6) Traits as a Foundation
## (12) Operator Overloading
### (12.1) Arithmetic and Bitwise Operators
#### (12.1.1) Unary Operators
#### (12.1.2) Binary Operators
#### (12.1.3) Compound Assignment Operators
### (12.2) Equivalence Comparisons
### (12.3) Ordered Comparisons
### (12.4) Index and IndexMut
### (12.5) Other Operators
## (13) Utility Traits
### (13.1) Drop
### (13.2) Sized
### (13.3) Clone
### (13.4) Copy
### (13.5) Deref and DerefMut
### (13.6) Default
### (13.7) AsRef and AsMut
### (13.8) Borrow and BorrowMut
### (13.9) From and Into
### (13.10) TryFrom and TryInto
### (13.11) ToOwned
### (13.12) Borrow and ToOwned at Work: The Humble Cow

## (14) Closures
### (14.1) Capturing Variables
#### (14.1.1) Closures That Borrow
#### (14.1.2) Closures That Steal
### (14.2) Function and Closure Types
### (14.3) Closure Performance
### (14.4) Closures and Safety
#### (14.4.1) Closures that Kill
#### (14.4.2) FnOnce
#### (14.4.3) FnMut
#### (14.4.4) Copy and Clone for Closures
### (14.5) Callbacks
### (14.6) Using Closures Effectively

## (15) Iterators
### (15.1) The Iterator and IntoIterator Traits
### (15.2) Creating Iterators
#### (15.2.1) iter and iter_mut Methods
#### (15.2.2) IntoIterator Implementations
#### (15.2.3) from_fn and successors
#### (15.2.4) drain Methods
#### (15.2.5) Other Iterator Sources
### (15.3) Iterator Adapters
#### (15.3.1) map and filter
#### (15.3.2) filter_map and flat_map
#### (15.3.3) flatten
#### (15.3.4) take and take_while
#### (15.3.5) skip and skip_while
#### (15.3.6) peekable
#### (15.3.7) fuse
#### (15.3.8) Reversible Iterators and rev
#### (15.3.9) inspect
#### (15.3.10) chain
#### (15.3.11) enumerate
#### (15.3.12) zip
#### (15.3.13) by_ref
#### (15.3.14) cloned, copied
#### (15.3.15) cycle
### (15.4) Consuming Iterators
#### (15.4.1) Simple Accumulation: count, sum, product
#### (15.4.2) max, min
#### (15.4.3) max_by, min_by
#### (15.4.4) max_by_key, min_by_key
#### (15.4.5) Comparing Item Sequences
#### (15.4.6) any and all
#### (15.4.7) position, rposition, and ExactSizeIterator
#### (15.4.8) fold and rfold
#### (15.4.9) try_fold and try_rfold
#### (15.4.10) nth, nth_back
#### (15.4.11) last
#### (15.4.12) find, rfind, and find_map
#### (15.4.13) Building Collections: collect and FromIterator
#### (15.4.14) The Extend Trait
#### (15.4.15) partition
#### (15.4.16) for_each and try_for_each
### (15.5) Implementing Your Own Iterators
## (16) Collections
### (16.1) Overview
### (16.2) Vec\<T>
#### (16.2.1) Accessing Elements
#### (16.2.2) Iteration
#### (16.2.3) Growing and Shrinking Vectors
#### (16.2.4) Joining
#### (16.2.5) Splitting
#### (16.2.6) Swapping
#### (16.2.7) Sorting and Searching
#### (16.2.8) Comparing Slices
#### (16.2.9) Random Elements
#### (16.2.10) Rust Rules Out Invalidation Errors
### (16.3) VecDeque\<T>
### (16.4) BinaryHeap\<T>
### (16.5) HashMap\<K, V> and BTreeMap\<K, V>
#### (16.5.1) Entries
#### (16.5.2) Map Iteration
### (16.6) HashSet\<T> and BTreeSet\<T>
#### (16.6.1) Set Iteration
#### (16.6.2) When Equal Values Are Different
#### (16.6.3) Whole-Set Operations
### (16.7) Hashing
### (16.8) Using a Custom Hashing Algorithm
### (16.9) Beyond the Standard Collections

## (17) Strings and Text
### (17.1) Some Unicode Background
#### (17.1.1) ASCII, Latin-1, and Unicode
#### (17.1.2) UTF-8
#### (17.1.3) Text Directionality
### (17.2) Characters (char)
#### (17.2.1) Classifying Characters
#### (17.2.2) Handling Digits
#### (17.2.3) Case Conversion for Characters
#### (17.2.4) Conversions to and from Integers
### (17.3) String and str
#### (17.3.1) Creating String Values
#### (17.3.2) Simple Inspection
#### (17.3.3) Appending and Inserting Text
#### (17.3.4) Removing and Replacing Text
#### (17.3.5) Conventions for Searching and Iterating
#### (17.3.6) Patterns for Searching Text
#### (17.3.7) Searching and Replacing
#### (17.3.8) Iterating over Text
#### (17.3.9) Trimming
#### (17.3.10) Case Conversion for Strings
#### (17.3.11) Parsing Other Types from Strings
#### (17.3.12) Converting Other Types to Strings
#### (17.3.13) Borrowing as Other Text-Like Types
#### (17.3.14) Accessing Text as UTF-8
#### (17.3.15) Producing Text from UTF-8 Data
#### (17.3.16) Putting Off Allocation
#### (17.3.17) Strings as Generic Collections
### (17.4) Formatting Values
#### (17.4.1) Formatting Text Values
#### (17.4.2) Formatting Numbers
#### (17.4.3) Formatting Other Types
#### (17.4.4) Formatting Values for Debugging
#### (17.4.5) Formatting Pointers for Debugging
#### (17.4.6) Referring to Arguments by Index or Name
#### (17.4.7) Dynamic Widths and Precisions
#### (17.4.8) Formatting Your Own Types
#### (17.4.9) Using the Formatting Language in Your Own Code
### (17.5) Regular Expressions
#### (17.5.1) Basic Regex Use
#### (17.5.2) Building Regex Values Lazily
### (17.6) Normalization
#### (17.6.1) Normalization Forms
#### (17.6.2) The unicode-normalization Crate

## (18) Input and Output
### (18.1) Readers and Writers
#### (18.1.1) Readers
#### (18.1.2) Buffered Readers
#### (18.1.3) Reading Lines
#### (18.1.4) Collecting Lines
#### (18.1.5) Writers
#### (18.1.6) Files
#### (18.1.7) Seeking
#### (18.1.8) Other Reader and Writer Types
#### (18.1.9) Binary Data, Compression, and Serialization
### (18.2) Files and Directories
#### (18.2.1) OsStr and Path
#### (18.2.2) Path and PathBuf Methods
#### (18.2.3) Filesystem Access Functions
#### (18.2.4) Reading Directories
#### (18.2.5) Platform-Specific Features
### (18.3) Networking

## (19) Concurrency
### (19.1) Fork-Join Parallelism
#### (19.1.1) spawn and join
#### (19.1.2) Error Handling Across Threads
#### (19.1.3) Sharing Immutable Data Across Threads
#### (19.1.4) Rayon
#### (19.1.5) Revisiting the Mandelbrot Set
### (19.2) Channels
#### (19.2.1) Sending Values
#### (19.2.2) Receiving Values
#### (19.2.3) Running the Pipeline
#### (19.2.4) Channel Features and Performance
#### (19.2.5) Thread Safety: Send and Sync
#### (19.2.6) Piping Almost Any Iterator to a Channel
#### (19.2.7) Beyond Pipelines
### (19.3) Shared Mutable State
#### (19.3.1) What Is a Mutex?
#### (19.3.2) Mutex\<T>
#### (19.3.3) mut and Mutex
#### (19.3.4) Why Mutexes Are Not Always a Good Idea
#### (19.3.5) Deadlock
#### (19.3.6) Poisoned Mutexes
#### (19.3.7) Multiconsumer Channels Using Mutexes
#### (19.3.8) Read/Write Locks (RwLock\<T>)
#### (19.3.9) Condition Variables (Condvar)
#### (19.3.10) Atomics
#### (19.3.11) Global Variables
### (19.4) What Hacking Concurrent Code in Rust Is Like

## (20) Asynchronous Programming
### (20.1) From Synchronous to Asynchronous
#### (20.1.1) Futures
#### (20.1.2) Async Functions and Await Expressions
#### (20.1.3) Calling Async Functions from Synchronous Code: block_on
#### (20.1.4) Spawning Async Tasks
#### (20.1.5) Async Blocks
#### (20.1.6) Building Async Functions from Async Blocks
#### (20.1.7) Spawning Async Tasks on a Thread Pool
#### (20.1.8) But Does Your Future Implement Send?
#### (20.1.9) Long Running Computations: yield_now and spawn_blocking
#### (20.1.10) Comparing Asynchronous Designs
#### (20.1.11) A Real Asynchronous HTTP Client
### (20.2) An Asynchronous Client and Server
#### (20.2.1) Error and Result Types
#### (20.2.2) The Protocol
#### (20.2.3) Taking User Input: Asynchronous Streams
#### (20.2.4) Sending Packets
#### (20.2.5) Receiving Packets: More Asynchronous Streams
#### (20.2.6) The Client's Main Function
#### (20.2.7) The Server's Main Function
#### (20.2.8) Handling Chat Connections: Async Mutexes
#### (20.2.9) The Group Table: Synchronous Mutexes 
#### (20.2.10) Chat Groups: tokio's Broadcast Channels
### (20.3) Primitive Futures and Executors: When Is a Future Worth Polling Again?
#### (20.3.1) Invoking Wakers: spawn_blocking
#### (20.3.2) Implementing block_on
### (20.4) Pinning
#### (20.4.1) The Two Life Stages of a Future
#### (20.4.2) Pinned Pointers
#### (20.4.3) The Unpin Trait
### (20.5) When Is Asynchronous Code Helpful?

## (21) Macros
### (21.1) Macro Basics
#### (21.1.1) Basics of Macro Expansion
#### (21.1.2) Unintended Consequences
#### (21.1.3) Repetition
### (21.2) Built-In Macros
### (21.3) Debugging Macros
### (21.4) Building the json! Macro
#### (21.4.1) Fragment Types
#### (21.4.2) Recursion in Macros
#### (21.4.3) Using Traits with Macros
#### (21.4.4) Scoping and Hygiene
#### (21.4.5) Importing and Exporting Macros
### (21.5) Avoiding Syntax Errors During Matching
### (21.6) Beyond macro_rules!

## (22) Unsafe Code
### (22.1) Unsafe from What?
### (22.2) Unsafe Blocks
### (22.3) Example: An Efficient ASCII String Type
### (22.4) Unsafe Functions
### (22.5) Unsafe Block or Unsafe Function?
### (22.6) Undefined Behavior
### (22.7) Unsafe Traits
### (22.8) Raw Pointers
#### (22.8.1) Dereferencing Raw Pointers Safely
#### (22.8.2) Example: RefWithFlag
#### (22.8.3) Nullable Pointers
#### (22.8.4) Type Sizes and Alignments
#### (22.8.5) Pointer Arithmetic
#### (22.8.6) Moving into and out of Memory
#### (22.8.7) Example: GapBuffer
#### (22.8.8) Panic Safety in Unsafe Code
### (22.9) Reinterpreting Memory with Unions
### (22.10) Matching Unions
### (22.11) Borrowing Unions

## (23) Foreign Functions
### (23.1) Finding Common Data Representations
### (23.2) Declaring Foreign Functions and Variables
### (23.3) Using Functions from Libraries
### (23.4) A Raw Interface to libgit2
### (23.5) A Safe Interface to libgit2
### (23.6) Conclusion

## Review
### Terms
```dataviewjs
// Get the current file content
let fileContent = await dv.io.load(dv.current().file.path);

// Extract links using a regular expression
let links = fileContent.match(/\[\[([^\]]+)\]\]/g);

// Initialize a Set to store unique filtered links
let filteredLinks = new Set();

if (links) {
    // Filter out links with the #studied tag
    for (let link of links) {
        let linkName = link.slice(2, -2); // Remove the [[ and ]] from the link
        let page = dv.page(linkName);
        if (page && (!page.tags || !page.tags.includes("studied"))) {
            filteredLinks.add(link);
        }
    }
}

// Display the count of filtered links
dv.header(5, `Link Count: ${filteredLinks.size}`);

// Display the links or show "No Links Found"
if (filteredLinks.size > 0) {
    dv.list(Array.from(filteredLinks));
} else {
    dv.paragraph("- NO LINKS FOUND");
}

```
### Questions
```query
file:"Home Page - Programming Rust 2nd Edition by O'Reilly" tag:#question
```

- View the "Rust" query in your bookmarks