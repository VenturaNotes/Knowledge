---
Source:
  - https://www.youtube.com/watch?v=d2oSMYlbQSo
Reviewed: false
---
- ![[Screenshot 2024-12-27 at 8.34.25 PM.png]]
	- [[Expected value]] of a [[random variable]]
		- Often confused with average of random variable
	- $E(x) = \Sigma^{n}_{i = 1}x_iP(x_i)$ 
		- We multiply the random variable `x` times the probability of that random variable (which is what we call the weighted average). If we multiply times the probability that the number will occur, we adjust for the fact that some numbers are not as likely to occur as others so 2 people standing in line should weigh more in the calculation than for other values of `x` that are not as likely to occur. This is what is meant by weighted average
			- For those numbers that are more likely to occur, that have a higher probability, we should weigh them more heavily than numbers that are less likely to occur. We should weigh them less heavily. We do this by multiplying the value of the number (anywhere from 0 to 8) by the probability of that occurrence and then we sum them all up. No need to divide it because $P(x_i)$ already normalized it so there is no division necessary. Since it's already normalized where the sum of all the probabilities add up to 1, there is no need for any division. Just need to multiply them together to give us the expected value.
	- The expected value is basically the weighted average
	- Graph is a distribution of the random variable where `x` represents the number of people standing in line. 
		- So what is the expected value? So when you go out at random and you look at the number of people standing in line, what is the expected value? How many people do you expect to see in line on average?
			- It's much more likely you'll see 2 people standing in line than seeing 8 people standing in line. So what is the expected value? 
	- Example of expected value shown. 
		- This is what we call the weighted average or the expected value
	- Average value would be more between 4 and 5. The expected value was found to be 3.18
