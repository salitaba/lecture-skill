"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Highlight } from "@/lib/lecture-template/progress";
import { useAnnotationsOptional } from "./AnnotationsProvider";

interface PendingSelection {
  blockIndex: number;
  start: number;
  end: number;
  snippet: string;
  top: number;
  left: number;
}

const excludedBlockClassName = "lecture-component";
const highlightAttribute = "data-highlight-id";

export function HighlightableContent({ anchor, children, className }: { anchor: string; children: ReactNode; className?: string }) {
  const annotations = useAnnotationsOptional();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState<PendingSelection | null>(null);

  useEffect(() => {
    function handleSelectionChange() {
      const container = containerRef.current;
      const selection = window.getSelection();
      if (!container || !selection || selection.isCollapsed || selection.rangeCount === 0) {
        setPending(null);
        return;
      }

      const range = selection.getRangeAt(0);
      if (!container.contains(range.commonAncestorContainer)) {
        setPending(null);
        return;
      }

      const blocks = Array.from(container.children).filter((el) => el.tagName !== "BUTTON") as HTMLElement[];
      const blockIndex = blocks.findIndex((block) => block.contains(range.commonAncestorContainer));
      const block = blocks[blockIndex];
      if (blockIndex === -1 || !block || block.classList.contains(excludedBlockClassName)) {
        setPending(null);
        return;
      }

      const text = selection.toString();
      if (text.trim() === "") {
        setPending(null);
        return;
      }

      const preRange = document.createRange();
      preRange.selectNodeContents(block);
      preRange.setEnd(range.startContainer, range.startOffset);
      const start = preRange.toString().length;
      const end = start + text.length;

      const rect = typeof range.getBoundingClientRect === "function" ? range.getBoundingClientRect() : { top: 0, left: 0 };
      setPending({
        blockIndex,
        start,
        end,
        snippet: text.slice(0, 80),
        top: rect.top - 40,
        left: rect.left
      });
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !annotations) return undefined;

    function activate(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return;
      const mark = target.closest(`mark[${highlightAttribute}]`);
      const id = mark?.getAttribute(highlightAttribute);
      if (id) annotations?.removeHighlight(id);
    }

    function handleClick(event: MouseEvent) {
      activate(event.target);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target as HTMLElement | null;
      if (!target?.closest(`mark[${highlightAttribute}]`)) return;
      event.preventDefault();
      activate(target);
    }

    container.addEventListener("click", handleClick);
    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [annotations]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const sectionHighlights = (annotations?.highlights ?? []).filter((highlight) => highlight.sectionAnchor === anchor);
    applyHighlights(container, sectionHighlights);
  }, [annotations?.highlights, anchor]);

  const addHighlight = () => {
    if (!pending || !annotations) return;
    annotations.addHighlight({
      sectionAnchor: anchor,
      blockIndex: pending.blockIndex,
      start: pending.start,
      end: pending.end,
      snippet: pending.snippet
    });
    window.getSelection()?.removeAllRanges();
    setPending(null);
  };

  return (
    <div className={["highlightable-content", className].filter(Boolean).join(" ")} ref={containerRef}>
      {children}
      {pending && annotations ? (
        <button
          type="button"
          className="highlight-action-button"
          style={{ top: pending.top, left: pending.left }}
          onClick={addHighlight}
        >
          Highlight
        </button>
      ) : null}
    </div>
  );
}

function applyHighlights(container: HTMLElement, highlights: Highlight[]) {
  container.querySelectorAll(`mark[${highlightAttribute}]`).forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    parent.normalize();
  });

  const blocks = Array.from(container.children).filter((el) => el.tagName !== "BUTTON") as HTMLElement[];

  for (const highlight of highlights) {
    const block = blocks[highlight.blockIndex];
    if (!block || block.classList.contains(excludedBlockClassName)) continue;

    const currentText = block.textContent ?? "";
    if (currentText.slice(highlight.start, highlight.end) !== highlight.snippet) continue;

    const range = findRangeForOffsets(block, highlight.start, highlight.end);
    if (!range) continue;

    try {
      const mark = document.createElement("mark");
      mark.className = "learner-highlight";
      mark.setAttribute(highlightAttribute, highlight.id);
      mark.setAttribute("role", "button");
      mark.setAttribute("tabindex", "0");
      mark.setAttribute("aria-label", "Remove highlight");
      mark.title = "Highlighted — press Enter or click to remove";
      range.surroundContents(mark);
    } catch {
      // Range crosses an inline element boundary (e.g. a nested <strong> or <a>);
      // drop this highlight rather than render it against the wrong text.
    }
  }
}

function findRangeForOffsets(block: HTMLElement, start: number, end: number): Range | null {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  let index = 0;
  let startNode: Text | null = null;
  let startOffset = 0;
  let endNode: Text | null = null;
  let endOffset = 0;

  let node = walker.nextNode() as Text | null;
  while (node) {
    const length = node.textContent?.length ?? 0;
    if (startNode === null && index + length >= start) {
      startNode = node;
      startOffset = start - index;
    }
    if (endNode === null && index + length >= end) {
      endNode = node;
      endOffset = end - index;
    }
    if (startNode && endNode) break;
    index += length;
    node = walker.nextNode() as Text | null;
  }

  if (!startNode || !endNode) return null;

  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  return range;
}
