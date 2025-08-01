import { blockOptions, sizeOptions } from "@/models/bin";
import type { Picker } from "@/models/picker";

export const getSettings = (pickers) => [
  {
    id: "picker",
    name: "Picker",
    options: pickers.map(({ name }) => name),
    type: "select",
  },
  { id: "block", name: "Block", options: blockOptions, type: "select" },
  { id: "size", name: "Bin Size", options: sizeOptions, type: "select" },
  { id: "id", name: "Bin ID", type: "text" },
];
