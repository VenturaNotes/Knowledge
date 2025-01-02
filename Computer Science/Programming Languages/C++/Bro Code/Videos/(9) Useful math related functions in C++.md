---
Source:
  - https://www.youtube.com/watch?v=LXq3OhajeeU
Reviewed: false
---
```c++
#include <iostream>
#include <cmath>

int main()
{
	double x = 3;
	double y = 4;
	double z;

	// Max function returns the greater of two vales or variables. Returns 4
	z = std::max(x, y); 
	std::cout << z;
	
	// Min function returns minimum of two values. Returns 3
	z = std::min(x, y); 
	std::cout << z;

	
	int pow_func = pow(2, 3); //Raises 2 to power of 3 returns 8
	int sqr_func = sqrt(9); //Square root function
	int abs_func = abs(-5); //absolute value function
	
	int rnd_func = round(3.5); //0.5 and above rounds up to nearest integer
	// Below 0.5 will round down to nearest integer

	int ceil_func = ceil(3.5); // Always rounds up to nearest integer
	// -5.9 will round to -5

	int flr_func = floor(3.5); // Will always round down to nearest integer
	//This means for -3.2 will round to -4

	return 0;
}
```
- Great website for [math functions](https://cplusplus.com/reference/cmath/)