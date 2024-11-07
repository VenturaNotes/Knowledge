[Video](https://youtube.com/watch?v=Lk-b45vrT8U)

```C
#include <stdio.h>
#include <string.h>

struct Student
{
   char name[12];
   float gpa;
};

int main()
{
   struct Student student1 = {"Spongebob", 3.0};
   struct Student student2 = {"Patrick", 2.5};
   struct Student student3 = {"Sandy", 4.0};
   struct Student student4 = {"Squidward", 2.0};

   struct Student students[] = {student1, student2, student3, student4};

   for(int i = 0; i < sizeof(students)/sizeof(students[0]); i++)
   {
      printf("name:%-12s\t", students[i].name);
      printf("gpa: %.2f\n", students[i].gpa);
   }

   return 0;
}
```