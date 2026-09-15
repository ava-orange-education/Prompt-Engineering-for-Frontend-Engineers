import { describe, it, expect, vi } from "vitest";
import { render, screen }       from "@testing-library/react";
import userEvent                from "@testing-library/user-event";
import { DynamicForm }          from "./DynamicForm";
import type { FormConfig }       from "@formforge/types";

// DynamicForm calls submitForm from ../../api/client (see "Wiring Up the Frontend Entry Point"), which
// makes a real axios request. Mock it so "submits successfully" resolves
// instantly and never depends on a server actually running during tests.
vi.mock("../../api/client", () => ({
  submitForm: vi.fn().mockResolvedValue({ success: true }),
}));

const testConfig: FormConfig = {
  formId: "test", title: "Test Form", submitLabel: "Save", successMessage: "Saved!",
  sections: [{ id: "s1", fields: [
    { name:"fullName", type:"text",  label:"Full Name", validation:{required:true} },
    { name:"email",    type:"email", label:"Email",     validation:{required:true,email:true} },
  ]}],
};

function renderForm() {
  render(<DynamicForm config={testConfig} />);
}

describe("DynamicForm", () => {
  it("renders form title", () => {
    renderForm();
    expect(screen.getByRole("heading",{name:/test form/i})).toBeInTheDocument();
  });
  it("shows errors when submitted empty", async () => {
    const user = userEvent.setup(); renderForm();
    await user.click(screen.getByRole("button",{name:/save/i}));
    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
  });
  it("submits successfully with valid data", async () => {
    const user = userEvent.setup(); renderForm();
    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.click(screen.getByRole("button",{name:/save/i}));
    expect(await screen.findByRole("alert")).toHaveTextContent("Saved!");
  });
});
