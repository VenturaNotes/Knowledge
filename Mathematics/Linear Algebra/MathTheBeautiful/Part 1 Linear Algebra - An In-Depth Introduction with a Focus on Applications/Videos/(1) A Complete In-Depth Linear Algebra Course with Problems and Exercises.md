---
Source:
  - https://www.youtube.com/watch?v=Fnfh8jNqBlg
Reviewed: false
---
- ![[Screenshot 2023-07-10 at 10.50.45 PM.png]]
	- There are thousands of applications of linear algebra
	- Linear algebra may be more powerful than calculus because of computers
	- Linear algebra is the place where algebra and geometry meet
	- Parts of [[eye]]
		- [[Iris]]
		- [[Cornea]]
		- [[Aqueous humor]]
		- [[Retina]]
			- Home to the light sensors called [[rods]] and [[cones]]
			- Thanks to their great numbers that we can see such striking images
			- A total of 100,000,000 sensors
				- Can think of this number as resolution of eye
			- By comparison, most advanced monitor in 2015 is 15,000,000 pixels
				- Less than $\frac 16$ the resolution of the eye
		- [[Sclera]]
		- [[Disc]]
		- [[Fovea]]
		- [[Vitreous humor]]
		- [[Optic nerve]]
	- How many sensors does an ear have? (linear algebra will help us solve this mystery)
		- 1
		- There is a single signal that enters your ear and therefore takes a single sensor to receive it
			- All of the sounds get added together, and it is their sum that enters your ear
- ![[Screenshot 2023-07-10 at 11.04.37 PM.png]]
	- I will play there notes simultaneously on the piano. We'll look at the resulting audio signal in the computer and by analyzing that signal, we'll try to determine what those notes were
		- Since it is a digital piano, when we play those three notes at the same time, its internal logic will add the 3 signals together and then its speakers will play the resulting sum
		- Had it been a real piano, then the three notes would sound individually, but then the laws of physics would add up the three signals together.
		- In either case, the microphone receives the resulting sum
			- The task we're faced with is decomposing that one signal into the individual notes. So the task we're faced with is that of decomposition (taking resulting sum and determining what elements went into that sum and what proportion)
				- The problem of decomposition is the first and biggest topic of linear algebra
	- Description of sound
		- Starts out loud and then gradually dies out
		- Seeing subtle oscillations in volume (known as [[beats]])
		- Zoomed out level does not give us enough detail to begin determining the notes that were played
		- Having zoomed in 4/100th of a second, we're finally seeing the complexity involved
			- It's this complexity responsible for storing such rich information in a single [[signal]]
			- What we're seeing is a signal that's somewhat periodic which is characteristic of musical tones
				- Two major features that our eye easily picks up 
					- See 7 major oscillations
						- Meaning 175 oscillations/second
				- Piano key frequencies
					- 174.614 corresponds to F in 3rd octave (were correct)
				- There are roughly 6 smaller oscillations for each of the larger ones
					- $175*6 = 1050$
						- This corresponds to C in 6th octave (small mistake with the C we picked )
				- We missed A flat entirely
		- Finding 2 out of the 3 notes really wasn't that bad given how simplistic our approach was
			- Demonstrated linear algebra idea of [[decomposition]] (occupies nearly $\frac 13$ of our entire linear algebra course)

## Worksheet
### (2) MathBox
- Typing Tutorial
- $x^2$ = `x^2`
- $\sqrt{x}$ = `Command-r x`
- $\alpha$ = `aa` rapidly
- $\frac 12$ = `1/2`
- $\mathbb{R}$ = `RRR` rapidly
- $\mathbb{R}^4$ = `RRRRRR` rapidly = holding `Shift R`
- $sin\beta$ = `sinbb`
- 1 = 1
- no solution = `ns` = `empty set` symbol from symbols menu

### (3) MathBox and Matrices
- ![[Screenshot 2025-10-23 at 3.04.13 PM.png]]
- A matrix is a table of numbers surrounded by square brackets $\begin{bmatrix}1 & 2 & 3\\ 4 & 5 & 6 \\\end{bmatrix}$
	- This is $2 \times 3$, that is it has 2 rows and 3 columns

### (4) Enter a Matrix and Its Transpose
- ![[Screenshot 2025-10-23 at 3.09.04 PM.png|600]]
	- Now let's discuss the 'transpose' of A denoted by $A^T$. The [[transpose]] of A is obtained from A by turning its rows into columns (or, alternatively, its columns into rows).