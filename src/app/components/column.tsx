import { memo } from "react";

function Column({ player, onClick }: any) {
  console.log(`Render player ${player.name}`);
  return (
    <tr>
      <td>{player.name}</td>
      <td>{player.age}</td>
      <td>{player.team}</td>
      <button onClick={() => onClick(player)}>Delete</button>
    </tr>
  );
}

export default memo(Column);
