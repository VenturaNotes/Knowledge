[Video](https://youtube.com/watch?v=A2k3ulOJ3u4)
![[Screen Shot 2022-10-24 at 3.31.37 PM.png]]

Translating propositional Logic Statements

Translating English Sentences
1. Identify Atomic propositions
2. Determine appropriate logical connectives

(look at statement and see what can be turned into a proposition.)

<mark style="background: #FFF3A3A6;">If</mark> <mark style="background: #FFB86CA6;">I go to the store</mark> <mark style="background: #FFF3A3A6;">or</mark> <mark style="background: #FFB86CA6;">the movies</mark>, I <mark style="background: #FFF3A3A6;">won't</mark> <mark style="background: #FFB86CA6;">do my homework.</mark>

There are many correct ways to translate this. This is simply one correct way. Also, we always represent our proposition as the positive and if it's a negative, we negate it.

p: I go to the store
q: I go to the movies
r: I do my homework

When translating, we need to write the above. What proposition represents what phrase.

(p $\lor$ q) $\implies$ $\lnot$ r

If p or q, then not r.

![[Screen Shot 2022-10-24 at 3.35.45 PM.png]]

In an implication, hypothesis $\implies$ conclusion 
- H $\implies$ C

Practice
1. You can get a free sandwich on Thursday <mark style="background: #FFF3A3A6;">if</mark> you buy a sandwich or a cup of soup.
	1. "if you buy a sandwich or a cup of soup" is the hypothesis and "you can get a free sandwich on Thursday" is the conclusion.

p: I buy a sandwich
q: I buy a cup of soup
r: I get a free sandwich on Thursday

(p$\lor$q) $\implies$ r

If the sentence has an "if" in it, the second part is a hypothesis and the first part is the conclusion

2. You can get a free sandwich on Thursday <mark style="background: #FFF3A3A6;">only if</mark> you buy a sandwich or a cup of soup.

p: I buy a sandwich
q: I buy a cup of soup
r: I get a free sandwich on Thursday

 r  $\implies$ (p$\lor$q)

You have to do the only if in opposite order. If the sentence has an "Only if", the second part is the conclusion and the first part is the hypothesis

(Note: 'only if' is same as implies and 'iff' is same as equivalence. [^1])

Also "A only if B" = "If A then B". The antecedent doesn't come after the "if", the consequent comes after the "if". One example is "The Match is burning only if there's oxygen in the room". This is the same as saying "If the match is burning, then there is oxygen in the room." The "only if" actually reverses the direction of logical dependency. [^2]


3. The automated reply can't be sent when the system is full.
p: The system is full
q: the automated reply can be sent

p $\implies$ $\lnot$ q

If the system is full, then the automated reply can't be sent.

![[Screen Shot 2022-10-24 at 3.59.08 PM.png]]

Translating propositions
q: You can ride the roller coaster
r: You are under 4 feet tall
s: You are older than 16 years old

Translate:  (r $\lor$ $\lnot$ s) $\implies$ $\lnot$ q

If r or not s, then not q

(for the sentence below, you can say "not older" instead of "younger")

If you are under 4 feet tall, or younger than 16 years old then you can not ride the rollercoaster.

![[Screen Shot 2022-10-24 at 4.02.32 PM.png]]

## References

[^1]: https://math.stackexchange.com/questions/68293/what-is-the-difference-between-only-if-and-iff#:~:text='only%20if'%20is%20same%20as%20implies%20and%20'iff'%20is%20same%20as%20equivalence%3F
[^2]: https://criticalthinkeracademy.com/courses/2514/lectures/51574#:~:text=%E2%80%9CA%20only%20if,after%20the%20%E2%80%9Cif%E2%80%9D.