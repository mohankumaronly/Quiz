import { db } from "./db";

const KEY = "notepad";

export async function loadNotepad(): Promise<string> {
  const row = await db.kv.get(KEY);
  return typeof row?.value === "string" ? row.value : "";
}

export async function saveNotepad(text: string): Promise<void> {
  await db.kv.put({ key: KEY, value: text });
}

export async function clearNotepad(): Promise<void> {
  await db.kv.delete(KEY);
}