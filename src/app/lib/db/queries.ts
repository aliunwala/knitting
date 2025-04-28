import { db } from "./drizzle";
import { boards, todos } from "./schema";
import { eq, InferSelectModel } from "drizzle-orm";

export type Todo = InferSelectModel<typeof todos>;

export async function getTodos() {
  return db
    .select({
      id: todos.id,
      text: todos.text,
      createdAt: todos.createdAt,
      updatedAt: todos.updatedAt,
    })
    .from(todos);
}

export async function getBoards() {
  return db
    .select({
      id: boards.id,
      board: boards.board,
      createdAt: boards.createdAt,
      updatedAt: boards.updatedAt,
    })
    .from(boards);
}

export async function addBoard() {
  return db.insert(boards).values({ board: "test123" });
}

export async function deleteBoard() {
  return db.delete(boards).where(eq(boards.board, "test123"));
}

export async function updateBoard() {
  return db
    .update(boards)
    .set({ board: "testNameChange" + String(Math.random() * 100) })
    .where(eq(boards.board, "test123"));
}

async function x() {
  // console.log(await getBoards());
  // console.log(await addBoard());
  // console.log(await deleteBoard());
  // console.log(await updateBoard());

  console.log(await getBoards());
}

x();
