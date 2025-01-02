---
Source:
  - https://www.youtube.com/watch?v=y5Cx07OHaOI
Length: 23 minutes, 40 seconds
tags:
  - status/incomplete
  - type/video
Reviewed: false
---
- (This is a Minecraft channel so talks a lot in reference to Minecraft)

HashSet
HashMap
![[Screenshot 2022-10-30 at 3.35.54 AM.png]]

A set is a collection of things. You can store any kind of information in there such as letters, numbers and words. They do not have an order but can be used to check if an element already exists in the set quickly
![[Screenshot 2022-10-30 at 3.38.10 AM.png]]

Maps (no explicit ordering in general)
They map a key from a value

Map name -> Age
Alice -> 17
Bob -> 20
Charlie -> 19

How old is "Alice"? Take string and search for it in map very efficiently

17 is answer
![[Screenshot 2022-10-30 at 3.47.30 AM.png]]

Sets are maps with null values.

Elementary operations of Sets
- contains (VERY EFFICIENT) (checks if element is in a set or not)
- add (VERY EFFICIENT) (will add element to a set if it doesn't already exist)
- remove (VERY EFFICIENT) (remove element from set if it exists)
- iterator (NOT INEFFICIENT OR EFFICIENT) (will loop over set to get every element in set in an unspecified order)

Other Operations:
- Size
- isEmpty
![[Screenshot 2022-10-30 at 3.52.52 AM.png]]

|               | contains, add, remove | ordering         |
| ------------- | --------------------- | ---------------- |
| TreeSet       | Somewhat Fast         | Natural Ordering |
| HashSet       | Very fast             | unspecified      |
| LinkedHashSet | Very Fast (slower than hashset)             | Insertion order                 |

If you use TreeSet, you'll get A, E, I, O, U from E, A, I, U, O
LinkedHashSet: by inserting I, U, A, E, O, you'll return I, U, A, E, O
![[Screenshot 2022-10-30 at 3.57.26 AM.png]]

A hash function is a function which takes in your element

f(element) $\rightarrow$ number (hash)

f("Hello") $\rightarrow$ 625268
f("Hi") $\rightarrow$ 810
f("Hello") $\rightarrow$ 625268
![[Screenshot 2022-10-30 at 4.09.31 PM.png]]


Next step for HashSet is to construct an array.

The slots in the HashSet array are usually called "buckets" or "bins"

f("Hello") $\rightarrow$ 625286 % 4 = 2
"Hi" $\rightarrow$ 820 % 4 = 0

| "Hi" |     | "Hello" |     | 
| ---- | --- | ------- | --- |

contains ("Hello")?

f("Hello") $\rightarrow$ 625286 % 4 = 2

The Hashset is so fast because all you have to do is compute this function and then jump straight to the element in the array. So either you found it, or find an empty cell.

![[Screenshot 2022-10-30 at 4.23.32 PM.png]]

What happens when two strings get the same hashvalue?
|     |     | "Hello" |     | "Hi" |     |     |
| --- | --- | ------- | --- | ---- | --- | --- |

f $\rightarrow$ evenly distributed 

f("Ilmumbo") $\rightarrow$ 2 % 8 = 2


|     |     | "Hello" |     | "Hi" |     |     |
| --- | --- | ------- | --- | ---- | --- | --- |
|     |     |    "Ilmumbo"     |     |      |     |     |

The "Hello" slot becomes an ordered list of slots

contains ("Ilmumbo")?
f("Ilmumbo") $\rightarrow$ 2 % 8 = 2
We would move to second element of list to find "Ilmumbo" returning false.
This is what happens if the collide
![[Screenshot 2022-10-30 at 4.30.38 PM.png]]

Iteration Order:

Initialized a hash set with a hash size of 8 even though it always starts off at 16.

Inserted in this order:
A $\rightarrow$ 5, B $\rightarrow$ 3, C $\rightarrow$ 0, D $\rightarrow$ 3, E $\rightarrow$ 4

| C   |     |     | B   | E   | A   |     |     | 
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |     |     |   D  |     |     |     |     |

Returned in this order:
C,B,D,E,A

If the elements are in the same slot (creating a list), the order you put them in would be the order you get them returned

![[Screenshot 2022-10-30 at 4.36.58 PM.png]]

A rehash happens when the hash set is three-quarters full.

Inserted in this order:
A $\rightarrow$ 5, B $\rightarrow$ 3, C $\rightarrow$ 0, D $\rightarrow$ 3, E $\rightarrow$ 4, F $\rightarrow$ 7


| C   |     |     | B   | E   | A   |     |   F  | 
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |     |     |   D  |     |     |     |     |


The array will double in size (will be 16 in length)
We'll then go through every element in the hash set and recalculate where they are in the array. Inefficient but if you only have to do it once, it's not so bad.

![[Screenshot 2022-10-30 at 4.43.15 PM.png]]

If there are 8 elements that have the same hash (going to the same bucket), the structure will change to a tree. Mitigates needing to do a linear search. May mess up iteration order

| A   |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B   |     |     |     |     |     |     |     |
| C   |     |     |     |     |     |     |     |
| D   |     |     |     |     |     |     |     |
| E   |     |     |     |     |     |     |     |
| F   |     |     |     |     |     |     |     |
| G   |     |     |     |     |     |     |     |

![[Screenshot 2022-10-30 at 4.58.23 PM.png]]
