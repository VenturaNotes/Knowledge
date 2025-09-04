## Synthesis
- 
## Source [^1]
- A method for proving the partial correctness of a program (see PROGRAM CORRECTNESS PROOF). Certain points in the program are designated as [[cut point|cut-points]], and to each cut-point is attached an inductive assertion. The inductive assertions are chosen so that, whenever a cut-point is reached, the program is in a ‘correct state’, i.e. one that satisfies the inductive assertion attached to that point. To establish this, it is necessary to consider each ‘minimal path’, i.e. each path leading from a cut-point directly to a cut-point, and to show that, provided the program is already in a correct state, it will still be in one after following that path.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]