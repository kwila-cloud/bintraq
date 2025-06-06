import { ref } from "vue";
import { blockOptions, sizeOptions } from "@/models/bin";

// TODO: load pickers from supabase
const pickers = ref(["Addison", "Milo"]);
const blocks = ref(blockOptions);
const sizes = ref(sizeOptions);
export const settings = ref([
  { id: "picker", name: "Picker", options: pickers, type: "select" },
  { id: "block", name: "Block", options: blocks, type: "select" },
  { id: "size", name: "Bin Size", options: sizes, type: "select" },
  { id: "id", name: "Bin ID", type: "text" },
]);
