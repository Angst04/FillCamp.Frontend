import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "1gnveoao",
  dataset: "production",
  apiVersion: "2025-12-05",
  useCdn: false
});
