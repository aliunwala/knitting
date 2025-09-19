"use client";
import Board from "./components/board";
export default function Home() {
  // console.log(getBoards());
  return (
    <>
      <div className="m-6">
        {/* <div>{getBoards()}</div> */}

        <Board></Board>
      </div>
    </>
  );
}
