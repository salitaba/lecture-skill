import type { ResourceLinksComponent } from "@/lib/lecture-template/types";
import { Card } from "@/components/component-kit";

export function ResourceLinks({ component }: { component: ResourceLinksComponent }) {
  return (
    <Card altitude="quiet" label="Resources" title={component.title} className="resource-links">
      <ul>
        {component.links.map((link, index) => {
          const external = isExternalUrl(link.url);
          return (
            <li key={`${link.label}-${index}`}>
              <a href={link.url} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                {link.label}
              </a>
              {link.category ? <span className="resource-link-category">{link.category}</span> : null}
              {link.description ? <p>{link.description}</p> : null}
              <span className="resource-link-url">{resourceUrlLabel(link.url)}</span>
              <span className="resource-link-full-url">{link.url}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function isExternalUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}

function resourceUrlLabel(value: string): string {
  if (!isExternalUrl(value)) return value;
  try {
    return new URL(value).hostname;
  } catch {
    return value;
  }
}
