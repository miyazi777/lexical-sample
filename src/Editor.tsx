import { FC } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import styles from "./Editor.module.scss";
import { AutoFocusPlugin } from "./plugins/AutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { nodes } from "./nodes";
import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import { theme } from "./editorTheme";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ImportHtmlPlugin } from "./plugins/ImportHtmlPlugin";

export const Editor: FC = () => {
  const initialConfig = {
    namespace: "MyEditor",
    onError: (error: Error) => console.error(error),
    nodes: nodes,
    theme: theme,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      <div className={styles.editorContainer}>
        <ImportHtmlPlugin
          initContent={'test<a href="https://yahoo.co.jp">testlink</a>xxx'}
        />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={styles.contentEditable}
              id="content-editor"
            />
          }
          placeholder={<div className={styles.placeholder}>Some enter</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <AutoFocusPlugin />
      <HistoryPlugin />
      <LinkPlugin />
    </LexicalComposer>
  );
};
