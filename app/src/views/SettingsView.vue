<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import PageLayout from "@/components/PageLayout.vue";
import ToggleSettingItem from "@/components/ToggleSettingItem.vue";

const dailyCountUiEnabled = ref(false);

onMounted(() => {
  const stored = localStorage.getItem("dailyCountUiEnabled");
  dailyCountUiEnabled.value = stored === "true";
});

// Watch for changes to save to localStorage
watch(dailyCountUiEnabled, (newValue) => {
  localStorage.setItem("dailyCountUiEnabled", newValue.toString());
});
</script>

<template>
  <PageLayout title="Settings">
    <ToggleSettingItem
      title="Enable Daily Count UI (Experimental)"
      description="Use daily count interface instead of individual bin entry"
      v-model:value="dailyCountUiEnabled"
    />
  </PageLayout>
</template>
