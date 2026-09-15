Generate a FormConfigController and FormConfigService for the FormForge
NestJS backend.
 
Behavior:
 
  - GET /api/forms
    Reads every *.json file in configs/ at the project root, parses each
    as a FormConfig, and returns an array of { formId, title, description }
    -- the summary shape FormList consumes, not the full config.
 
  - GET /api/forms/:formId
    Reads configs/{formId}.json and returns it in full. Responds 404 with
    { message: string } if no matching file exists.
 
  - POST /api/forms/:formId/submit
    Accepts the submitted values as JSON. For this chapter, log and
    acknowledge receipt (echo the payload with 200 { received: true });
    persisting submissions is out of scope. Responds 404 with the same
    shape as the GET route if formId doesn't match a config.
 
  - All three routes read from disk on every request -- no caching layer yet,
    consistent with configs/ being hand-edited and regenerated throughout
    this chapter.
 
  - Reuse the FormConfig interface already established in
    prompts/system-context.md; do not redeclare it.
 
Enable CORS for the Vite dev server origin during development.
 
Use Nest 12 patterns: constructor injection, and class-validator DTOs on the POST /api/forms/:formId/submit body — the FormConfig JSON itself  is already 
schema-validated before it reaches configs/, but that guarantees nothing about what a client submits at runtime, which still needs its own validation.
