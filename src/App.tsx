import React, { useEffect, useState } from "react";
import { Editor } from "./Editor";
import Tooltip from "./Tooltip";
import { createPortal } from "react-dom";

const Test = () => {
  return createPortal(<div>portal test</div>, document.body);
};

const Test2 = () => {
  return <div>portal test2</div>;
};

function App() {
  const [show, setShow] = useState(false);

  return (
    <div className="App">
      <Editor />
      <div>
        <Tooltip></Tooltip>
      </div>
      <Test></Test>
      <button onClick={() => setShow(!show)}>show</button>
      {show && createPortal(<Test2></Test2>, document.body)}
      <Editor />
    </div>
  );
}

export default App;
