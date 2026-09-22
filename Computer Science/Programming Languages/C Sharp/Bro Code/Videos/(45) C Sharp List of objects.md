---
Source:
  - https://www.youtube.com/watch?v=aLhAmimoQj8
---
Code
```C#
using System;
using System.Collections.Generic;

namespace MyFirstProgram
{
    class Program 
    {
        static void Main(string[] args)
        {
            List<Player> players = new List<Player>();

			//Instantiaties the player object
			//Player player1 = new Player("Chad");

            players.Add(new Player("Chad"));
            players.Add(new Player("Steve"));
            players.Add(new Player("Karen"));

            foreach (Player player in players)
            {
                Console.WriteLine(player);
            }

            Console.ReadKey();
        }
    }

    class Player
    {
        public String username;

        public Player(String username)
        {
            this.username = username;
        }
        public override string ToString()
        {
            return username;
        }
    }
}
```

Output
```
Chad
Steve
Karen
```