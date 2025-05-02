<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const isLogin = ref(true) // Toggle between login and signup
const router = useRouter()

async function signIn() {
  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (authError) {
      error.value = authError.message
    } else {
      router.push('/')
    }
  } catch (e: any) {
    error.value = e.message
  }
}

async function signUp() {
  try {
    const { error: authError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })
    if (authError) {
      error.value = authError.message
    } else {
      // Optionally, redirect or show a success message
      router.push('/')
    }
  } catch (e: any) {
    error.value = e.message
  }
}

function toggleForm() {
  isLogin.value = !isLogin.value
  error.value = '' // Clear any previous errors
}
</script>

<template>
  <div class="flex justify-center mt-24">
    <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
      <h1 class="text-xl font-medium text-gray-900 dark:text-white text-center mb-4">{{ isLogin ? 'Login' : 'Sign Up' }}</h1>
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">{{ error }}</span>
      </div>
      <form @submit.prevent="isLogin ? signIn() : signUp()" class="space-y-4">
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
          <input type="email" id="email" v-model="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div>
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
          <input type="password" id="password" v-model="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ isLogin ? 'Login' : 'Sign Up' }}</button>
        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
          {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
          <a href="#" @click.prevent="toggleForm" class="font-medium text-blue-600 hover:underline dark:text-blue-500">{{ isLogin ? 'Sign Up' : 'Login' }}</a>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Empty, as Tailwind CSS is used */
</style>
