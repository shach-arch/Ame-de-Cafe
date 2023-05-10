<script>
  import { createClient } from '@supabase/supabase-js';
  import { navigate } from 'svelte-routing';

  const supabaseUrl = 'https://ujnattukwsqsjmzuhyoh.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMDU0NDIsImV4cCI6MTk5NjY4MTQ0Mn0.BlphC4ExBHwAAsl3EQ5WSc9iu_K9gXGkkBodgLDhxgi0';
  const supabase = createClient(supabaseUrl, supabaseKey);

  let email = '';
  let password = '';
  let confirmPassword = '';
  let successMessage = '';
  let errorMessage = '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match';
      successMessage = '';
      return;
    }
    try {
      const {error } = await supabase.auth.signUp({ email, password });

      if (error) {
        errorMessage = error.message;
        successMessage = '';
      } else {
        successMessage = 'User created successfully! Check your email to confirm your account.';
        console.log('User created:', email);
        errorMessage = '';
      }
      email = '';
      password = '';
      confirmPassword = '';
      navigate('login');
    } catch (error) {
      console.error(error);
    }
  };
</script>

<main>
  <h1>Sign Up</h1>
  {#if successMessage}
    <p class="success">{successMessage}</p>
  {:else if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
  <form on:submit={handleSubmit}>
    <label for="email">Email:</label>
    <input type="email" id="email" bind:value={email}>
    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password}>
    <label for="confirmPassword">Confirm Password:</label>
    <input type="password" id="confirmPassword" bind:value={confirmPassword}>
    <button type="submit">Sign Up</button>
  </form>
  <p>Already have an account? <a href="login.html">Log in here</a>.</p>
</main>
