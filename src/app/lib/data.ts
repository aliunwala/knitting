"use server";
import { version } from "os";
import { db } from "./db/drizzle";
import { boards, todos, Boards, Todos } from "./db/schema";
import { and, desc, eq, InferSelectModel, max, sql } from "drizzle-orm";

// export type Todo = InferSelectModel<typeof todos>;

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

export async function getBoard(passkeyToLoad: string) {
  // SELECT column FROM table
  // ORDER BY RAND()
  // LIMIT 1
  return (
    db
      .select({
        board: boards.board,
      })
      .from(boards)
      .where(eq(boards.passkey, passkeyToLoad))
      .orderBy(desc(boards.version)) // To get the latest version
      // .orderBy(sql<Boards>`RANDOM()`) // Random Ordering
      .limit(1)
  ); // Get latest versioned board
}

export async function addBoard(
  savedBoard: string,
  // boardName: string,
  passkey: string
) {
  // Logic for getting max version number:
  // SELECT version FROM boards WHERE passkey="passkey" // TODO always scrub data to not get SQL injected
  // SELECT MAX(version) FROM boards WHERE passkey='c'
  //[
  //   {
  //     "max": 3
  //   }
  // ]
  // max === null if not found
  let versionResp = await db
    .select({ version: max(boards.version) })
    .from(boards)
    .where(eq(boards.passkey, passkey));

  let versionToAdd = 0;
  if (versionResp[0] != undefined) {
    // Check if we got an valid reponse obj
    if (versionResp[0].version != null) {
      // Check if we have a valid version number
      versionToAdd = versionResp[0].version + 1;
    }
  }
  // console.log(versionToAdd);

  // Logic for inserting new board with version number into DB:
  // INSERT INTO boards (board,passkey,version) VALUES ("savedBoard", "passkey",  )
  // INSERT INTO boards (board, passkey, version) VALUES ('testBoard','c',3)
  // {  "status": "success"}
  let serverResp = await db
    .insert(boards)
    .values({ board: savedBoard, passkey: passkey, version: versionToAdd });

  return JSON.stringify(serverResp);
}

export async function deleteBoard(passkey: string) {
  //get latest version with specified passkey
  let versionResp = await db
    .select({ version: max(boards.version) })
    .from(boards)
    .where(eq(boards.passkey, passkey));

  // Deal with the case version could be null
  let myVersion = 0;
  if (versionResp[0].version != null) {
    myVersion = versionResp[0].version;
  }

  let serverReps = db
    .delete(boards)
    .where(and(eq(boards.version, myVersion), eq(boards.passkey, passkey)));

  return JSON.stringify(serverReps);
}

export async function updateBoard(passkey: string) {
  return db
    .update(boards)
    .set({ board: "testNameChange" + String(Math.random() * 100) })
    .where(eq(boards.board, "test123"));
}

//INSERT INTO boards(board,passkey,version)
//VALUES ('2q3423', 'c', 2);

//SELECT MAX(version) FROM boards WHERE passkey='c'
