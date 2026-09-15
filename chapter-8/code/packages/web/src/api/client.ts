import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/api" });

export async function fetchFormConfig(formId: string) {
  const { data } = await api.get(`/forms/${formId}`);
  return data;
}

export async function submitForm(formId: string, payload: unknown) {
  const { data } = await api.post(`/forms/${formId}/submit`, { data: payload });
  return data;
}
