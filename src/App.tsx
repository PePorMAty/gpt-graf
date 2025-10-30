import { ReactFlowProvider } from "@xyflow/react";

import { Flow } from "./Flow";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.flow_container}>
      <div className={styles.flow_border}>
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;
