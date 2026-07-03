import { CollectionLanding } from "@/components/lecture-kit/CollectionLanding";
import { PageShell } from "@/components/lecture-kit/PageShell";
import { LecturePage } from "@/components/lecture-kit/LecturePage";
import { ValidationScreen } from "@/components/lecture-kit/ValidationScreen";
import { isCollectionMode, validateCollection } from "@/lib/lecture-template/collection";
import { ACTIVE_TEMPLATE_PATH, readActiveTemplate } from "@/lib/lecture-template/readTemplate";
import { validateTemplateSource } from "@/lib/lecture-template/validateTemplate";

export default async function Home() {
  if (await isCollectionMode()) {
    const validation = await validateCollection();

    return (
      <PageShell>
        <CollectionLanding validation={validation} />
      </PageShell>
    );
  }

  const source = await readActiveTemplate();
  const result = validateTemplateSource(source);

  if (!result.valid) {
    return <ValidationScreen errors={result.errors} templatePath={ACTIVE_TEMPLATE_PATH} />;
  }

  return <LecturePage lecture={result.template} templatePath={ACTIVE_TEMPLATE_PATH} />;
}
