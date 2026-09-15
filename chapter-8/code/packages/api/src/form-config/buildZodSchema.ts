import { z } from "zod";
import { buildZodSchemaCore } from "@formforge/types";
import type { FieldConfig, FormConfig } from "@formforge/types";

// The server never sees a browser FileList — submitted values arrive as
// plain JSON — so a file field is accepted as-is here and only actually
// checked client-side (see packages/web's own file-field schema for the
// FileList-based version). Everything else comes from the shared core in
// @formforge/types.
function apiFileFieldSchema(field: FieldConfig, required: boolean): z.ZodType {
  return required ? z.any() : z.any().optional();
}

export function buildZodSchema(config: FormConfig): z.ZodObject {
  return buildZodSchemaCore(config, apiFileFieldSchema);
}
