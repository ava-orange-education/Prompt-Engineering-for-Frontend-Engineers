import type { SectionConfig } from "@formforge/types";
import { FieldRenderer }      from "../fields/FieldRenderer";

export function SectionRenderer({ section }: { section: SectionConfig }) {
  return (
    <section className="mb-8">
      {section.title && (
        <h2 className="text-lg font-semibold mb-1">{section.title}</h2>
      )}
      {section.description && (
        <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
      )}
      <div className="grid grid-cols-12 gap-x-4 gap-y-5">
        {section.fields.map(field => (
          <FieldRenderer key={field.name} field={field} />
        ))}
      </div>
    </section>
  );
}
