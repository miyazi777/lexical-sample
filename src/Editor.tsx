import { FC } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import styles from "./Editor.module.scss";
import { AutoFocusPlugin } from "./plugins/AutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

export const Editor: FC = () => {
  const initialConfig = {
    namespace: "MyEditor",
    onError: (error: Error) => console.error(error),
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={styles.editorContainer}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className={styles.contentEditable} />
          }
          placeholder={<div className={styles.placeholder}>Some enter</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <AutoFocusPlugin />
      <HistoryPlugin />
    </LexicalComposer>
  );
};
