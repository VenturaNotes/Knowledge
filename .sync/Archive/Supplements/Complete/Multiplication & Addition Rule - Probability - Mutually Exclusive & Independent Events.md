[Video](https://youtu.be/94AmzeR9n2w)

- Two basic rules of probability
	- Addition Rule
		- $P(A \text{ or } B) = P(A\cup B) = P(A) + P(B) - P(A \text{ and } B)$
			- $P(A) + P(B) - P(A \text{ and } B)$
				- The formula above will always work regardless of what kind of events you're dealing with
		- Mutually Exclusive Events (P(A) and P(B))
			- $P(A \text { and } B) = 0$ 
				- Probability of getting A and B together is 0
			- $P(A \text { or } B) = P(A) + P(B)$
				- This is always true if P(A) and P(B) are mutually exclusive events
	- Multiplication Rule
		- Dependent Events
			- $P(A|B) = \frac{P(A \text { and } B)} {P(B)}$ 
				- The expression to the left is read as "the probability of A given B"
				- If we multiply both side by P(B), we can get the below equation
					- $P(A \text { and } B) = P(A|B) * P(B)$
			- $P(B|A) = \frac{P(A \text{ and } B)} {P(A)}$
				- This is still the probability of A and B occurring but divided by the probability of A
				- If we multiply both sides by P(A), we get the below equation
					- $P(A \text { and } B) = P(B|A) * P(A)$ 
			- $P(A \text { and } B)$
				- This means that the events are occurring at the same time
				- AB is different from BA since the order matters here
		- Independent Events
			- $P(A|B) = P(A)$
				- This is because A does not depend on B
			- $P(B|A) = P(B)$
				- B does not depend on A
			- For independent events
				- $P(A \text{ and } B) = P(A) * P(B)$
				- $P(A \text { and } B) = P(B \text { and } A)$
				- This is because the 2 events occur at the same time.
- Example
	- 1. Sarah is deciding which courses she wants to take in her next college semester. The probability that she enrolls in an Algebra course is 0.30 and the probability that she enrolls in a Biology course is 0.70. The probability that she will enroll in an Algebra course GIVEN that she enrolls in a Biology course is 0.40. (a) What is the probability that she will enroll in both an Algebra course AND a Biology course? (b) What is the probability that she will enroll in an Algebra course OR a biology course? (c) Are the two events independent? (d) Are the two events mutually exclusive?
	- Initial Values
		- ![[Screenshot 2022-12-13 at 7.52.38 PM.png]]
	- (a) What is the probability that she will enroll in both an Algebra course AND a Biology course? 
		- ![[Screenshot 2022-12-13 at 7.53.36 PM.png]]
	- (b) What is the probability that she will enroll in an Algebra course OR a biology course? 
		- ![[Screenshot 2022-12-13 at 7.53.44 PM.png]]
			- Took P(A and B) form part (a)
	- (c) Are the two events independent? 
		- ![[Screenshot 2022-12-13 at 7.54.35 PM.png]]
			- For it to be true:
				- Probability of A given B must be equal to the probability of A
	- (d) Are the two events mutually exclusive?
		- ![[Screenshot 2022-12-13 at 7.57.09 PM.png]]
			- For the events to be mutually exclusive, P(A and B) = 0 must be true.



Questions #learn
- How does $P(A) * P(B|A) = P(A \text { and } B)$$ ? 
	- I would like to learn the order of operations for probability
