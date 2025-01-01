---
Source:
  - https://youtube.com/watch?v=J2K_-ghz9Ts
Reviewed: false
---
- ![[Screenshot 2023-12-29 at 3.58.33 PM.png]]
	- Construct a steel gas tank that holds $100m^3$ in the shape of a [[cylinder]] with semi-spherical ends using the least amount of steel
		- There are semi-spheres at the end
		- Find surface area of [[sphere]]
	- The problem is asking us to find the minimum amount of steel needed to hold $100m^3$ (in volume)
		- (1) The steel needed would make up the surface area. We find the equation for that to be $A = 2\pi RL + 4\pi R^2$
		- (2) Now we need the constraint of holding $100m^3$. The volume of this object can be calculated as $V = \pi R^2L + \frac {4}{3} \pi R^3 = 100$ 
		- (3) We then solve for L and include this limitation in the surface area equation
		- (4) We then find the derivative with respect to R for $\frac{dA}{dR}$  and set it equal to 0. The value found for R will be the minimum radius needed.
			- ![[Screenshot 2023-12-29 at 11.10.43 PM.png]]
				- The derivative shows that the minimum surface area needed (not including negatives) would have a radius of 2.879 which would give the total surface area to be $104.188m^2$
				- We would need to use the [[second derivative test]] to confirm that R = 2.879 is indeed a minimum
		- (5) Finding measure for L shows 0m. 