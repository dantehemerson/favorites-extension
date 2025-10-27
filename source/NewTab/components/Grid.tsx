import React, { FC, useState } from "react";
import { ReactSortable } from "react-sortablejs";

interface ItemType {
  id: number;
  name: string;
}

export const BasicFunction: FC = (props) => {
  const [state, setState] = useState<ItemType[]>([
    { id: 1, name: "shrek" },
    { id: 2, name: "fiona" },
    { id: 3, name: "donkey" },
    { id: 4, name: "cat" },
    { id: 5, name: "dog" },
    { id: 6, name: "bird" },
    { id: 7, name: "fish" },
    { id: 8, name: "horse" },
    { id: 9, name: "rabbit" },
    { id: 10, name: "snake" },
    { id: 11, name: "tiger" },
    { id: 12, name: "lion" },
    { id: 13, name: "zebra" },
    { id: 14, name: "giraffe" },
    { id: 15, name: "elephant" },
    { id: 16, name: "monkey" },
    { id: 17, name: "panda" },
  ]);

  return (
    <ReactSortable list={state} setList={setState} animation={150} ghostClass="sortable-grid-ghost-class">
      {state.map((item) => (
        <div className="w-15 h-15 bg-red-500 inline-block m-2" key={item.id}>Item {item.id}</div>
      ))}
    </ReactSortable>
  );
};