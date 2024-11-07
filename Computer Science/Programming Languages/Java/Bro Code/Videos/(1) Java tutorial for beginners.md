[Video](https://youtube.com/watch?v=NBIUbTddde4)

- Order of Tutorial
	- Java introduction
	- Java file compilation
	- What is a JDK
	- JDK download
	- What is an IDE?
	- IDE download
	- Project setup
	- Classes
	- Main method
	- println()
	- escape sequences
	- comments
	- tips & tricks
- Why you need to learn
	- (1) Top 3 most popular languages
	- (2) Extremely flexible (business, web apps, android apps, games)
	- (3) Easy to find a job as a developer (entry salary $70,474 - Glassdoor)
- Computers are on spectrum of high level and low level
- Computers only understand binary (referred to as [[machine code]]) a low level format that only a machine can understand
- To create machine code, we write in a format called source code which is understandable by humans and compiles to machine code. When we create a java source code, the file ends with a .java file extension
- [[compile]] = transform source code to machine code. We do this because humans can't read machine code and vice versa
- When we compile our source code to machine code, it's machine code specific.
- If we write source code and compile it on a mac, we can only run that code on a mac and the same concept applies for windows
- Java language has a solution for this with java, we have an intermediary step. We can compile source code to [[bytecode]]. Bytecode is cross platform and ends with a .class file extension. You can send bytecode that you created on a mac and send it to a friend on a windows computer where they could run it using a J.V.M which translates the bytecode to machine code.
- A JDM is included with a JDK
- Steps for code with Java
	- Source code: Write code such as print("Hi Mom") and is a .java file extension
	- Compiler: Translates as part of the compilation process
	- Bytecode: It's cross-platform (portable) and has a .class file extension
	- [[Java Virtual Machine]] (J.V.M): translates as part of the run process
	- Object code (machine code): 0s and 1s
- What is a JDK ([[java development kit]])?
	- It contains developer tools  to help us code as well as a JRE (java runtime environment) with libraries and toolkits. Inside that is JVM (java virtual machine) which runs java programs which translates bytecode for us into machine code. You just need to worry about downloading a JDK and everything else will be included
- JDK (java development kit) developer tools
	- JRE (java runtime environment) libraries & toolkits
		- JVM (java virtual machine) runs java programs
- Java SE downloads (SE stands for standard edition)
- What is an IDE? (software that helps us write software)
	- I - Integrated
	- D - Development
	- E - Environment
- You could use a text-editor such as note-pad to write code and compile the text-file, but it's not really beginner friendly
- IDE provides interface to write code, check for errors, compile, and run code
	- Good IDEs are eclipse and IntelliJ IDEA
- A [[class (Computer Science)|class]] is a collection of related code
	- Since the class name is named "Main", the java file will also be named "Main"
	- The .java file extension is source code (format humans can read and understand)
	- Compiling source code to bytecode creates a new file that has the .class file extension
	- With that bytecode file, we can use JVM to run and translate it to machine code
- 

```java
public class Main {
    
    //The main method must exist
    public static void main(String[] args) throws Exception {
        //println will add a newLine character
        System.out.println("Hello World");
        
        //spaces don't really matter
        System.out.    println("that is super cool");

        /*
         * 
         * \t adds a tab
         * \n adds a newline
         * \" makes it so you can do quotes
         * \\ adds a backslash to string
         */

        //typing "sysout + enter" will create System.out.println(); for you

        /*
         * This
         * is
         * a
         * multiline
         * comment.
         * 
         */
    }
}
```

- Output
```
Hello World
that is super cool
```