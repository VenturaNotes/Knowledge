[Video](https://www.youtube.com/watch?v=rUbmW4qAh8w)

- [[Thread]]: an execution path of a program
	- We can use multiple threads to perform, different tasks of our program at the same time. Current thread running is "main" thread using System.Threading;
- [[lambda expression]]
	- () => CountDown("Timer #1")

Code
```C#
using System;
using System.Threading;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            Thread mainThread = Thread.CurrentThread;
            mainThread.Name = "Main Thread";
            //Console.WriteLine(mainThread.Name);

			//Using lambda expression here
            Thread thread1 = new Thread(() => CountDown("Timer #1"));
            Thread thread2 = new Thread(() => CountUp("Timer #2"));

            thread1.Start();
            thread2.Start();

            Console.WriteLine(mainThread.Name + " is complete!");

            Console.ReadKey();
        }  
        public static void CountDown(String name)
        {
            for (int i = 10; i >= 0; i--)
            {
                Console.WriteLine("Timer #1 : " + i + " seconds");
                Thread.Sleep(1000);
            }
            Console.WriteLine("Timer #1 is complete!");
        }
        public static void CountUp(String name)
        {
            for (int i = 0; i <= 10; i++)
            {
                Console.WriteLine("Timer #2 : " + i + " seconds");
                Thread.Sleep(1000);
            }
            Console.WriteLine("Timer #2 is complete!");
        }
    }
}
```


Output
```
Main Thread is complete!
Timer #1 : 10 seconds
Timer #2 : 0 seconds
Timer #1 : 9 seconds
Timer #2 : 1 seconds
Timer #1 : 8 seconds
Timer #2 : 2 seconds
Timer #2 : 3 seconds
Timer #1 : 7 seconds
uTimer #2 : 4 seconds
Timer #1 : 6 seconds
Timer #2 : 5 seconds
Timer #1 : 5 seconds
Timer #1 : 4 seconds
Timer #2 : 6 seconds
Timer #1 : 3 seconds
Timer #2 : 7 seconds
Timer #1 : 2 seconds
Timer #2 : 8 seconds
Timer #1 : 1 seconds
Timer #2 : 9 seconds
Timer #1 : 0 seconds
Timer #2 : 10 seconds
Timer #1 is complete!
Timer #2 is complete!
```