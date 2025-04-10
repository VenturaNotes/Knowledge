---
Source:
  - https://www.youtube.com/watch?v=gtXQv6dfyvs
Reviewed: false
---
- ![[Screenshot 2024-11-10 at 8.49.40 PM.png]]
	- [[Bayes' Theorem]]
		- It is a theorem on [[conditional probability]]. It's a very special type of theorem. It's the probability theorem of the cause of some series of events occurring. 
		- $P(A_i|A) = \frac{P(A_i)fP(A|A_i)}{\Sigma^n_{i=1}P(A_i)*P(A|A_i)}$
			- Some independent event will occur if we already know that A has occurred 
			- Marble and coin flip explained with above formula
				- What is the probability that we have tossed either heads or tails if we know that we grabbed a marble from one of the two bags and that marble happened to be red
					- In $P(A_i|A)$
						- A happens to be the event that you grabbed a red marble
					- In $P(A_i)P(A|A_i)$
						- It's equal to the probability that we threw heads $(A_i)$ multiplied by the probability that we pulled a read marble provided that we threw heads $P(A|A_i)$ divided by below
					- In $\Sigma^n_{i=1}P(A_i)*P(A|A_i)$
						- Now we sum up all the different possibilities
						- The probability that we threw heads $P(A_i)$ times the probability that we pulled a red marble provided that we threw heads $P(A|A_i)$ +
							- The probability we threw tails $P(A_i)$ times the probability we pulled a red marble provided that we threw tails $P(A|A_i)$ 
		- Let's say you grab a marble from one of the two bags and it happens to be a red marble. Now what is the probability that you threw heads and what is the probability that you threw tails? 
			- This is what Bayes' Theorem is all about. 
			- It goes backwards and tells us the probability of the original events that resulted in the final outcome by saying If we get this as an outcome, what is the probability that one of those original events actually occurred 