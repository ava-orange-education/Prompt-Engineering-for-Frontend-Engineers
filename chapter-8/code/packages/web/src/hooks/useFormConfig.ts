import { useQuery }       from "@tanstack/react-query";
import { fetchFormConfig }  from "../api/client";
import type { FormConfig }  from "@formforge/types";

export function useFormConfig(formId: string) {
  return useQuery<FormConfig, Error>({
    queryKey: ["formConfig", formId],
    queryFn:  () => fetchFormConfig(formId),
    staleTime: 5 * 60 * 1000,
  });
}
