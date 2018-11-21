Q & A

1. Explain the difference between the == operator and the === operator.
Both operators are used to compare for equality, but for the === operator the
data type must be identical to be considered equal. For the == operator data types
are not taken into account, meaning that if two values are not the same type
the === will simply return false, whereas == will return True.

2. Explain what a closure is. (Note that JavaScript programs use closures very often)
Closure is when an inner function of a function has access to parameters of the outer function,
even when executed outside the scope of the outer function.
So, closures are created by writing a function which returns another function that uses/alters
the parameters you pass in. It'll return a function which "remembers" the parameters you
passed in, so you can do something else with it.

3. Explain what higher order functions are.
A higher-order function is a function that either takes another function as an
argument or returns a function.

4. Explain what a query selector is and give an example line of JavaScript that uses a query selector.
It returns the first element that matches a specified CSS selector in a document.

file.querySelector("p");  this will give the first element matching <p> in file.
