import { useState }                           from "react";
import { useForm, FormProvider }              from "react-hook-form";
import { standardSchemaResolver }             from "@hookform/resolvers/standard-schema";
import type { FormConfig }                    from "@formforge/types";
import { buildZodSchema, buildDefaultValues } from "./buildZodSchema";
import { SectionRenderer }                    from "./SectionRenderer";
import { Button }                             from "@/components/ui/button";
import { submitForm }                         from "../../api/client";

interface Props {
  config: FormConfig;
  onSuccess?: () => void;
}

export function DynamicForm({ config, onSuccess }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setError]   = useState<string | null>(null);
  // React Compiler handles memoisation automatically
  const zodSchema = buildZodSchema(config);
  const methods = useForm({
    resolver:      standardSchemaResolver(zodSchema),
    mode:          "onTouched",
    defaultValues: buildDefaultValues(config),
  });
  const { handleSubmit, setError: setFieldError, formState: { isSubmitting } } = methods;

  async function onSubmit(data: Record<string, unknown>) {
    setError(null);
    try {
      await submitForm(config.formId, data);
      setSubmitted(true);
      onSuccess?.();
    } catch (err: any) {
      const fieldErrors = err?.response?.data?.errors as
        { path: string; message: string }[] | undefined;
      if (fieldErrors?.length) {
        fieldErrors.forEach(({ path, message }) =>
          setFieldError(path as any, { type: "server", message })
        );
      } else {
        setError(err?.message ?? "Submission failed.");
      }
    }
  }

  if (submitted) return <div role="alert">{config.successMessage ?? "Submitted!"}</div>;
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label={config.title}>
        <h1 className="text-2xl font-bold mb-2">{config.title}</h1>
        {config.description && <p className="text-muted-foreground mb-6">{config.description}</p>}
        {config.sections.map(s => <SectionRenderer key={s.id} section={s} />)}
        {serverError && <p role="alert" className="text-destructive text-sm">{serverError}</p>}
        <Button type="submit" disabled={isSubmitting} className="mt-4">
          {isSubmitting ? "Submitting..." : (config.submitLabel ?? "Submit")}
        </Button>
      </form>
    </FormProvider>
  );
}
