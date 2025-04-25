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

<style scoped>
.login-container {
  width: 300px;
  margin: 96px auto; /* Changed 100px to 96px */
  padding: 16px; /* Changed 20px to 16px */
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 16px; /* Changed 20px to 16px */
}

.error-message {
  color: red;
  margin-bottom: 8px; /* Changed 10px to 8px */
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 16px; /* Changed 15px to 16px */
}

label {
  display: block;
  margin-bottom: 4px; /* Changed 5px to 4px */
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 8px 12px; /* Changed 10px 15px to 8px 12px */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.register-link {
  text-align: center;
  margin-top: 16px; /* Changed 15px to 16px */
}
</style>
