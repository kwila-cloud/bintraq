<script setup lang="ts">
import { Icon } from '@iconify/vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
</script>

<template>
  <DialogRoot>
    <DialogTrigger class="bg-blue-500 text-white flex px-2 py-1 rounded-md items-center gap-1">
      <Icon icon="hugeicons:add-01" />
      <span>Add</span>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
      <DialogContent
        class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-slate-800 p-6 focus:outline-none z-[100] w-80"
      >
        <DialogTitle class="text-lg font-semibold">Add Bin</DialogTitle>
        <DialogDescription class="mt-3 mb-5 text-sm leading-normal">
          TODO: add bin settings here
        </DialogDescription>
        <div class="mt-6 flex justify-end">
          <DialogClose as-child>
            <button>Save</button>
          </DialogClose>
        </div>
        <DialogClose class="absolute top-2 right-2 p-2" aria-label="Close">
          <Icon icon="hugeicons:cancel-01" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
