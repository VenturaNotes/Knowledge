[Video](https://youtube.com/watch?v=I-wjYgRyAg0)

- ![[Screenshot 2023-09-08 at 11.53.45 AM.png]]
	- [[The first principle of enumeration]]
		- Observation: If a project can be considered as a sequence of n tasks which are carried out in order, and for each i, the number of ways to do Task i is $m_i$, then the total number of ways the project can be done is:
			- $m_1 \times m_2 \times m_3 \times ... \times m_n$
			- If the number of ways to do the second one is [[independent]] of the number of ways you did the first one, then you can multiply the individual quantities together to get the total quantity
		- [[Enumeration]] is the fancy word for counting
			- It is important in mathematics to know how many things of some type there actually are
		- If you have 5 shirts, 4 pants, and 3 socks, $5*4*3$ = 60 which is the total number of ways you can get dressed
			- [[Multiplication principle]] is the first rule of counting of enumeration for strings
	- Consequences
		- Fact: The number of [[bit string|bit strings]] of length n is $2^n$
			- There is always 2 choices
			- $2*2*2..$ (n times)
		- Fact: The number of words of length n from an m letter alphabet is $m^n$
			- $m*m*m*m$ (n times)
		- Fact: The number of Georgia license auto license plates is $26^310^4$ 
			- We pretend all combinations of letters (including repetition) and combinations of digits including repetition are allowed