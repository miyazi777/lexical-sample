import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  HeadingTagType,
  $createHeadingNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $wrapNodes } from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  createCommand,
  LexicalCommand,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { FC, MutableRefObject, useCallback, useEffect, useState } from "react";
import styles from "./ToolbarPlugin.module.scss";

const SupportedBlockType = {
  paragraph: "Paragraph",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
} as const;
type BlockType = keyof typeof SupportedBlockType;

export const HELLO_WORLD_COMMAND: LexicalCommand<void> = createCommand();

export const ToolbarPlugin = () => {
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [editor] = useLexicalComposerContext(); // lexical editorインスタンスを取得

  // heading nodeの追加
  const formatHeading = useCallback(
    (type: HeadingTagType) => {
      if (blockType !== type) {
        // editorの状態を更新するメソッド
        editor.update(() => {
          const selection = $getSelection(); // 現在の選択状態取得
          // 選択状態が範囲選択か、を判定
          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createHeadingNode(type)); // heading nodeを作成し、既存nodeをラップした形にする
          }
        });
      }
    },
    [blockType, editor]
  );

  // ツールバーがアクティブになるようにする
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchorNode = selection.anchor.getNode();
        const targetNode =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();

        if ($isHeadingNode(targetNode)) {
          const tag = targetNode.getTag();
          setBlockType(tag);
        } else {
          const nodeType = targetNode.getType();
          if (nodeType in SupportedBlockType) {
            setBlockType(nodeType as BlockType);
          } else {
            setBlockType("paragraph");
          }
        }
      });
    });
  }, [editor]);

  const updatePopup = useCallback(() => {
    console.log("event1");
  }, []);

  // 範囲選択イベントの拾い方
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updatePopup();
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, updatePopup]);

  // クリックイベントの拾いかた
  //useEffect(() => {
  //  return editor.registerRootListener(
  //    (
  //      rootElement: null | HTMLElement,
  //      prevRootElement: null | HTMLElement
  //    ) => {
  //      if (prevRootElement !== null) {
  //        prevRootElement.removeEventListener("click", () => {
  //          console.log("root click");
  //        });
  //      }

  //      if (rootElement !== null) {
  //        rootElement.addEventListener("click", () => {
  //          console.log("root click");
  //        });
  //      }
  //    }
  //  );
  //});

  // ツールバーの表示
  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType["h1"]}
        aria-label={SupportedBlockType["h1"]}
        aria-checked={blockType === "h1"}
        onClick={() => formatHeading("h1")} // ボタンがクリックされたらフォーマット開始
      >
        <div>H1</div>
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType["h2"]}
        aria-label={SupportedBlockType["h2"]}
        aria-checked={blockType === "h2"}
        onClick={() => formatHeading("h2")}
      >
        <div>H2</div>
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType["h3"]}
        aria-label={SupportedBlockType["h3"]}
        aria-checked={blockType === "h3"}
        onClick={() => formatHeading("h3")}
      >
        <div>H3</div>
      </button>
    </div>
  );
};
