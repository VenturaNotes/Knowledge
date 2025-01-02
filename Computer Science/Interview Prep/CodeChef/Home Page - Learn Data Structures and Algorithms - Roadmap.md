---
Source:
  - https://www.codechef.com/roadmap/data-structures-and-algorithms
Length: "456"
tags:
  - status/incomplete
  - type/website
Reviewed: false
---
## (1) Linear Data Structures
### (1.1) Linked Lists
#### (1.1.1) Linked List - Concept
- ![[Screenshot 2024-10-07 at 10.06.21 PM.png]]
- [[Linked list]] is a linear data structure where each element is a separate object connected to each other and is similar to Arrays.
	- Head pointer of linked list maintained
	- Each node contains two fields
		- Value (integer)
		- Pointer to next node
	- Last node of linked list is called Tail. The Tail's next pointer is NULL address indicating no element after
- Primary operations
	- Insertion: Inserting an element at end/beginning or in the middle at some kth position
	- Deletion: Deleting an element from the list
	- Display: Traversing the whole linked list and output each element
- We use a Node class for each node of linked list

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None
# Creating head of the Linked list
head = Node(1)
print("The value at head is", head.value)

#Output:
# The value at head is 1
```
#### (1.1.2) Linked List Terminology
- Terms for Linked List
	- Node
	- Head
	- Tail
	- Pointer to next node
#### (1.1.3) Linked List - Operations
- Primary operations (mentioned in 1.1.1)
- Because linked list is a basic data structure, you can do many more operations on it as required.
#### (1.1.4) Insertion in Linked List
- 
#### (1.1.5) Linked List - Insertion at end
#### (1.1.6) Linked List - Insert at front
#### (1.1.7) Linked List - Insertion at k-th position
#### (1.1.8) MCQ - Insert at end
#### (1.1.9) Optimal insertion at the end
#### (1.1.10) Summary - Linked list
#### (1.1.11) Delete from Front - MCQ
#### (1.1.12) Delete from front
#### (1.1.13) Delete from any position
### (1.2) Circular and Doubly Linked Lists
#### (1.2.1) Circular Linked List
#### (1.2.2) Insertion at end in Circular Linked List
#### (1.2.3) Deletion in Circular Linked List
#### (1.2.4) Introduction - Doubly Linked List
#### (1.2.5) Insertion in Doubly Linked List
#### (1.2.6) Deletion - Doubly Linked List
#### (1.2.7) Practice - Josephus Problem
#### (1.2.8) Practice - Music Player
### (1.3) Stacks
#### (1.3.1) Stack Introduction
#### (1.3.2) Push and Pop
#### (1.3.3) Simulate Push and Pop
#### (1.3.4) Peek, isEmpty, isFull
#### (1.3.5) Simulate Stack - 1
#### (1.3.6) Simulate Stack - 2
#### (1.3.7) Implement Stack using Arrays
#### (1.3.8) Use cases of Stack
## (2) Basic Algorithms
### (2.1) Fundamentals of Time Complexity
#### (2.1.1) Introduction to time complexity
#### (2.1.2) Finding time complexity - Rule 1
#### (2.1.3) Finding time complexity - O(N)
#### (2.1.4) Finding time complexity - Rule 2
#### (2.1.5) Finding time complexity - Nested loops
#### (2.1.6) Summary of Time Complexity
### (2.2) Applying time complexity to DSA problems
#### (2.2.1) Two loops
#### (2.2.2) Nested loops with different variables
#### (2.2.3) Time complexity for DSA
#### (2.2.4) Time complexity for DSA
#### (2.2.5) Time complexity for DSA
#### (2.2.6) Time complexity for DSA
#### (2.2.7) Time complexity of standard algorithms
#### (2.2.8) Time complexity of standard algorithms
### (2.3) Space Complexity
#### (2.3.1) Introduction to Space complexity
#### (2.3.2) Finding space complexity
#### (2.3.3) Difference in Auxiliary and Input Space
#### (2.3.4) Space complexity Rules
#### (2.3.5) Finding Space complexity for Nested Loops
#### (2.3.6) Understanding Space Complexity of Algorithms
#### (2.3.7) Trade-Off
#### (2.3.8) Space Complexity MCQ
### (2.4) Searching
#### (2.4.1) What is linear search

#### (2.4.2) Real life implementation

#### (2.4.3) Linear Search in array

#### (2.4.4) Linear Search in string

#### (2.4.5) Miscellaneous Linear Search

#### (2.4.6) Find Kth Character Position

#### (2.4.7) Find smallest and largest numbers

#### (2.4.8) Find Smallest Absolute Difference

#### (2.4.9) Find Pairs Divisible Sum

#### (2.4.10) Find Valid Pair
### (2.5) Sorting
#### (2.5.1) Sorting

#### (2.5.2) Sort three integer

#### (2.5.3) Stability and Inplace Sorting algorithm

#### (2.5.4) Bubble Sort

#### (2.5.5) Implementation of Bubble Sort

#### (2.5.6) Bubble Sort Algorithm Analysis

#### (2.5.7) Complete the implementation

#### (2.5.8) Selection Sort

#### (2.5.9) Pseudocode of Selection Sort

#### (2.5.10) Selection Sort Implementation

#### (2.5.11) Selection Sort Iterations

#### (2.5.12) NGE

#### (2.5.13) Complete the implementation

#### (2.5.14) Insertion Sort

#### (2.5.15) Pseudocode of Insertion Sort

#### (2.5.16) Insertion Sort

#### (2.5.17) Complete the implementation

#### (2.5.18) Merge Sort

#### (2.5.19) Steps for Merging Two Sorted Arrays

#### (2.5.20) Merging

#### (2.5.21) Pseudocode of merge sort

#### (2.5.22) Merge Sort

#### (2.5.23) Complete the implementation

#### (2.5.24) Quick Sort

#### (2.5.25) Quick Sort - Pseudo Code

#### (2.5.26) Rearrange Partitioning function in correct order

#### (2.5.27) Complete the implementation
### (2.6) Introduction to Greedy Algorithms
#### (2.6.1) Introduction to Greedy Algorithms
#### (2.6.2) Chef and String
#### (2.6.3) String Pair Restrictions
#### (2.6.4) Valid String Pairs
#### (2.6.5) Optimal Pair Selection
#### (2.6.6) Optimal Character Pairing
#### (2.6.7) Chef and String
### (2.7) Additional Applications of Greedy Algorithms
#### (2.7.1) Snakes, Mongooses and the Ultimate Election
#### (2.7.2) Optimal Snake Mongoose Strategy
#### (2.7.3) Optimal Snake Elimination
#### (2.7.4) Snakes, Mongooses and the Ultimate Election
### (2.8) Two-Pointer
#### (2.8.1) Remove Duplicates
#### (2.8.2) Difference Pairs
#### (2.8.3) The Great Run
#### (2.8.4) Maximum Common Elements
#### (2.8.5) Coronavirus Spread
#### (2.8.6) Count Pairs
#### (2.8.7) Sort Array by Parity
#### (2.8.8) Largest Common Element in Two Arrays
### (2.9) Sliding Window
#### (2.9.1) Sliding Window
#### (2.9.2) Maximum Sum of K Elements
#### (2.9.3) Longest Substring Without Repeating Characters
#### (2.9.4) Special Substring
#### (2.9.5) Finding the Subarray with Minimum Sum of Size K
### (2.10) Prefix and Suffix Sum
#### (2.10.1) Creating Prefix Array
#### (2.10.2) Optimization Using Prefix Array
#### (2.10.3) Good subarrays
#### (2.10.4) Counting Pretty Numbers
#### (2.10.5) Little Chef and Sums
#### (2.10.6) Good Subarrays 2
#### (2.10.7) Suffix Arrays
#### (2.10.8) Mystical Numbers
#### (2.10.9) Optimal Denomination
#### (2.10.10) Binod
#### (2.10.11) Rectangular Queries
#### (2.10.12) Again XOR problem
#### (2.10.13) Segmentation Fault
#### (2.10.14) Triplets Min
### (2.11) Introduction to binary search
#### (2.11.1) Binary Search

#### (2.11.2) Binary Search

#### (2.11.3) Binary Search Visualization

#### (2.11.4) Binary Search Key Index

#### (2.11.5) Binary Search Key Index - II

#### (2.11.6) The Middle Index

#### (2.11.7) The middle Index - II

#### (2.11.8) Binary Search

#### (2.11.9) Search Insert Position

#### (2.11.10) Time Complexity Analysis of Binary Search

### (2.12) More Problems
#### (2.12.1) Average Flex

#### (2.12.2) Elements less than or equal to Num

#### (2.12.3) Binary Search Student Scores

#### (2.12.4) Average Flex

### (2.13) Fundamentals of Recursion
#### (2.13.1) Introduction to Recursion

#### (2.13.2) Base Condition

#### (2.13.3) Sum of N Natural Numbers

#### (2.13.4) Factorial

#### (2.13.5) Fibonacci Explanation

#### (2.13.6) Fibonacci Series
## (3) Non-linear data structures
### (3.1) What is Matrix
#### (3.1.1) Basic Concepts

#### (3.1.2) Matrix Types and Applications

#### (3.1.3) Matrix Representation

#### (3.1.4) MCQ

### (3.2) Practice
#### (3.2.1) Add Two Matrices

#### (3.2.2) Zig-zag traversal

#### (3.2.3) Upside Down Matrix

#### (3.2.4) Sum of Diagonals

#### (3.2.5) Count Negative Numbers

#### (3.2.6) Multiplication of Two Matrices

#### (3.2.7) Valid Matrix Sum

#### (3.2.8) Sort Matrix Diagonally

#### (3.2.9) Set Matrix Zeroes

#### (3.2.10) Matrix Rotations

#### (3.2.11) Row With Maximum Ones

#### (3.2.12) Equal Rows and Columns

#### (3.2.13) Path With Minimum Sum

#### (3.2.14) Maximal square of all ones

#### (3.2.15) Print Matrix In Spiral Fashion

#### (3.2.16) Maximum Area Island

#### (3.2.17) Rotting Apples

#### (3.2.18) Search In Matrix

#### (3.2.19) Distance to Nearest 0

#### (3.2.20) Median in Matrix

#### (3.2.21) Spiral rotation

### (3.3) Trees
#### (3.3.1) Introduction - Terminology

#### (3.3.2) Type of Tree Node

#### (3.3.3) MCQ - Tree Basic

#### (3.3.4) MCQ - Trees Property

#### (3.3.5) Maximum number of children

#### (3.3.6) Degree of the Node

#### (3.3.7) MCQ - Depth and Height

#### (3.3.8) Ways to represent a tree

#### (3.3.9) Implementation - Adjacency Matrix

#### (3.3.10) Implementation - Adjacency List

#### (3.3.11) Depth First Search

#### (3.3.12) Breadth First Search

#### (3.3.13) Count number of leaf nodes

#### (3.3.14) MCQ - Iterative DFS

#### (3.3.15) Summary of Trees

### (3.4) Introduction to Graphs
#### (3.4.1) Basic Concepts

#### (3.4.2) Counting Graph Edges

#### (3.4.3) Graph Nodes and Edges Count

#### (3.4.4) Graph Types - Undirected and Directed

#### (3.4.5) Connected, Disconnected and Weighted Graphs

#### (3.4.6) Trees and Forests

#### (3.4.7) Maximum Edges in Connected Graph

#### (3.4.8) Acyclic Graph

#### (3.4.9) Disconnected Graph Node Paths

### (3.5) Learn Heaps
#### (3.5.1) Introduction to Heaps

#### (3.5.2) Representation of binary trees as array

#### (3.5.3) Finding indexes of the children of a node

#### (3.5.4) MCQ about Heaps

#### (3.5.5) Insertion in a heap

#### (3.5.6) Rearrange insert pseudo-code

#### (3.5.7) Delete top element in a Heap

#### (3.5.8) Rearrange delete pseudo-code

#### (3.5.9) Implement complete heap

#### (3.5.10) Heap or not

#### (3.5.11) Time Complexity of Heap operations

## (4) Advanced Algorithms
### (4.1) Introduction to Bitwise Operator
#### (4.1.1) Digits
#### (4.1.2) Bits

#### (4.1.3) MCQ - Decimal Value

#### (4.1.4) MCQ - Trailing Zeroes

#### (4.1.5) MCQ - Convert to Binary

#### (4.1.6) Bitwise Operators

#### (4.1.7) Bitwise AND, OR

#### (4.1.8) MCQ - Bitwise AND OR

#### (4.1.9) MCQ - Bitwise AND

#### (4.1.10) MCQ - Bitwise OR

#### (4.1.11) The XOR Operator

#### (4.1.12) MCQ - Bitwise XOR

#### (4.1.13) MCQ - Bitwise XOR Again

#### (4.1.14) Dull Operation

#### (4.1.15) MCQ - OR Operation with 1 Less

#### (4.1.16) MCQ - XOR Operation With 1 Less

#### (4.1.17) Dull Operation

#### (4.1.18) Not Operator

#### (4.1.19) Signed and Unsigned Data Types

#### (4.1.20) Left and Right Shift

#### (4.1.21) MCQ - Left Shift Operation

#### (4.1.22) MCQ - Left Shift on 1

#### (4.1.23) MCQ - Right Shift Operation

#### (4.1.24) Properties of Shift Operators

### (4.2) Implementing Bitwise Operators
#### (4.2.1) MCQ - OR of Array

#### (4.2.2) MCQ - XOR of Two Numbers

#### (4.2.3) Append for OR

#### (4.2.4) Weapon Value

#### (4.2.5) MCQ - Which Bitwise Operator

#### (4.2.6) MCQ - XOR Properties

#### (4.2.7) XOR

#### (4.2.8) Weapon Value

#### (4.2.9) MCQ - Powers of Two

#### (4.2.10) MCQ - Minimum Operations

#### (4.2.11) Make them Zero

#### (4.2.12) Playing with OR

#### (4.2.13) Order by XOR

#### (4.2.14) Longest AND Subarray

#### (4.2.15) Equal by XORing

#### (4.2.16) Consecutive Xor

### (4.3) Introducing Intuition for Dynamic Programming
#### (4.3.1) Introduction to Dynamic Programming

#### (4.3.2) Maximum Subset Sum

#### (4.3.3) Maximum Sum of a Valid Subset

### (4.4) Different Types of Dynamic Programming Problems
#### (4.4.1) Cut Ribbon

#### (4.4.2) Cut Ribbon - MCQ

#### (4.4.3) Cut Ribbon - MCQ II

#### (4.4.4) Cut Ribbon

### (4.5) Prime Factorization
#### (4.5.1) Unlocking the Secrets of Prime

#### (4.5.2) Multiple Choice Question

#### (4.5.3) Multiple Choice Question

#### (4.5.4) Mastering the Art of Prime Factorization

#### (4.5.5) Factorization Frenzy!!

#### (4.5.6) Prime Factor Delusion

#### (4.5.7) Prime Factorization in O(n)

#### (4.5.8) Prime Factorization in Sqrt(n)

#### (4.5.9) Prime Distinctness

#### (4.5.10) Multiple Choice Question

#### (4.5.11) Counting Divisors - I

#### (4.5.12) Exam Cheating

### (4.6) GCD and LCM
#### (4.6.1) Introduction to GCD and LCM

#### (4.6.2) Multiple Choice Question

#### (4.6.3) Book Shelve

#### (4.6.4) GCD - LCM Relationship

#### (4.6.5) Marble Bags

#### (4.6.6) Euclid Algorithm

#### (4.6.7) Euclids Time Quest

#### (4.6.8) Apples and oranges

#### (4.6.9) Cutting Recipes

### (4.7) Modular Arithmetic
#### (4.7.1) Modular Arithmetic

#### (4.7.2) Simple Modulo Remainder

#### (4.7.3) Modulo Congruency

### (4.8) Introduction to Combinatorics
#### (4.8.1) Combinatorics

#### (4.8.2) MCQ - City Path Combinatorics Problem

#### (4.8.3) Rule of Sum

#### (4.8.4) MCQ - City Pathways Combinatorics Challenge II

#### (4.8.5) Rule of product

#### (4.8.6) Modular Arithmetic Basics

#### (4.8.7) Fruit Basket

#### (4.8.8) Set Theory Basics

#### (4.8.9) MCQ - Classroom Subject Participation Count

#### (4.8.10) The Inclusion-Exclusion Principle

#### (4.8.11) Generalized Inclusion-exculusion

#### (4.8.12) Divisibility Problem

#### (4.8.13) Concept

#### (4.8.14) MCQ - Divisibility

#### (4.8.15) Divisibility Problem

#### (4.8.16) Permutations

#### (4.8.17) MCQ - Permutations of Size 3

#### (4.8.18) Calculating number of permutations

#### (4.8.19) MCQ - Fruit Arrangement Combinatorics

#### (4.8.20) Combinations

#### (4.8.21) MCQ - Balanced Team Formation Combinatorics

#### (4.8.22) Calculating Ck

#### (4.8.23) Word Couting

#### (4.8.24) Concept - Combinatorics

#### (4.8.25) MCQ - Placement Choices

#### (4.8.26) Word Couting

### (4.9) Conceptual Problems
#### (4.9.1) Permutation Subsequence

#### (4.9.2) MCQ - Permutation Subsequence Calculation

#### (4.9.3) Concept - Optimizing Permutation Calculation

#### (4.9.4) Permutation Subsequence

#### (4.9.5) Distance Coloring

#### (4.9.6) MCQ - Stone Color Patterns

#### (4.9.7) Concept - Coloring Stones Combinations

#### (4.9.8) Concept - Stone Painting Choices

#### (4.9.9) Distance Coloring

#### (4.9.10) Robot Movings

#### (4.9.11) MCQ - Paths Combinations

#### (4.9.12) Concept - Path Counting Formula

#### (4.9.13) Robot Movings

#### (4.9.14) Marbles
## (5) Advanced Data Structures
### (5.1) DSU
#### (5.1.1) Example Use Of DSU

#### (5.1.2) Introduction to Disjoint Set Union

#### (5.1.3) Need of DSU

#### (5.1.4) Functions in DSU

#### (5.1.5) Find in DSU

#### (5.1.6) Union in DSU

#### (5.1.7) Dry run MCQ

#### (5.1.8) Naive DSU Implementation

#### (5.1.9) Time Complexity of Naive DSU implementation

#### (5.1.10) Optimization 1 - Find

#### (5.1.11) Optimization 2 - Union

#### (5.1.12) Optimized Implementation of DSU

### (5.2) Learn Tries
#### (5.2.1) Need of Trie

#### (5.2.2) Structure of Trie

#### (5.2.3) Insertion in Trie

#### (5.2.4) Rearrange Pseudo-Code for Insertion

#### (5.2.5) Searching

#### (5.2.6) Deletion

#### (5.2.7) Implementation

## (6) Extra Practice
### (6.1) Basic Programming - 1
#### (6.1.1) Defeat The Monster 1

#### (6.1.2) Attack on Kingdom

#### (6.1.3) Three Number Expression

#### (6.1.4) Lucky Number

#### (6.1.5) Pixel Damage

#### (6.1.6) Emotional Proximity

#### (6.1.7) Color the Cube

#### (6.1.8) Taxi Cost

#### (6.1.9) Number of Rectangles

#### (6.1.10) Power M divisibility by 7

#### (6.1.11) Find Integer

#### (6.1.12) Asteroid Hit

### (6.2) Basic Programming - 2
#### (6.2.1) School Assembly

#### (6.2.2) 0xxx1

#### (6.2.3) Divisible and not divisible

#### (6.2.4) RestroPay

#### (6.2.5) Kth Number

#### (6.2.6) Defeat The Monster 2

#### (6.2.7) Subsequences_007

#### (6.2.8) Recover The Permutation

#### (6.2.9) Minimum Integer

#### (6.2.10) Make smaller bigger

#### (6.2.11) Maximum Peak

#### (6.2.12) Strongest still weakest

### (6.3) Arrays
#### (6.3.1) Jump To The End

#### (6.3.2) Array - Pascals or Khayyams triangle

#### (6.3.3) Maximum Partition

#### (6.3.4) Array - Wave Array

#### (6.3.5) Petrol ki Problem

#### (6.3.6) Tunnel Switch

#### (6.3.7) Maximum power of two

#### (6.3.8) Array - Addition

#### (6.3.9) Locate The Product

#### (6.3.10) Array - Matrix operations

### (6.4) Linkedlist
#### (6.4.1) Reverse a Linked List

#### (6.4.2) Find Middle Element of Linked List

#### (6.4.3) Remove Duplicates

#### (6.4.4) Rotate the List

#### (6.4.5) Insert Remove Nodes

#### (6.4.6) Separate Even and Odd values in a linked list

#### (6.4.7) Insert and Delete in Doubly Linked List

#### (6.4.8) Count loop length in Linked List

#### (6.4.9) Reverse the Segment

#### (6.4.10) Duplicate Removal

#### (6.4.11) Reverse m size groups

#### (6.4.12) Critical points in a Linked List

#### (6.4.13) Sort a linked list

#### (6.4.14) Flatten a Linked List

#### (6.4.15) Find Next Smaller value in Linked List

#### (6.4.16) Train Loop

#### (6.4.17) Remove Duplicates from Sorted List

#### (6.4.18) Cycle in a linked list

#### (6.4.19) Linked List - Intersection of Linked Lists

#### (6.4.20) Linked List - Add Two Numbers As Lists

#### (6.4.21) Linked List - Swap nodes in pairs

### (6.5) Binary Search
#### (6.5.1) Good Numbers

#### (6.5.2) Array Intersection

#### (6.5.3) Partner Search

#### (6.5.4) Is It There

#### (6.5.5) Sum with min index

#### (6.5.6) Increasing-Decreasing Sequence

#### (6.5.7) Selected Digits

#### (6.5.8) Binary Search - Books in Library

#### (6.5.9) Binary Search - Paint Walls

#### (6.5.10) Binary Search - Range Search

#### (6.5.11) Binary Search - Power Function

### (6.6) Graphs
#### (6.6.1) Graphs - Capture Regions

#### (6.6.2) Graphs - Word Ladder

#### (6.6.3) Graphs - Red Blue Lakes

#### (6.6.4) Graphs - Clone a graph

#### (6.6.5) Graphs - Valid Path

### (6.7) Trees
#### (6.7.1) Find the Subtree

#### (6.7.2) Reconstruct the Tree

#### (6.7.3) Counting Nodes

#### (6.7.4) Regenerate Tree

#### (6.7.5) Triplet LCA

#### (6.7.6) Trees - Inorder Traversal

#### (6.7.7) Trees - Branch Sum

#### (6.7.8) Trees - Path Sum

#### (6.7.9) Trees - Lowest Common Ancestor

#### (6.7.10) Trees - Height of a Tree

### (6.8) Hashing
#### (6.8.1) Hashing - Four Sum

#### (6.8.2) Hashing - Points on Line

#### (6.8.3) Hashing - Copy List

#### (6.8.4) Hashing - Minimum Window Substring

#### (6.8.5) Hashing - Valid Sudoku

### (6.9) Dynamic Programming
#### (6.9.1) Dynamic Programming - String Distance

#### (6.9.2) Dynamic Programming - Minimum Jumps

#### (6.9.3) Dynamic Programming - Rod Cutting

#### (6.9.4) Dynamic Programming - Longest Valid Parentheses

#### (6.9.5) Maximum Product Subarray

### (6.10) Bit Manipulation
#### (6.10.1) Bit Manipulation - Count set bits

#### (6.10.2) Bit Manipulation - Single Number

#### (6.10.3) Bit Manipulation - Sum of Bits

#### (6.10.4) Bit Manipulation - Reverse Bits

#### (6.10.5) Bit Manipulation - Divide Integers

### (6.11) Backtracking
#### (6.11.1) Backtracking - Find Unique Permutations

#### (6.11.2) Backtracking - Subsets

#### (6.11.3) Backtracking - Find Valid Parenthesis

#### (6.11.4) Backtracking - Unique Combinations Sum

#### (6.11.5) Backtracking - Palindrome Partitioning

### (6.12) Linked List
#### (6.12.1) Remove Duplicates from Sorted List

#### (6.12.2) Critical points in a Linked List

#### (6.12.3) Cycle in a linked list

#### (6.12.4) Find Middle Element of Linked List

### (6.13) Stack and Queue
#### (6.13.1) Valid Parenthesis

#### (6.13.2) Necklace

#### (6.13.3) Stone Pile

#### (6.13.4) Mountain Peak

#### (6.13.5) Transform the Expression

### (6.14) Heap
#### (6.14.1) Representation of a Heap

#### (6.14.2) Insertion in a Heap

#### (6.14.3) Deletion in a Heap

#### (6.14.4) Insertion and deletion together in a Heap

#### (6.14.5) Heap sort

#### (6.14.6) Simple Sorting

#### (6.14.7) Testing Robot

#### (6.14.8) Copy-Paste

#### (6.14.9) Chef and Apple Trees

#### (6.14.10) Cleaning Up