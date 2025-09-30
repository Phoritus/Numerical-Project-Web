import Dropdown from "./Dropdown";
import { createNavigatingRenderItem } from "../dropdown/renderers";

const DropLinearSystem = () => {
  
  const items = [
    {
      key: 'linear-system',
      label: 'Linear System',
      children: [
        { key: 'cramer', label: "Cramer's Rule" },
        { key: 'gaussian-elimination', label: 'Gaussian Elimination' },
        { key: 'gauss-jordan', label: 'Gauss-Jordan Elimination' },
        { key: 'matrix-inversion', label: 'Matrix Inversion Method' },
        { key: 'lu-decomposition', label: 'LU Decomposition' },
        { key: 'cholesky', label: 'Cholesky Decomposition' },
      ]
    }
  ]

  const routeMap = {
    cramer: '/linear-system/cramer',
    
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