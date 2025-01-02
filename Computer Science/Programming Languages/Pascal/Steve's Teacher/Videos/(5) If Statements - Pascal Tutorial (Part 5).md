---
Source:
  - https://youtube.com/watch?v=gEVZErJH_yE
Reviewed: false
---
```Pascal

program MyFirstProgram;


var
    uname, uname2: string;
    age: integer;
    open: boolean;

begin
    uname := 'Jack';
    uname2 := 'jack';

    age := 19;
    open := false;

    if (open) and (age >= 18) then //or, You can also create nested if statements
    begin
        writeln('Bar is open to you');
    end
    else if not open then
    begin
        writeln('Bar is closed. Open at 8pm');
    end
    else
    begin
        writeln('Bar is not open to you');
    end;

    if 9 <>7 then
    begin
        writeln('9 is not equal to 7');
    end;

    if not (9 = 7) then //need to use brackets if using "not"
    begin
        writeln('9 is not equal to 7');
    end;

    if uname = uname then
    begin
        writeln('The strings are identical');
    end
    else
    begin
        writeln('The strings are not identical');
    end;

    if true then writeln('single line');

end.
```

Output
```
Bar is closed. Open at 8pm
9 is not equal to 7
9 is not equal to 7
The strings are identical
single line
```