import { HeadingNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { Klass, LexicalNode } from "lexical";

export const nodes: Klass<LexicalNode>[] = [HeadingNode, LinkNode];