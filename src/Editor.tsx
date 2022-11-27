import { FC } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

export const Editor: FC = () => {
  const initialConfig = {
    namespace: "MyEditor",
    onError: (error: Error) => console.error(error),
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Some enter</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
};
