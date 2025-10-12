import { useState } from 'react';

/**
 * Custom hook for fetching examples from API
 * @param {Function} apiFunction - The API function to call (e.g., graphicalExample, bisectionExample)
 * @param {Object} setters - Object containing state setters
 * @param {Function} setters.setErrorMsg - Error message setter
 * @param {Object} setters.fields - Field setters mapping (e.g., { xl: setXl, xr: setXr })
 * @param {Object} setters.ref - Optional ref for class components
 * @returns {Object} - { handleExample, loading }
 */
export const useExample = (apiFunction, setters) => {
  const [loading, setLoading] = useState(false);
  const componentRef = setters.ref;

  const handleExample = () => {
    const id = Math.floor(Math.random() * 5) + 1;
    setLoading(true);
    
    apiFunction(id)
      .then(response => {
        if (response.success && response.data && response.data.length > 0) {
          const example = response.data[0];
          
          // Map API fields to state setters
          const fieldMapping = {
            xl: 'xl',
            xr: 'xr',
            x0: 'x0',
            x1: 'x1',
            tolerance: 'epsilon',
            equation: 'equation',
            ...setters.customMapping // Allow custom field mapping
          };

          // Set all fields
          Object.keys(setters.fields).forEach(field => {
            const apiField = Object.keys(fieldMapping).find(
              key => fieldMapping[key] === field
            ) || field;
            
            if (example[apiField] !== undefined) {
              // If ref is provided (class component), use it
              if (componentRef?.current) {
                if (field === 'matrixSize' && componentRef.current.handleMatrixSizeChange) {
                  componentRef.current.handleMatrixSizeChange(example[apiField]);
                } else if (componentRef.current.setState) {
                  componentRef.current.setState({ [field]: example[apiField] });
                }
              } 
              // Otherwise use the setter function
              else if (setters.fields[field]) {
                setters.fields[field](example[apiField]);
              }
            }
          });

          if (setters.setErrorMsg) {
            setters.setErrorMsg(null);
          }
        } else {
          if (setters.setErrorMsg) {
            setters.setErrorMsg('No example found');
          }
        }
      })
      .catch(err => {
        if (setters.setErrorMsg) {
          setters.setErrorMsg('Error fetching example: ' + err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { handleExample, loading };
};
