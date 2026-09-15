import { useFormConfig } from "./hooks/useFormConfig";
import { DynamicForm }   from "./components/DynamicForm/DynamicForm";

export default function App() {
  // Hard-coded here for simplicity; a real app would take this from
  // the route (e.g. /forms/:formId) using a router of your choice.
  const formId = "registration";
  const { data: config, isLoading, error } = useFormConfig(formId);
  if (isLoading) return <p className="p-8">Loading form…</p>;
  if (error || !config) return <p className="p-8 text-destructive">Could not load form.</p>;
  return (
    <div className="max-w-2xl mx-auto p-8">
      <DynamicForm config={config} />
    </div>
  );
}
