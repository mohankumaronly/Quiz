import { db } from "./db";

export async function toggleBookmark(questionId: string): Promise<boolean> {
  const existing = await db.bookmarks.get(questionId);
  if (existing) {
    await db.bookmarks.delete(questionId);
    return false;
  }
  await db.bookmarks.put({ id: questionId, addedAt: Date.now() });
  return true;
}

export async function isBookmarked(questionId: string): Promise<boolean> {
  const b = await db.bookmarks.get(questionId);
  return !!b;
}

export async function getAllBookmarkIds(): Promise<string[]> {
  const all = await db.bookmarks.toArray();
  return all.map((b) => b.id);
}

export async function clearAllBookmarks(): Promise<void> {
  await db.bookmarks.clear();
}