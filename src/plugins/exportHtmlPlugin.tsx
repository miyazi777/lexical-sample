import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $insertNodes } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";

export const ExportHtmlPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = () => {
    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      console.log("htmlString", htmlString);
    });
  };

  return (
    <>
      <button onClick={handleOnClick}>出力テスト</button>
    </>
  );
};
