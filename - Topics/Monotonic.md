---
tags:
  - in-progress
---
## Synthesis
- In math, monotonic means that a function or sequence moves consistently in only one direction. It never changes direction. Examples include
	- Only goes up or stays flat
		- (1, 3, 5, 5, 5, 6, 7)
			- A monotonic sequence that is monotonically increasing (aka non-decreasing)
			- This is **NOT** strictly increasing though
		- (1, 3, 5, 6, 7)
			- This is a strictly increasing sequence because every number is strictly larger than the one before
	- Only goes down or stays flat
### Two Main Types of Monotonicity
- Does monotonicity just mean the state of being something being monotonic? Can it only be a sequence or series?
[2]
### 2. Can it only be applied to a sequence or series?

**No, not at all!** Monotonicity is a broad concept used across many areas of math, logic, economics, and computer science.

Here are several other places where monotonicity is used:
#### A. Continuous Functions (Calculus & Graphing)

Functions defined over intervals (like real numbers) can have monotonicity.
- **Example:** $f(x) = e^x$ or $f(x) = x^3$ .
- On a graph, a monotonic function is a curve that never turns around. It either climbs forever or falls forever.
#### B. Set Theory & Probability (Measures)

In set theory, monotonicity means that **larger sets get larger (or equal) values**.
- **Example in Probability:** If Event A is completely contained inside Event B (e.g., $A =$ "it snows heavily" and $B =$ "it snows"), then the probability of A cannot be greater than the probability of B:
    $$\text{If } A \subseteq B, \text{ then } P(A) \le P(B)$$
    This property is called the **monotonicity of probability**.

#### C. Logic and Computer Science ("Monotonic Logic")

In formal logic and artificial intelligence:
- **Monotonic Logic:** Adding new information/facts will **never invalidate** previously proven facts. Once something is true, it stays true no matter how much more data you add.
- (Non-monotonic logic, by contrast, is like everyday human reasoning: learning a new fact can make you change your mind about something you previously believed).

#### D. Economics & Voting Theory
- **Monotonic Voting Systems:** A voting system is monotonic if ranking a candidate higher on your ballot can never hurt that candidate's chances of winning.
- **Monotonic Preferences:** In economics, if you prefer bundle A over bundle B, adding more goods to bundle A will never make you prefer bundle B instead ("more is always better or equal").

---

### Summary

The word root comes from Greek (mono = single, tonos = tone/direction). Anywhere in math or logic where things **consistently move or scale in a single direction without reversing**, the concept of **monotonicity** applies!
[/2]

[1]
### The Two Main Types of Monotonicity

#### 1. Monotonically Increasing (or Non-decreasing)

As you move from left to right, the values **never decrease**. They either get larger or stay the same.
- **Strictly Increasing:** The values always get strictly larger (never flat).
- **Non-decreasing:** The values get larger or stay flat, but never go down.

#### 2. Monotonically Decreasing (or Non-increasing)

As you move from left to right, the values **never increase**. They either get smaller or stay the same.
- **Strictly Decreasing:** The values always get strictly smaller (never flat).
- **Non-increasing:** The values get smaller or stay flat, but never go up.

---

### Simple Examples

#### Example 1: Monotonically Increasing Function

Consider the function **$f(x) = 2x + 3$** .
- If $x = 1$ , $f(1) = 5$
- If $x = 2$ , $f(2) = 7$
- If $x = 3$ , $f(3) = 9$

As $x$ increases, $f(x)$ always gets larger. Because it constantly goes up and never goes down, it is **monotonically increasing** (specifically, strictly increasing).

---

#### Example 2: Monotonically Decreasing Function

Consider the function **$f(x) = -x$** .
- If $x = 1$ , $f(1) = -1$
- If $x = 2$ , $f(2) = -2$
- If $x = 3$ , $f(3) = -3$

As $x$ increases, $f(x)$ always gets smaller. It is **monotonically decreasing**.

---

#### Example 3: Non-decreasing Sequence (With Flat Spots)

Consider the sequence of numbers: **$1, 2, 2, 3, 4, 4, 5, \dots$**

Notice that the numbers go up or stay equal ( $2 \to 2$ , $4 \to 4$ ), but **they never go down**. This is still **monotonically increasing** (non-decreasing).

---

### What is NOT Monotonic?

A function like **$f(x) = x^2$** across all real numbers is **not monotonic**:
- For negative inputs ( $x = -2$ to $x = 0$ ), the values decrease ( $4 \to 0$ ).
- For positive inputs ( $x = 0$ to $x = 2$ ), the values increase ( $0 \to 4$ ).

Because it goes down and then turns around to go up, **$f(x) = x^2$ is not monotonic** over its whole domain (though it is monotonic if you only look at positive numbers, $x \ge 0$ ).

---

### Quick Analogy
- **Monotonic:** Walking up a staircase (you only go higher or pause on a flat landing, but you never step downward).
- **Non-monotonic:** Riding a roller coaster (you go up, then down, then up again).
[/1]


## Source [^1]
- The word monotonic means "always moving in the same direction", in our case, always going up.
## Source[^2]
- (1) Assuming that appropriate ordering relations exist on the domain $A$ and the codomain $B$ of the function $f: A \rightarrow B$, then $f$ is said to be monotonic if for all $a$ in $A$ and $b$ in $B$ for which $a \leq b$ then $f(a) \leq f(b)$. 
- (2) See WEAKENING.
## Source[^3]
- adj. The property of a sequence or a function of consistently increasing in value or staying the same, or of consistently decreasing in value or staying the same. Also called a monotone sequence or function. See also monotonicity. \[From Greek monos single, solitary, or alone + tonos a tone + -ikos of, relating to, or resembling]
## References

[^1]: https://economics.stackexchange.com/questions/40601/what-is-monotonicity-and-strict-monotonicity-in-preferences
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^3]: [[(Home Page) A Dictionary of Psychology 4th Edition by Oxford Reference]]