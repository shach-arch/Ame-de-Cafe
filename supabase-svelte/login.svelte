<!-- Login.html -->

<script>
  import { createClient } from '@supabase/supabase-js';
  import { navigate } from 'svelte-routing';

  const supabaseUrl = 'https://ujnattukwsqsjmzuhyoh.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMDU0NDIsImV4cCI6MTk5NjY4MTQ0Mn0.BlphC4ExBHwAAsl3EQ5WSc9iu_K9gXGkkBodgLDhxg0'; 
  const supabase = createClient(supabaseUrl, supabaseKey);

  let email = '';
  let successMessage = '';
  let errorMessage = '';
  let password = '';

  const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const { user, session, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      errorMessage = error.message;
      successMessage = '';
    } else {
      // Fetch the customer data using the email and password
      const response = await fetch(`${supabaseUrl}/rest/v1/customer?select=customer_email&customer_email=eq.${user.email}&Password=eq.${password}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const customerData = await response.json();
        if (customerData.length === 0) {
          errorMessage = 'User not found';
          successMessage = '';
        } else {
          successMessage = 'You have successfully logged in!';
          console.log('User successfully authenticated:', user.email);
          errorMessage = '';
          // Redirect the user to the home page
          navigate('home');
        }
      } else {
        errorMessage = 'Failed to fetch user data';
        successMessage = '';
      }
    }

    email = '';
    password = '';
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
    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password}>
    <button type="submit">Login</button>
  </form>
  <p>Need an account? <a href="signup.html">Sign up here</a>.</p>
</main>
