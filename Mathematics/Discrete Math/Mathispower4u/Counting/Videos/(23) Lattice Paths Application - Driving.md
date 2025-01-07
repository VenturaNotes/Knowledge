---
Source:
  - https://www.youtube.com/watch?v=HzhmTohfdkw
Reviewed: false
---
- ![[Screenshot 2025-01-07 at 1.32.54 PM.png]]
	- Lattice Paths
		- `Gridtown` USA, besides having excellent donut shops, is known for its precisely laid out grid of streets and avenues. Streets run east-west, and avenues north-south
		- Suppose you live on the corner of $2^{nd}$ Ave and $3^{rd}$ St and work on the corner of 8 Ave and $10^{th}$ St.
			- (a) How many different shortest routes can you take to work?
			- (b) Now suppose you want to stop and get a donut on the way to work. Your favorite donut shop is on the corner of 6th Ave and 8th St. How many shortest routes to work, stopping at the donut shop, can you take?
	- Lattice Paths
		- (c) There is a pothole on 4th Ave between 5th St and 6th St. How many shortest routes to work can you take to avoid the pothole?
			- Calculating all shortest routes to work and subtracting all routes that include going down a specific road
		- (d) The pothole has been repaired and a new donut shop has opened on the corner of 3rd Ave and 7th St. How many shortest routes to work drive by one or the other (or both) donut shops? Hint: Other donut shop is at 6th Ave and 8th St. USE [[principle of inclusion-exclusion|PIE]]
			- Finding all possible routes for both donut shops and then subtracting all possible routes including both (as they're already counted for)
