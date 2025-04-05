## Synthesis
- 
## Source [^1]
- A form of programming loop in which the condition for termination (continuation) is computed each time around the loop. There are several variants on this basic idea. For example, Pascal has

while 〈condition〉 do

begin

〈statements〉

end

and also

repeat

〈statements〉

until 〈condition〉

The first is a while loop and the second is a repeat-until loop. Apart from the obvious difference that the first specifies a continuation condition while the second specifies a termination condition, there is a more significant difference. The while loop is a [[zero-trip loop]], i.e. the body will not be executed at all if the condition is false the first time around. In contrast, the body of a repeat-until loop must be obeyed at least once.

  

Similar constructs are found in most languages, though there are many syntactic variations. See also DO LOOP.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]