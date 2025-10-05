import Dropdown from "./Dropdown";
import { createNavigatingRenderItem } from "../dropdown/renderers";

const DropLinearSystem = () => {
  
  const items = [
    {
      key: 'linear-system',
      label: 'Linear System',
      children: [
        { key: 'cramer', label: "Cramer's Rule" },
        { key: 'gaussian_elimination', label: 'Gaussian Elimination' },
        { key: 'gauss_jordan', label: 'Gauss-Jordan Elimination' },
        { key: 'matrix_inversion', label: 'Matrix Inversion Method' },
        { key: 'lu_decomposition', label: 'LU Decomposition' },
        { key: 'cholesky', label: 'Cholesky Decomposition' },
      ]
    }
  ]

  const routeMap = {
    cramer: '/linear-system/cramer',
    gaussian_elimination: '/linear-system/guass-elimination',
    gauss_jordan: '/linear-system/gauss-jordan',
    matrix_inversion: '/linear-system/matrix-inversion',
    lu_decomposition: '/linear-system/lu-decomposition',
    cholesky: '/linear-system/cholesky',
    
  }
  const enhancedRenderItem = createNavigatingRenderItem({ routeMap, useLink: true });

  return (
    <Dropdown
      items={items}
      renderItem={enhancedRenderItem}
    />
  );

}

export default DropLinearSystem;