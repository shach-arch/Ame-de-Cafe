<!-- Login.html -->

<script>
  import { createClient } from '@supabase/supabase-js';
  import { navigate } from 'svelte-routing';

  const supabaseUrl = 'https://ujnattukwsqsjmzuhyoh.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMDU0NDIsImV4cCI6MTk5NjY4MTQ0Mn0.BlphC4ExBHwAAsl3EQ5WSc9iu_K9gXGkkBodgLDhxgi0';
  const supabase = createClient(supabaseUrl, supabaseKey);

  let email = '';
  let successMessage = '';
  let errorMessage = '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { error } = await supabase.auth.signIn({ email: email });

      if (error) {
        errorMessage = error.message;
        successMessage = '';
      } else {
        successMessage = 'You have successfully logged in!';
        console.log('User successfully authenticated:', email);
        errorMessage = '';
        // Redirect the user to the home page
        navigate('home');
      }
      email = '';
    } catch (error) {
      console.error(error);
    }
  };
</script>

<main>
  <h1>Login</h1>
  {#if successMessage}
    <p class="success">{successMessage}</p>
  {:else if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
  <form on:submit={handleSubmit}>
    <label for="email">Email:</label>
    <input type="email" id="email" bind:value={email}>
    <button type="submit">Login</button>
  </form>
</main>
