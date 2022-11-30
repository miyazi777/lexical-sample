import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $insertNodes, $setSelection } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";

type Props = {
  initContent: string;
};

export const ImportHtmlPlugin = ({ initContent }: Props) => {
  const [editor] = useLexicalComposerContext();
  const calledOne = useRef(false);

  const importHtml = useCallback(() => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(initContent, "text/html");
    const nodes = $generateNodesFromDOM(editor, dom);
    $getRoot().select();
    $insertNodes(nodes);
  }, [editor, initContent]);

  useLayoutEffect(() => {
    if (calledOne.current) return;

    calledOne.current = true;
    editor.update(() => {
      importHtml();
    });
  }, [editor, importHtml]);

  return null;
};
