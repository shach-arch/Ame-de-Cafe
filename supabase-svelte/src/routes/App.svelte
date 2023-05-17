<!-- App.svelte -->
<script>
    import { Router, Route } from 'svelte-routing';
    //import Home from '.src/routes/Home.svelte';
    import Login from '../../login.svelte';
    import Signup from '../../signup.svelte';

  </script>
  
  <Router>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
  
  </Router>
  