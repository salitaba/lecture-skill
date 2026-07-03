import type { CodeBlockComponent } from "@/lib/lecture-template/types";

type Props = { language: string; code: string } | { component: CodeBlockComponent };

export function CodeBlock(props: Props) {
  const language = "component" in props ? props.component.language : props.language;
  const code = "component" in props ? props.component.code : props.code;

  return (
    <figure className="lecture-component code-block">
      <figcaption>
        <span>Code example</span>
        <span>{language || "text"}</span>
      </figcaption>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
