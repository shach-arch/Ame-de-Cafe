<!-- Login.html -->

<script>
  // @ts-nocheck
  import { AuthError, createClient } from "@supabase/supabase-js";
  import { navigate } from "svelte-routing";
  import "bootstrap/dist/js/bootstrap.min.js";

  const supabaseUrl = "https://ujnattukwsqsjmzuhyoh.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1OTUyMDgsImV4cCI6MjAwMTE3MTIwOH0.G9dIZVpPY5ylDQD63YRjGFGuP3LGtECuQndt8OdxtZM";
  const supabase = createClient(supabaseUrl, supabaseKey);

  let email = "";
  let loginMessage = "";
  let password = "";

  async function login() {
    try {
      // Attempt to sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        // If there is an error, display a login failure message
        loginMessage = `Login failed: ${error.message}`;
        console.error(error);
      } else if (data) {
        // If login is successful, display a login success message
        loginMessage = "Login successful!";
        console.log("User:", data);
        window.location.href = "home.html"; // Redirect to the home page
      }
    } catch (error) {
      // Catch any errors that occur during the login process
      loginMessage = `Login failed: ${error.message}`;
      console.error(error);
    }
  }
</script>

<main class="form-signin w-100 m-auto">
  <form on:submit|preventDefault={login}>
    <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

    <div class="form-floating">
      <input
        type="email"
        class="form-control"
        id="floatingInput"
        bind:value={email} required
      />
      <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating">
      <input
        type="password"
        class="form-control"
        id="floatingPassword"
        bind:value={password} required
      />
      <label for="floatingPassword">Password</label>
    </div>

    <div class="form-check text-start my-3">
      <input
        class="form-check-input"
        type="checkbox"
        value="remember-me"
        id="flexCheckDefault"
      />
      <label class="form-check-label" for="flexCheckDefault">
        Remember me
      </label>
    </div>
    <button class="btn btn-primary w-100 py-2" type="submit"> Sign In </button>
    <button class="btn btn-primary w-100 py-2" onclick="window.location.href = 'signup.html'"> Sign Up </button>

    <p class="mt-5 mb-3 text-body-secondary">© 2017–2023</p>
  </form>
  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
    crossorigin="anonymous"
  ></script>
</main>
