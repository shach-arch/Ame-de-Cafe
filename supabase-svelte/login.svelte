<!-- Login.html -->

<script>
  import { AuthError, createClient } from '@supabase/supabase-js';
  import{navigate} from 'svelte-routing';

  const supabaseUrl = 'https://ujnattukwsqsjmzuhyoh.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExMDU0NDIsImV4cCI6MTk5NjY4MTQ0Mn0.BlphC4ExBHwAAsl3EQ5WSc9iu_K9gXGkkBodgLDhxg0'; 
  const supabase = createClient(supabaseUrl, supabaseKey);

  let email = '';
  let loginMessage = '';
  let password = '';

  async function login() {
    try {
      // Attempt to sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        // If there is an error, display a login failure message
        loginMessage = `Login failed: ${error.message}`;
        console.error(error);
      } else if (data) {
        // If login is successful, display a login success message
        loginMessage = 'Login successful!';
        console.log('User:', data);
        window.location.href= '/home.html'; // Redirect to the home page
      }
    } catch (error) {
      // Catch any errors that occur during the login process
      loginMessage = `Login failed: ${error.message}`;
      console.error(error);
    }
  }

  import 'bootstrap/dist/css/bootstrap.min.css';
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
  <h1>Login</h1>
<body>
  <form on:submit|preventDefault={login}>
    <p><label for="email">Email:</label>
      <input type="email" id="email" bind:value={email} required />
    </p>
    <p>
      <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password} required />
    </p>
    <p><button type="submit">Log in</button>
    </p>
  </form>
</body>

{#if loginMessage}
  <p>{loginMessage}</p>
{/if}
  <p>Need an account? <a href="signup.html">Sign up here</a>.</p>
</main>
