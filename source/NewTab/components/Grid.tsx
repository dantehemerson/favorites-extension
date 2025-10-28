import clsx from "clsx";
import React, { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Sortable from "sortablejs";

import MultiDragPro from "../../sortablejs-plugins/MultiDragPro";

// @ts-ignore
Sortable.mount(new MultiDragPro());

interface ItemType {
  id: number;
  name: string;
  type?: "folder" | "file";
}

export function Grid() {
  const [state, setState] = useState<ItemType[]>([
    { id: 1, name: "shrek" },
    { id: 2, name: "fiona" },
    { id: 3, name: "donkey" },
    { id: 4, name: "cat" },
    { id: 5, name: "dog" },
    { id: 6, name: "bird", type: "folder" },
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
    <ReactSortable
      multiDrag={true}
      selectedClass="sortable-grid-selected-class"
      list={state}
      id="grid-container"
      setList={setState}
      swapThreshold={1}
      animation={150}
      onMove={(evt: any) => {
        const target = evt.related;
        // Pointer position:
        console.log(
          "Pointer position: ",
          evt.originalEvent.clientX,
          evt.originalEvent.clientY
        );

        if (target.classList.contains("folder")) {
          console.log("willInserAfter", evt.willInsertAfter);
          console.log("IS INSIDEEEEEEEEE");
          // Example custom logic: require dragged element to overlap 70% of folder to allow drop

          const mouseX = evt.originalEvent.clientX;
          const mouseY = evt.originalEvent.clientY;

          const rect = target.getBoundingClientRect();

          drawVerticalDebugLines(rect.left, rect.right);

          const thresshold = 20; /// in pixels

          target.classList.add("folder-hover");

          return false;

        } else {
          document
            .querySelectorAll(".folder-hover")
            .forEach((el) => el.classList.remove("folder-hover"));

          return true;
        }
      }}
      onEnd={() => {
        // Clean up the visual effect after drop
        document.querySelectorAll(".folder.folder-hover").forEach((el) => {
          el.classList.remove("folder-hover");
        });
      }}
      ghostClass="sortable-grid-ghost-class"
    >
      {state.map((item) => (
        <div
          className={clsx(
            "w-15 h-15 bg-blue-500 inline-block m-2",
            "favorite",
            item.type === "folder" ? "bg-green-500 folder" : "bg-red-500"
          )}
          key={item.id}
        >
          Item {item.id}
        </div>
      ))}
    </ReactSortable>
  );
}

export function drawVerticalDebugLines(
  x1: number,
  x2: number,
  color1: string = "red",
  color2: string = "blue"
): void {
  const makeLine = (id: string, x: number, color: string): void => {
    let line = document.getElementById(id) as HTMLDivElement | null;
    if (!line) {
      line = document.createElement("div");
      line.id = id;

      Object.assign(line.style, {
        position: "fixed",
        top: "0",
        bottom: "0",
        width: "1px",
        pointerEvents: "none",
        zIndex: "9999",
      });

      document.body.appendChild(line);
    }

    Object.assign(line.style, {
      left: `${x}px`,
      background: color,
    });
  };

  makeLine("debug-line-1", x1, color1);
  makeLine("debug-line-2", x2, color2);
}
