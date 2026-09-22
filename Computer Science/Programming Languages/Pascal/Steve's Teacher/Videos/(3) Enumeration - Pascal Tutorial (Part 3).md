---
Source:
  - https://youtube.com/watch?v=ZJOjumz70nE
---
- Enumeration values may store multiple things

```pascal

program MyFirstProgram;


type
    text = string;
    xxx = string;
    months = (Jan, Fex, Mar, Apr, May, Jun, Jul, Aug, Sept, Oct, Nov, Dec); 
    {
        enum, value where you can only have specific values in it
    }

var
    firstName: text;
    secondName: xxx;
    month: months;
    points: 1 .. 100;//subranges
    alpha: 'A' .. 'Z';

begin
    firstName := 'ajacas';
    secondName := 'Julian';
    month := Mar;

    //Value must be within subrange (inclusive)
    points := 1;
    alpha := 'B';

    writeln(firstName);
    writeln(secondName);
    writeln(month);
    writeln(points);
    writeln(alpha);

end.
```

Output
```
ajacas
Julian
Mar
100
A
```