import NavbarMain from "./Navbar";
import { InputNumber } from "antd";
import { BiReset } from "react-icons/bi";
import Spinner from "./Spinner";

class TestMatrixComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxtrixSize: 3,
      matrixA: this.buildEmptyMatrix(3),
      vecotrB: this.bulidEmptyVector(3),
      solution: null,
      formVersion: 0,
      isCalculation: false
    }

    buildEmptyMatrix = (n) => Array.from({ length: n}, () => Array.from({ length: n}, () => null));
    buildEmptyVector = (n) => Array.from({ length: n}, () => null);

    handleMatrixSizeChange = (value) => {
      const newSize = value || 3;
      this.setState(prev => ({
        maxtrixSize: newSize,
        matrixA: Array.from({ length: newSize}, (_, i) => 
          Array.from({ length: newSize}, (_, j) => (prev.matrixA[i] && prev.matrixA[i][j] != null ? prev.matrixA[i][j]:null))),
        vectorB: Array.from({ length: newSize}, (_, i) => (prev.vectorB[i] != null ? prev.vectorB[i]:null))
      }))
    }

    updateMatrixA = (i, j, value) => {
      this.setState(prev => ({
        matrixA: prev.matrixA.map((row, r) => r === i ? row.map((c, cIdx) => cIdx === j ? (value ?? null) : c) : row)

      }))
    }

    updateVectorB = (i, value) => {
      this.setState(prev => ({
        vectorB: prev.vectorB.map((v, idx) => idx === i ? (value ?? null) : v)
      }))
    }

    handleReset = () => {
      this.setState(prev => ({
        matrixA: this.buildEmptyMatrix(prev.matrixA),
        vectorB: this.bulidEmptyVector(prev.vectorB),
        soulution: null,
        formVersion: prev.formVersion + 1
      }))
    }
  }
}