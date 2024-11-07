[Video](https://youtube.com/watch?v=Dq_2HQWAo7M)

```Pascal
program MyFirstProgram;

var
    i: integer;
    friends: array[1..3] of string;

begin
    friends[1] := 'Nick';
    friends[2] := 'Jack';
    friends[3] := 'Mike';

    for i := 1 to length(friends) do
    begin
        writeln(friends[i]);
    end;

end.
```

Output:
```
Nick
Jack
Mike
```

---

```Pascal
program MyFirstProgram;

var
    i, j: integer;
    friends: array[1..3, 1..5] of integer;

begin

    { friends array
        [
            [1, 2, 3, 4, 5], //1, 1..5
            [1, 2, 3, 4, 5], //2, 1..5
            [1, 2, 3, 4, 5], //3, 1..5
        ]
    }

    for i := 1 to 3 do
    begin
        for j := 1 to 5 do
        begin
            friends[i][j] := i*j;
        end;
    end;

    for i := 1 to 3 do
    begin
        for j := 1 to 5 do
        begin
            writeln(friends[i][j])
        end;
    end;
end.
```

Output
```
1
2
3
4
5
2
4
6
8
10
3
6
9
12
15
```