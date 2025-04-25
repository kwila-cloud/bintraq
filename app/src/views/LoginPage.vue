<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
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
      // Redirect to home page after successful login
      router.push('/')
    }
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="login-container" style="width: 300px; margin: 100px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
    <h1 style="text-align: center; margin-bottom: 20px;">Login</h1>
    <div v-if="error" class="error-message" style="color: red; margin-bottom: 10px; text-align: center;">{{ error }}</div>
    <form @submit.prevent="signIn" class="login-form" style="display: flex; flex-direction: column;">
      <div class="form-group" style="margin-bottom: 15px;">
        <label for="email" style="display: block; margin-bottom: 5px; font-weight: bold;">Email</label>
        <input type="email" id="email" v-model="email" required class="form-control" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
      </div>
      <div class="form-group" style="margin-bottom: 15px;">
        <label for="password" style="display: block; margin-bottom: 5px; font-weight: bold;">Password</label>
        <input type="password" id="password" v-model="password" required class="form-control" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
      </div>
      <button type="submit" class="btn-primary" style="background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.3s;">Login</button>
    </form>
    <p class="register-link" style="text-align: center; margin-top: 15px;">
      Don't have an account?
      <a href="/register">Register</a>
    </p>
  </div>
</template>
