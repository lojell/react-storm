# react-storm

A simple React store management library.

## Getting started

```bash
npm i react-storm
```


## Usage Example

* define a store/model (e.g. `model.ts`)
```javascript
import { createModel } from "react-storm";

class TestVM {
  testNum = 3;

  public setTestNum(value: number) {
    this.testNum = value;
  }
}

const useTestVM = createModel(TestVM);

export default useTestVM;
```

* create your component (e.g. `Clicker.tsx`)
```javascript
import useTestVM from "./model";
import { useCallback } from "react";

const Clicker = () => {
  const { testNum, setTestNum } = useTestVM(
    ({ testNum, setTestNum }) => ({
        testNum,
        setTestNum
    })
  );

  const handleClick = useCallback(() => {
    setTestNum(testNum + 1);
  }, [setTestNum, testNum]);

  return (
    <>
      <code>{testNum}</code>
      <button onClick={handleClick}>+</button>
    </>
  );
};

export default Clicker;
```
* Use your component
```javascript
import "./styles.css";
import Clicker from "./clicker";

export default function App() {
  return (
    <div className="App">
        <Clicker />
        <Clicker />
    </div>
  );
}
```
