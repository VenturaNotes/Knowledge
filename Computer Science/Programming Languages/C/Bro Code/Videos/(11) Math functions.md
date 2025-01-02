---
Source:
  - https://youtube.com/watch?v=z9m3Qr3SowE
Reviewed: false
---
```C
#include <stdio.h>
#include <math.h>

int main(){
    
    double A = sqrt(9); //3
    double B = pow(2,4); //16
    int C = round(3.14); //3
    int D = ceil(3.14); //4
    int E = floor(3.99); //3
    double F = fabs(-100.0); //Must do "-100.0". Otherwise "100" will be treated as integer type
    double G = log(3); //1.098612
    double H = sin(45); //0.850904
    double I = cos(45); //0.525322
    double J = tan(45); //1.619775

    printf("\n%lf", J);

    return 0;
}
```