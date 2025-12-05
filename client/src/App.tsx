import { ReactFlowProvider } from "@xyflow/react";

import { Flow } from "./Flow";
import styles from "./styles/App.module.css";
import { RequestPanel } from "./components/request-panel/RequestPanel";

function App() {
  return (
    <div className={styles.app_container}>
      <div className={styles.flow_container}>
        <div className={styles.flow_border}>
          <ReactFlowProvider>
            <Flow />
          </ReactFlowProvider>
        </div>
      </div>
      <RequestPanel />
    </div>
  );
}

export default App;
