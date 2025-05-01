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
  <div class="login-container">
    <h1>{{ isLogin ? 'Login' : 'Sign Up' }}</h1>
    <div v-if="error" class="error-message">{{ error }}</div>
    <form @submit.prevent="isLogin ? signIn() : signUp()" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required class="form-control" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required class="form-control" />
      </div>
      <button type="submit" class="btn-primary">{{ isLogin ? 'Login' : 'Sign Up' }}</button>
    </form>
    <p class="toggle-form">
      {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
      <a href="#" @click.prevent="toggleForm">{{ isLogin ? 'Sign Up' : 'Login' }}</a>
    </p>
  </div>
</template>

<style scoped>
.login-container {
  width: 300px;
  margin: 96px auto;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  background-color: var(--color-background-soft);
}

h1 {
  text-align: center;
  margin-bottom: 16px;
  color: var(--color-heading);
}

.error-message {
  color: var(--color-error);
  margin-bottom: 8px;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
  color: var(--color-text);
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-sizing: border-box;
  color: var(--color-text);
  background-color: var(--color-background);
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: var(--color-primary-emphasis);
}

.toggle-form {
  text-align: center;
  margin-top: 16px;
  color: var(--color-text);
}

.toggle-form a {
  color: var(--color-primary);
  text-decoration: none;
}

.toggle-form a:hover {
  text-decoration: underline;
}
</style>
