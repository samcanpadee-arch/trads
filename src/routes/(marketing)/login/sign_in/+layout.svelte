<script lang="ts"></script>

<!-- Minimal header (no card/box) -->
<div class="max-w-md mx-auto px-4 pt-10 text-center space-y-2">
  <h1 class="text-4xl md:text-5xl font-bold leading-tight tracking-tight">Sign in</h1>
  <p class="text-base md:text-lg opacity-80">Welcome back — jump straight into your tools and chats.</p>
</div>

<!-- Keep the existing Supabase Auth form via the slot -->
<slot />

<!-- Helper links under the form: each on its own line -->
<div class="max-w-md mx-auto px-4 mt-4 text-center space-y-1">
  <p class="text-sm opacity-80">
    <a class="link" href="/login/forgot_password">Forgot password?</a>
  </p>
  <p class="text-sm opacity-80">
    <a class="link" href="/login/sign_up">Don’t have an account? Create one</a>
  </p>
  <p class="text-sm opacity-80">
    <a class="link" href="/contact_us">Need help?</a>
  </p>
</div>
