[01:28:27](https://www.youtube.com/watch?v=e7BufAVwDiM&t=5307s)

- Declare array and play with it
```bash
#! /bin/bash

car=('BMW' 'Toyota' 'Honda')

# Removes the 3rd element of array
unset car[2]

# Adds Mercedese to 3rd index
car[2]='Mercedese'

#Prints all cars in array
echo "${car[@]}"

#Prints car at 0th index
echo "${car[0]}"

#shows the indexes
echo "${!car[@]}"

#number of values
echo "${#car[@]}"
```
