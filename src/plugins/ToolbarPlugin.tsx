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
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createCommand,
  LexicalCommand,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  LexicalEditor,
  NodeSelection,
  GridSelection,
} from "lexical";
import {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./ToolbarPlugin.module.scss";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isAtNodeEnd } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import { createPortal } from "react-dom";

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
  const [url, setUrl] = useState("");

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

  // 指定されたselectionから該当するnodeを取得する
  function getSelectedNode(selection: RangeSelection) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
      return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
      return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
      return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
    }
  }

  const updatePopup = useCallback(() => {
    const selection = $getSelection();
    // 選択されているのが範囲指定かどうかの判定
    if ($isRangeSelection(selection)) {
      // 該当するnodeを取得
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        console.log(parent.getURL());
        setUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        console.log(node.getURL());
        setUrl(node.getURL());
      } else {
        console.log("not link node");
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      // 範囲選択イベント
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updatePopup();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      // クリックイベント
      editor.registerCommand(
        CLICK_COMMAND,
        () => {
          updatePopup();
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updatePopup]);

  // リンク登録
  const updateLink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  }, [editor, url]);

  // エディタ
  const [show, setShow] = useState(false);

  // ツールバーの表示
  return (
    <>
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
        <button
          type="button"
          role="checkbox"
          title={SupportedBlockType["h3"]}
          aria-label={SupportedBlockType["h3"]}
          aria-checked={blockType === "h3"}
          onClick={() => updateLink()}
        >
          <div>LK</div>
        </button>
        <button
          type="button"
          role="checkbox"
          title={SupportedBlockType["h3"]}
          aria-label={SupportedBlockType["h3"]}
          aria-checked={blockType === "h3"}
          onClick={() => setShow(true)}
        >
          <div>MD</div>
        </button>
        <div className={styles.urlArea}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
              }
            }}
          ></input>
        </div>
      </div>
      {show &&
        createPortal(
          <FloatingEditor editor={editor}></FloatingEditor>,
          document.body
        )}
    </>
  );
};

function positionEditorElement(editor: HTMLElement, rect: ClientRect | null) {
  if (rect === null) {
    editor.style.opacity = "0";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

type FloatingEditorProps = {
  editor: LexicalEditor;
};

function FloatingEditor({ editor }: FloatingEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }

    // 範囲指定しているnodeのelementを取得
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;
    if (editorElem === null) {
      return;
    }
    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        1
      )
    );
  }, [editor, updateLinkEditor]);

  return (
    <div ref={editorRef} className={styles.testEditorContainer}>
      <div className={styles.testEditorContent}>editor test</div>
    </div>
  );
}

function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}
