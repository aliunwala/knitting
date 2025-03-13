"use client";
import { useState, useCallback } from "react";
import Board from "./components/board";
import Column from "./components/column";
export default function Home() {
  return (
    <>
      <div className="m-6">
        <Board></Board>
      </div>
    </>
  );
}
