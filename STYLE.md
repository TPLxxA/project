#Names:
- camelCase
- Names are short, accurate and try to describe the intent of the code.

```javascript
var aVariable = 10
const aSecondVariable = 'String'
```

#Headers:
- Contains:
    - Name
    - Studentnumber
    - Summary of the programs intent
    - Optional: include name of the education or minor
- In the top of the file in a multi-line comment
- Do not explain functions or other details of the code

```javascript
/*
    Name:
    Studentnumber:
    Summary:
    (Education):
*/
```

#Layout
- Positioning of elements is consistent between files and in line with platform conventions; positioning of elements within source files is optimized for readability.
- If applicable, redundant solutions are placed in functions

#Formatting
- Add white space after if statement, for loops, while loops, functions so that it is clear which elements belong together
- Indents are done with the tab key. 1 tab for 1 indent
- 1 space between accolades like so: { return test }
- Calculations also have spaces like so: test / 2 and not test/2
- Single quotes for strings
- Functions are described with multi line comments
- lines of code are described on a single line with single line comments.

```javascript
/**
 * this is a function
 * that does something
 */
function make(tag) {

  // ...

  return element;
}
```

#Flow
- Duplicate code is limited as are jumps. Jumps are limited to 1 or 2 functions.  


#Idiom
- Choice of control structure is appropriate. Reuse of library functionality and generic data structures where possible.


#Expressions
- Expressions are all essential for control flow. Expressions are simple; data types are appropriate.


#Decomposition
- Routines perform a very limited set of tasks and the number of parameters and shared variables is limited.

```javascript
// like so
const increasedByOne = [];
numbers.forEach((num) => {
  increasedByOne.push(num + 1);
});

// or like this
const increasedByOne = numbers.map(num => num + 1);
```

#Modularization
- Modules are defined such that communication between them is limited. Modules have clearly defined responsibilities, contain few variables and a somewhat limited amount of routines.

```javascript
// module import like so
import styleGuide from './styleGuide';
```
