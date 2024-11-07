[00:08:50](https://www.youtube.com/watch?v=e7BufAVwDiM&t=529s)

``` shell
# comments explain to programmer

: '

This allows for a multiline comment
And I can typeo n this line as well

'

: "

This
works
the
same
way

"

#this is a cat command
# there is no value to the comment
cat >> file.txt
```
- One line comments
- Multiple-line comments
- here doc syntax?

```shell
# this is a heredoc delimiter?

#This is a heredoc delimiter

cat << kreativ
This is hello creative text
add another line
kreativ

# The above lets you show comments on the output of terminal

```