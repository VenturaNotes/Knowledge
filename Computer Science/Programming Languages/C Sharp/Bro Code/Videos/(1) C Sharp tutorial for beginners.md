---
Source:
  - https://www.youtube.com/watch?v=r3CExhZgZV8
Reviewed: false
---
- You need to learn C#
	- Flexible (console apps, web services, games)
	- Great for aspiring game developers (Unity)
	- Average salary $63,439/year for C# developers (Glassdoor.com)
- Setup for Visual Studio Code
	- Download [.NET](https://dotnet.microsoft.com/en-us/download)
	- Get C# extension
	- In Terminal, type `brew install scriptcs`
	- In VSCode,
		- Command + Shift + P 
		- "Preferences: Open User Settings (JSON)" 
		- `"code-runner.executorMap": { "csharp": "cd $dir && dotnet run $fileName" }` [^1]
	- In Terminal: `dotnet new console`
	- Make sure to run script in C# folder

```C#
using System;

namespace C_Sharp
{
    class Program
    {
        static void Main(string[] args) //main method
        {   // body of main method
            // Will display in console window as output
            Console.WriteLine("I like pizza!");
            Console.WriteLine("It's really good!");

            // The Console.Beep() method in C# is not supported on macOS or any Unix-based systems, including Mac. 
            // It supposed to make a sound when the terminal window opens
            Console.Beep();
        }
    }
}
```

Output:
```
I like pizza!
It's really good!
```

## References

[^1]: https://www.youtube.com/watch?v=CO4BGZOuUkM&t=482s