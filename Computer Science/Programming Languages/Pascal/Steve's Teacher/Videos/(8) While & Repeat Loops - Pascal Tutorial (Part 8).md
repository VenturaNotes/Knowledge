[Video](https://youtube.com/watch?v=eK260s0e9zE)

```Pascal
program MyFirstProgram;

var
    x: integer;

begin
    x := 0;

    {
    for i := 2 to 10 do
        begin
            if x = 5 then continue;
            writeln(x);
        end;
    }

    writeln('while loop');
    while x < 10 do //runs until no longer true
    begin
        x += 1;
        if x = 5 then continue;
        writeln(x);
    end;

    x := 0;

    writeln('repeat loop'); //runs at least once
    repeat
        x += 1;
        writeln(x);
    until (x > 10);

end.
```


Output
```
while loop
1
2
3
4
6
7
8
9
10
repeat loop
1
2
3
4
5
6
7
8
9
10
11
```