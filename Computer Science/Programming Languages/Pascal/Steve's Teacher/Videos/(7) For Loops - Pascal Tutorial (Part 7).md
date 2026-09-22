---
Source:
  - https://youtube.com/watch?v=VlIaTPqlF9Q
---
```Pascal
program MyFirstProgram;

var
    i: integer;
    called: boolean;

begin

    writeln('Loop from 1 to 10');
    for i := 1 to 10 do
    begin
        writeln(i);
    end;

    writeln('loop from 30 to 20');

    for i := 30 downto 20 do
    begin
        if i = 25 then continue;
        writeln(i);
    end;

    writeln('loop from 25 to 20');
    for i := 25 downto 20 do
    begin
        writeln('no loop');
        break;
    end;

    //FizzBuzz program
    //1 to 100
    // 3, 6, 9, 12, 15 -> fizz
    // 5, 10, 15, 20 -> buzz
    // 15, 30 -> fizzbuzz

    called := false;

    writeln('FizzBuzz loop to 30');
    for i := 1 to 30 do
    begin
        called := false;
        if i mod 3 = 0 then
        begin
            write('Fizz');
            called := true;
        end;

        if i mod 5 = 0 then
        begin
            write('Buzz');
            called := true;
        end;

        if called then writeln() else writeln(i);
    end;
end.
```


Output
```
Loop from 1 to 10
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
loop from 30 to 20
30
29
28
27
26
24
23
22
21
20
loop from 25 to 20
no loop
FizzBuzz loop to 30
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
16
17
Fizz
19
Buzz
Fizz
22
23
Fizz
Buzz
26
Fizz
28
29
FizzBuzz
```