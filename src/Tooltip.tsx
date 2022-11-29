import { useState } from "react";
import "./Tooltip.css";

const Tooltip = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="container">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        tooltip test
      </div>
      {show && <div className="right">tooltip test content</div>}
    </div>
  );
};

export default Tooltip;
