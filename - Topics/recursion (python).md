---
aliases:
  - recursion
---
## Synthesis

- Give me an example on how to do recursion in python

[1]
Here is a classic example using **Factorial** ($5! = 5 \times 4 \times 3 \times 2 \times 1 = 120$):

```python
def factorial(n):
    # 1. Base Case: Stops the recursion
    if n <= 1:
        return 1

    # 2. Recursive Case: Calls itself with a smaller input
    return n * factorial(n - 1)

print(factorial(5))  # Output: 120
```

### Every recursive function needs two things:
1. **Base Case:** A condition to stop calling itself and prevent an infinite loop.
2. **Recursive Step:** Breaking the problem down and calling itself with inputs moving closer to the base case.
[/1]

Lets say i'm within a def function, how would I create a recursion while in the def function?
[2]
You have two common ways to do this:

---

### Option 1: Define an Inner Helper Function *(Most common on LeetCode)*
You define a recursive function **inside** your main function and then call it:

```python
def main_function(root):

    # 1. Define the inner recursive function
    def helper(node):
        if not node:  # Base case
            return 0
        return 1 + helper(node.left)  # Recursive call

    # 2. Call it and return the result
    return helper(root)
```
*Tip: The inner function automatically has access to variables in the outer function without needing to pass them as arguments.*

---
### Option 2: Call the Outer Function Directly
You can just have the outer function call itself:

* **In a regular function:**
```python
  def count_down(n):
      if n <= 0:
          return
      print(n)
      count_down(n - 1)  # Calls itself
```

* **Inside a LeetCode class (using `self`):**
```python
  class Solution:

      def isSameTree(self, p, q):
          if not p or not q:
              return p is q

          # Calls itself using `self.`
          return (
              p.val == q.val
              and self.isSameTree(p.left, q.left)
              and self.isSameTree(p.right, q.right)
          )
```
- [ ] How does that work? 
[/2]


## Source [^1]
- 
## References

[^1]: