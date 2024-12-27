---
Source:
  - https://www.youtube.com/watch?v=hfnr2EPzn98
---
- #question What does time NULL mean? 
```C++
# include <iostream>

int main() {

    int num = 0;
    int guess = 0;
    int tries = 0;

    srand(time(NULL));
    num = (rand() % 100) + 1;

    std::cout << "**** NUMBER GUESSING GAME ******\n";

    do{
        std::cout << "Enter a guess between (1-100): ";
        std::cin >> guess;
        tries++;

        if(guess > num){
            std::cout << "Too high!\n";
        }
        else if(guess < num){
            std::cout << "Too low!\n";
        }
        else{
            std::cout << "CORRECT! # of tries: " << tries << '\n';
        }

    }while(guess != num);

    std::cout << "**********************************";

    return 0;
}
```

Output
```
**** NUMBER GUESSING GAME ******
Enter a guess between (1-100): 50
Too low!
Enter a guess between (1-100): 75
Too high!
Enter a guess between (1-100): 60
Too high!
Enter a guess between (1-100): 55
Too low!
Enter a guess between (1-100): 56
Too low!
Enter a guess between (1-100): 57
Too low!
Enter a guess between (1-100): 58
CORRECT! # of tries: 7
**********************************
```