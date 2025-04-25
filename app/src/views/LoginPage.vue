<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'vue-router'
import '../assets/login.css'

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
  <div class="login-container">
    <h1>Login</h1>
    <div v-if="error" class="error-message">{{ error }}</div>
    <form @submit.prevent="signIn" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required class="form-control" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required class="form-control" />
      </div>
      <button type="submit" class="btn-primary">Login</button>
    </form>
    <p class="register-link">
      Don't have an account?
      <a href="/register">Register</a>
    </p>
  </div>
</template>
