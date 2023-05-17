<script>
  import { createClient } from '@supabase/supabase-js';
  import { navigate } from 'svelte-routing';

  const supabaseUrl = 'https://ujnattukwsqsjmzuhyoh.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMDU0NDIsImV4cCI6MTk5NjY4MTQ0Mn0.BlphC4ExBHwAAsl3EQ5WSc9iu_K9gXGkkBodgLDhxg0';
  const supabase = createClient(supabaseUrl, supabaseKey);

  let email = '';
  let password = '';
  let confirmPassword = '';
  let successMessage = '';
  let errorMessage = '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check that the passwords match
    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match';
      successMessage = '';
      return;
    }
    try {
      // Attempt to sign up a new user with email and password
      const {error } = await supabase.auth.signUp({ email, password });

      if (error) {
        // If there is an error, display the error message
        errorMessage = error.message;
        successMessage = '';
      } else {
        // If sign up is successful, display a success message
        successMessage = 'User created successfully! Check your email to confirm your account.';
        console.log('User created:', email);
        errorMessage = '';
      }
      // Clear the form
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

  <style>
    main {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      align : center;
    }
    h1 {
      text-align: center;
    }
    body {
     margin: 0 auto;
    }
    form {
      display: inline;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input {
      padding: 0.5rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
    button {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      background-color: #fff;
      cursor: pointer;
    }
    button:hover {
      background-color: #f5f5f5;
    }

  </style>
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
  <p>Already have an account? <a href="index.html">Log in here</a>.</p>
</main>
