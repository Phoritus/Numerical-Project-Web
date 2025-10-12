# useExample Hook

Custom hook for fetching examples from API and auto-filling form fields.

## Usage

### Basic Usage (Graphical/Bisection/False-Position - xl, xr)

```jsx
import { useExample } from '../../hooks/useExample.js';
import { graphicalExample } from '../../numerical/examples/graphical_api.js';

const { handleExample, loading } = useExample(graphicalExample, {
  setErrorMsg,
  fields: {
    xl: setXl,
    xr: setXr,
    epsilon: setEpsilon,
    equation: setEquation
  }
});

// Use in button
<button onClick={handleExample}>Example</button>
```

### Newton-Raphson/One-Point (x0 only)

```jsx
import { newtonRaphsonExample } from '../../numerical/examples/newton_raphson_api.js';

const { handleExample } = useExample(newtonRaphsonExample, {
  setErrorMsg,
  fields: {
    x0: setX0,
    epsilon: setEpsilon,
    equation: setEquation
  }
});
```

### Secant Method (x0, x1)

```jsx
import { secantExample } from '../../numerical/examples/secant_api.js';

const { handleExample } = useExample(secantExample, {
  setErrorMsg,
  fields: {
    x0: setX0,
    x1: setX1,
    epsilon: setEpsilon,
    equation: setEquation
  }
});
```

## API

### Parameters

- `apiFunction`: Function that returns a promise with API response
- `setters`: Object containing:
  - `setErrorMsg`: Function to set error message
  - `fields`: Object mapping field names to setter functions
  - `customMapping` (optional): Custom field name mapping

### Returns

- `handleExample`: Function to trigger example fetch
- `loading`: Boolean indicating loading state

## Field Mapping

The hook automatically maps these API fields to state:

| API Field    | State Field |
|--------------|-------------|
| `xl`         | `xl`        |
| `xr`         | `xr`        |
| `x0`         | `x0`        |
| `x1`         | `x1`        |
| `tolerance`  | `epsilon`   |
| `equation`   | `equation`  |

## Benefits

✅ Reduces code duplication from ~17 lines to ~3 lines per component
✅ Reusable across all root-finding methods
✅ Centralized error handling
✅ Auto field mapping
✅ Optional loading state
