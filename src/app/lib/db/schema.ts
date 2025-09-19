import { InferSelectModel } from "drizzle-orm";
import {
  text,
  pgTable,
  varchar,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { blob } from "stream/consumers";
export type Boards = InferSelectModel<typeof boards>;
export type Todos = InferSelectModel<typeof todos>;

export const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  text: varchar("text", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const boards = pgTable("boards", {
  id: uuid("id").defaultRandom().primaryKey(), // UUID
  // boardID: uuid("id").defaultRandom().primaryKey(), //  Do not expose to user, should be autoincrmenting (bigserial type probably), used for paginiation
  board: text("board").notNull(),
  // board: blob("board").notNull(), // TODO make into blob or break up the JSON into key/val pairs
  passkey: text("passkey").notNull(),
  version: integer("version").notNull(), // TODO make a seprate verioning table. //
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // updatedBy: //who updated it? Which app version did the last update to this board. Helps you know what version was problematic. use git commit sha?
});

// TODO make user table and link to board table
// TODO board history/audit table so you can get old versions of boards -
// TODO table for versions
