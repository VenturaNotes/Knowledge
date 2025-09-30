---
aliases:
  - class attribute
  - class attributes
---
## Synthesis
### Description
- Showing the difference between class attributes and [[Instance Attribute (Python)|instance attributes]]
### Example
```python
class Car:
    # Class attribute
    wheels = 4

    def __init__(self, brand, model):
        # Instance attributes
        self.brand = brand
        self.model = model

# Creating instances of the Car class
car1 = Car("Toyota", "Corolla")
car2 = Car("Honda", "Civic")

# Accessing class attribute via class and instances
print(Car.wheels)  # Output: 4
print(car1.wheels) # Output: 4
print(car2.wheels) # Output: 4

# Accessing instance attributes
print(car1.brand)  # Output: Toyota
print(car1.model)  # Output: Corolla
print(car2.brand)  # Output: Honda
print(car2.model)  # Output: Civic

# Modifying class attribute
Car.wheels = 3
print(Car.wheels)  # Output: 3
print(car1.wheels) # Output: 3
print(car2.wheels) # Output: 3

# Modifying instance attribute
car1.brand = "Ford"
print(car1.brand)  # Output: Ford
print(car2.brand)  # Output: Honda
```

#### Class Attribute
- Defined inside a class but outside any methods
## Source[^1]
- 
## References

[^1]: 