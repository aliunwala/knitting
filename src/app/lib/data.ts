"use server";
import { db } from "./db/drizzle";
import { boards, todos } from "./db/schema";
import { eq, InferSelectModel, sql } from "drizzle-orm";

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

export async function getRandomBoard() {
  // SELECT column FROM table
  // ORDER BY RAND()
  // LIMIT 1
  return db
    .select({
      id: boards.id,
      board: boards.board,
      createdAt: boards.createdAt,
      updatedAt: boards.updatedAt,
    })
    .from(boards)
    .orderBy(sql`RANDOM()`)
    .limit(1);
}

export async function addBoard(savedBoard: string) {
  return db.insert(boards).values({ board: savedBoard });
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
