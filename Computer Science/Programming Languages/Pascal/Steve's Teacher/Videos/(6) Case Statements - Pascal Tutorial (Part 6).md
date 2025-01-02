---
Source:
  - https://youtube.com/watch?v=P1FT1Zgm6YU
Reviewed: false
---
```Pascal
program MyFirstProgram;


var 
    num: integer;
    letter: char;

begin
    num := 10;
    letter := '7';

    case letter of
        'A' .. 'Z': writeln('Captial letter');
        'a' .. 'z': writeln('lower case letter');
    else
        writeln('Invalid letter');
    end;

    case num of 
        10: begin
        writeln ('I am epic');
        writeln('I am very epic');
        end;

        20: writeln('num is 20');
        100, 45, 201: writeln('num is 45, 100 or 201');
        1000 .. 2000: writeln('num is very big');

    else
        begin
            writeln('number is not one of the allowed cases');
        end;
    end;
  
end.
```

Output
```
Invalid letter
I am epic
I am very epic
```