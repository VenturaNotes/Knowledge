---
aliases:
  - software development kit
---
## Synthesis
### Avoid Lock-in
#### Explanation
- This is when you build your software using a specific platform's toolkit (the SDK), making your code so dependent on it that switching to a competitor later would require you to throw away your work and rewrite everything from scratch.
#### Example
- Imagine you build a mobile app and use Google's Firebase SDK to handle your user logins, database, and push notifications. If Firebase later raises its prices or shuts down, you can't just flip a switch to use [[Amazon Web Services]]. You would have to rip out all the Firebase-specific code from your app and spend weeks rewriting it to fit AWS's system.
	- #question What does Google's Firebase SDK look like? How does Amazon Web Services compete?
## Source [^1]
- Abbreviation for software development kit. 
- A collection of the software tools, code libraries, documentation, etc., necessary to develop a specific type of computer software, commonly provided as a single installable package.
## References

[^1]: [[(Home Page) A Dictionary of Business and Management 6th Edition by Oxford Reference]]