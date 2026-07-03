import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LectureNavigation } from "../../src/components/lecture-kit/LectureNavigation";

describe("LectureNavigation", () => {
  it("renders only next and back links for the first lecture", () => {
    const html = renderToStaticMarkup(
      <LectureNavigation next={{ slug: "02-core-concepts", title: "Core Concepts For The Collection" }} />
    );

    expect(html).toContain('aria-label="Lecture navigation"');
    expect(html).toContain('class="lecture-nav"');
    expect(html).toContain('class="lecture-nav-inner"');
    expect(html).toContain('class="lecture-nav-link lecture-nav-back"');
    expect(html.match(/<a /g)).toHaveLength(2);
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/lectures/02-core-concepts"');
    expect(html).not.toContain('href="/lectures/01-introduction"');
  });

  it("renders previous, back, and next links for a middle lecture", () => {
    const html = renderToStaticMarkup(
      <LectureNavigation
        previous={{ slug: "01-introduction", title: "Opening The Collection" }}
        next={{ slug: "03-wrap-up", title: "Wrap Up" }}
      />
    );

    expect(html.match(/<a /g)).toHaveLength(3);
    expect(html).toContain('href="/lectures/01-introduction"');
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/lectures/03-wrap-up"');
    expect(html).toContain('class="lecture-nav-link lecture-nav-prev"');
    expect(html).toContain('class="lecture-nav-link lecture-nav-next"');
  });

  it("renders only previous and back links for the last lecture", () => {
    const html = renderToStaticMarkup(
      <LectureNavigation previous={{ slug: "02-core-concepts", title: "Core Concepts For The Collection" }} />
    );

    expect(html.match(/<a /g)).toHaveLength(2);
    expect(html).toContain('href="/lectures/02-core-concepts"');
    expect(html).toContain('href="/"');
    expect(html).not.toContain('href="/lectures/03-wrap-up"');
  });
});
