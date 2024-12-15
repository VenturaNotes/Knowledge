---
Source:
  - https://www.youtube.com/watch?v=wjioHdpZ6_s
---
Code
```C#
using System;

namespace MyFirstProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            Random random = new Random(); //generates numbers
            bool playAgain = true; //users can play again
            int min = 1; //lower bound of number
            int max = 100; //upper bound of number
            int guess;
            int number;
            int guesses;
            String? response;

            while (playAgain)
            {
                guess = 0;
                guesses = 0;
                response = "";
                number = random.Next(min, max + 1);

                while (guess != number)
                {
                    Console.WriteLine("Guess a number between " + min + " - " + max + " : ");
                    guess = Convert.ToInt32(Console.ReadLine());
                    Console.WriteLine("Guess: " + guess);

                    if (guess > number)
                    {
                        Console.WriteLine(guess + " is to high!");
                    }
                    else if (guess < number)
                    {
                        Console.WriteLine(guess + " is to low!");
                    }
                    guesses++;
                }
                Console.WriteLine("Number: " + number);
                Console.WriteLine("YOU WIN!");
                Console.WriteLine("Guesses: " + guesses);

                Console.WriteLine("Would you like to play again (Y/N): ");
                response = Console.ReadLine();
                if (response != null)
                {
                    response = response.ToUpper();
                }

                if (response == "Y")
                {
                    playAgain = true;
                }
                else
                {
                    playAgain = false;
                }
            }

            Console.WriteLine("Thanks for playing! ... I guess");

            Console.ReadKey();
        }
    }
}
```

Output
```
Guess a number between 1 - 100 : 
50
Guess: 50
50 is to low!
Guess a number between 1 - 100 : 
75
Guess: 75
75 is to low!
Guess a number between 1 - 100 : 
90
Guess: 90
90 is to high!
Guess a number between 1 - 100 : 
80
Guess: 80
Number: 80
YOU WIN!
Guesses: 4
Would you like to play again (Y/N): 
y
Guess a number between 1 - 100 : 
100
Guess: 100
100 is to high!
Guess a number between 1 - 100 : 
50
Guess: 50
50 is to high!
Guess a number between 1 - 100 : 
25
Guess: 25
25 is to low!
Guess a number between 1 - 100 : 
30
Guess: 30
30 is to high!
Guess a number between 1 - 100 : 
27
Guess: 27
Number: 27
YOU WIN!
Guesses: 5
Would you like to play again (Y/N): 
n
Thanks for playing! ... I guess
```