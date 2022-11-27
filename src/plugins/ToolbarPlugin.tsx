import { FC, useState } from "react";
import styles from "./ToolbarPlugin.module.scss";

const SupportedBlockType = {
  paragraph: "Paragraph",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  quote: "Quote",
  number: "Numbered List",
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
} as const;
type BlockType = keyof typeof SupportedBlockType;

export const ToolbarPlugin: FC = () => {
  const [blockType, setBlockType] = useState<BlockType>("paragraph");

  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType["h1"]}
        aria-label={SupportedBlockType["h1"]}
        aria-checked={blockType === "h1"}
      >
        <div>H1</div>
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType["h2"]}
        aria-label={SupportedBlockType["h2"]}
        aria-checked={blockType === "h2"}
      >
        <div>H2</div>
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType["h3"]}
        aria-label={SupportedBlockType["h3"]}
        aria-checked={blockType === "h3"}
      >
        <div>H3</div>
      </button>
    </div>
  );
};
