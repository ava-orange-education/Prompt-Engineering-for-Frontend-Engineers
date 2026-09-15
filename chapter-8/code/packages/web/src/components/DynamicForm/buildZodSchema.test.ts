import { describe, it, expect } from "vitest";
import { buildZodSchema }       from "./buildZodSchema";
import type { FormConfig }       from "@formforge/types";

const minConfig = (fields: any[]): FormConfig => ({
  formId: "test", title: "Test", sections: [{ id: "s1", fields }]
});

describe("required string fields", () => {
  const schema = buildZodSchema(minConfig([{
    name:"username", type:"text", label:"Username",
    validation:{ required:true, minLength:3, maxLength:20 }
  }]));
  it("rejects empty",  () => expect(schema.safeParse({username:""}).success).toBe(false));
  it("rejects short",  () => expect(schema.safeParse({username:"ab"}).success).toBe(false));
  it("accepts valid",  () => expect(schema.safeParse({username:"jane"}).success).toBe(true));
});

describe("required checkbox", () => {
  const schema = buildZodSchema(minConfig([{
    name:"terms", type:"checkbox", label:"Accept",
    validation:{ required:true }
  }]));
  it("rejects false", () => expect(schema.safeParse({terms:false}).success).toBe(false));
  it("accepts true",  () => expect(schema.safeParse({terms:true}).success).toBe(true));
});
