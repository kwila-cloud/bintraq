import { ref } from "vue";
import { blockOptions, sizeOptions } from "@/models/bin";
import type { Picker } from "@/models/picker";
import { getPickers } from "@/lib/utils";

const pickers = ref<string[]>([]);
const blocks = ref(blockOptions);
const sizes = ref(sizeOptions);
export const settings = ref([
  { id: "picker", name: "Picker", options: pickers, type: "select" },
  { id: "block", name: "Block", options: blocks, type: "select" },
  { id: "size", name: "Bin Size", options: sizes, type: "select" },
  { id: "id", name: "Bin ID", type: "text" },
]);

// Load the pickers. There is probably a better way to do this.
getPickers().then((p: Picker[]) => {
  pickers.value = p.map((p) => p.name);
});
