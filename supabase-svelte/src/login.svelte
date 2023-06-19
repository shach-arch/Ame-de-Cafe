<!-- Login.html -->

<script>
// @ts-nocheck
  import { AuthError, createClient } from '@supabase/supabase-js';
  import{navigate} from 'svelte-routing';
  import 'bootstrap/dist/js/bootstrap.min.js';

  const supabaseUrl = 'https://ujnattukwsqsjmzuhyoh.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1OTUyMDgsImV4cCI6MjAwMTE3MTIwOH0.G9dIZVpPY5ylDQD63YRjGFGuP3LGtECuQndt8OdxtZM'; 
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
</script>

<main>
 <head>
      <!-- basic -->
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- mobile metas -->
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="viewport" content="initial-scale=1, maximum-scale=1">
      <!-- site metas -->
      <title>Ame de cafe Express</title>
      <meta name="keywords" content="">
      <meta name="description" content="">
      <meta name="author" content="">
      <!-- bootstrap css -->
      <link rel="stylesheet" type="text/css" href="src/css/bootstrap.min.css">
      <!-- style css -->
      <link rel="stylesheet" type="text/css" href="src/css/style.css">
      <!-- Responsive-->
      <link rel="stylesheet" href="src/css/responsive.css">
      <!-- fevicon -->
      <link rel="icon" href="src/images/fevicon.png" type="image/gif" />
      <!-- font css -->
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
 </head>

 <body>
  <div class="header_section">
    <div class="container-fluid">
       <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <!-- svelte-ignore a11y-missing-attribute -->
          <a class="navbar-brand"><img src="src/images/favicon.ico"></a>
          <p class="logo_text">Ame de cafe Express</p>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <form class="form-inline my-2 my-lg-0">
            </form>
         </div>
      </nav>
   </div>
           <!-- banner section start --> 
           <div class="banner_section layout_padding">
            <div class="container-fluid">
              <div id="banner_slider" class="carousel slide" data-ride="carousel">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <div class="row">
                      <div class="col-md-6">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <div class="banner_img"><img src="src/images/banner-img.png"></div>
                      </div>
                      <div class="col-md-6">
                        <div class="banner_taital_main">
                          <h1 class="banner_taital">Login</h1>
                          <h5 class="tasty_text">Tasty Of Ame de cafe Express</h5>
                          <div class="btn_main">
                            <div class="about_bt">
                              
                              <form on:submit|preventDefault={login}>
                                <div class="mb-3">
                                  <label for="email" class="form-label">Email address</label>
                                  <input type="email" class="form-control" id="email" bind:value={email} required>
                                </div>
                                <div class="mb-3">
                                  <label for="password" class="form-label">Password</label>
                                  <input type="password" class="form-control" id="password" bind:value={password} required>
                                </div>
                                <div class="d-flex align-items-center justify-content-between">
                                  <button type="submit" class="btn btn-primary">Login</button>
                                  <button type="button" class="btn btn-primary" onclick="window.location.href = 'signup.html'">signup</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>   
 </body>

</main>
