[Video](https://youtu.be/VpuN8vCQ--M)

## Law of Large Numbers
- If we take a sample of `n` observations of our random variable and we were to average all of those observations 
- x
	- Is a random variable
- E(x )
	- Expected value or population mean
- $\overline x_n$ 
	- This is the mean of n observations of our random variable
- $\overline x_n= \frac {x_1 + x_2 + x_3 ... + x_n} {n}$
	- If you run it once, you get 1 observation ($x_1$) and you run it again to get the second observation ($x_2$ )
	- `n`
		- Dividing it by the # of observations
	- $\overline x_n$ 
		- This is your sample mean (mean of all observations made)
- The law of large numbers tells us that our sample mean will approach the expected value of the random variable
	- $\overline x_n \rightarrow E(x)$
- The sample mean will approach the population mean for $n \rightarrow \infty$ 
	- $\overline x_n \rightarrow \mu$
- If you take a large enough sample, you will get the expected value of the population as a whole
	- Makes sense because if you do enough trials over large samples that the trials would give the numbers given the expected value

### Example
- x = # of heads after 100 tosses of fair coin
	- Random variable x is equal to the number of heads after 100 tosses of a fair coin
- $E(x) = 100*.5 = 50$ 
	- Expected value is the # of tosses/trials $\times$ the probability of success in any trial 
- If we averaged sample of a bunch of these trials
	- $\overline x_n = \frac{55 + 65 + 45 + ... +n} {n}$
		- If you flip 100 coins in a shoe box, you can get 55, 65, and 45 heads up
	- $\overline x_n \rightarrow 50 \text{ as } n \rightarrow \infty$ 
		- Law of large numbers tells us that the average found of all of the observations is going to converge to 50 as n approaches infinity
- Image
	- n axis is the number of trials taken
	- y-axis is the sample mean $\overline x_n$ 
	- Expected value is 50 ($E(x)$)
- Gambler's Fallacy
	- If you have a bunch of heads to start off with, you are more likely to get more tails. 
	- If you have a long streak of heads, you'll have a higher likelihood of having a disproportionate number of tails. (This is not true)
- Law of large numbers
	- After some finite number of trials, it's possible for the average of heads could be 70. 
	- Law of large numbers doesn't care about the # of finite trials. We have an infinite number of trials left. 
	- Expected value for infinite number of trials will be 50.  You will eventually converge back to the expected value
	- It is not telling you that if you get more heads, the probability of tails will increase to make up for the heads
		- What it's really telling you is that whatever happened in your finite number of trials, you have an infinite number of trials left and if you do enough of them, it will converge back to 50.
	- With lottery and casinos
		- If you do large enough samples (even if you deviate significantly), the house will always win because of the parameters they are including in the game 
- All it's saying is that as you take more and more samples, the average of that sample is going to approximate the true average 
	- the mean of the sample is going to converge to the true mean of the population or to the expected value of the random variable