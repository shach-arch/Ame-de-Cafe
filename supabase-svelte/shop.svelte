<script>
  import { createClient } from "@supabase/supabase-js";
  import { onMount } from "svelte";
  import { writable, get } from "svelte/store";


  const url = "https://ujnattukwsqsjmzuhyoh.supabase.co";

  const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1OTUyMDgsImV4cCI6MjAwMTE3MTIwOH0.G9dIZVpPY5ylDQD63YRjGFGuP3LGtECuQndt8OdxtZM";

  const supabase = createClient(url, anonKey);
  
  const coffeeOptions = writable([]);// Declare and initialize coffeeOptions variable
  const donutOptions = writable([]);// Declare and initialize donutOptions variable
  const totalPrice = writable(0);// Declare and initialize totalPrice variable

  let selectedDonut = ""; // Declare and initialize selectedDonut variable
  let selectedCoffee = ""; // Declare and initialize selectedCoffee variable
 
  // Update the total price when the selected coffee or donut changes
  async function updateTotalPrice() {
  try {
    const { data: coffeeData } = await supabase
      .from('Products')
      .select('product,current_wholesale_price')
      .match({ product_group: 'Whole Bean/Teas' });

    const selectedCoffeePrice = coffeeData.find((coffee) => coffee.product === selectedCoffee)?.current_wholesale_price || 0;

    const { data: donutData } = await supabase
      .from('Products')
      .select('product,current_wholesale_price')
      .match({ product_group: 'Food' });

    const donutPrice = donutData.find((donut) => donut.product === selectedDonut)?.current_wholesale_price || 0;

    totalPrice.set(parseFloat(selectedCoffeePrice) + parseFloat(donutPrice));
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
  }
}
  
  function submitOrder() {
    // Handle submitting the order
    console.log("Order submitted!");
    console.log("Selected coffee:", selectedCoffee);
    console.log("Selected donut:", selectedDonut);
    console.log("Total price:", totalPrice);

    const button = document.getElementById('myButton');
    const loadingScreen = document.getElementById('loadingScreen');

  button.addEventListener('click', () => {
    button.setAttribute('disabled', 'disabled');
    loadingScreen.style.display = 'block';

    // Perform the desired action (e.g., form submission, API call, etc.)
    // After the action is complete, hide the loading screen and enable the button again
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      button.removeAttribute('disabled');
    }, 2000);
  });
  // Credit card processing would go here
  const CreditCard = document.getElementById('CreditCard');
  if(CreditCard){
    CreditCard.style.display = 'block';
  }
  }

 // Fetch products that match the specified product groups
const coffeeGroups = ['Whole Bean/Teas', 'Beverages'];

supabase
  .from('Products')
  .select('product')
  .in('product_group', coffeeGroups)
  .then(({ data }) => {
    const coffeeProducts = data.map((item) => item.product);
    coffeeOptions.set(coffeeProducts);
  })

// Fetch products that match the specified product groups
const donutGroups = ['Food'];  
supabase
  .from('Products')
  .select('product')
  .in('product_group', donutGroups)
  .then(({ data }) => {
    const donutProducts = data.map((item) => item.product);
    donutOptions.set(donutProducts);
  })  
  onMount(() => {
    updateTotalPrice();
  });
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
    <title>Events</title>
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
    <!-- Scrollbar Custom CSS -->
    <link rel="stylesheet" href="src/css/jquery.mCustomScrollbar.min.css">
    <!-- Tweaks for older IEs-->
    <link rel="stylesheet" href="https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css">
 </head>

 <body>

  <div class="header_section header_bg">
    <div class="container-fluid">
       <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="home.html"><img src="src/images/favicon.ico"></a>
          <p class="logo_text">Ame de cafe Express</p>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
             <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                   <a class="nav-link" href="./home.html">Home</a>
                </li>
                <li class="nav-item">
                   <a class="nav-link" href="./shop.html">Shop</a>
                </li>
                <li class="nav-item active">
                   <a class="nav-link" href="./events.html">Events</a>
                </li>
              
             </ul>
             <form class="form-inline my-2 my-lg-0">
                <div class="login_bt">
                   <ul>
                      <li><a href="#"><span class="user_icon"><i class="fa fa-user" aria-hidden="true"></i></span>Login</a></li>
                   </ul>
                </div>
             </form>
          </div>
       </nav>
    </div>
 </div>
 <div class="blog_section layout_padding">
  <div class="container">
     <div class="row">
        <div class="col-md-12">
           <h1 class="about_taital">Order Page</h1>
        </div>
     </div>
     <div class="blog_section_2">
        <div class="row">
           <div class="col-md-6">
                 <form on:submit|preventDefault={submitOrder}>
                  <label for="coffee">Select Coffee:</label>
                  <div class="d-flex align-items-center justify-content-between">
                    <select id="coffee" bind:value={selectedCoffee} on:change={updateTotalPrice}>
                      <option value="">-- Choose a coffee --</option>
                      {#each $coffeeOptions as coffee}
                        <option value={coffee}>{coffee}</option>
                      {/each}
                    </select>
                  </div>
                  <label for="donut">Select Donut:</label>
                  <div class="d-flex align-items-center justify-content-between">
                    <select id="donut" bind:value={selectedDonut} on:change={updateTotalPrice}>
                      <option value="">-- Choose a donut --</option>
                      {#each $donutOptions as donut}
                        <option value={donut}>{donut}</option>
                      {/each}
                    </select>
                  </div>
                  <p>Total Price: ${$totalPrice.toFixed(2)}</p>
                  <button id = "myButton"type="submit" disabled={!(selectedCoffee && selectedDonut)}>Place Order</button>
                  <div id="loadingScreen" class="loading-screen" style="display: none;">
                    <div class="loader"></div>
                    </div>
              </div>
             <!-- Add this element to display the prompt -->
    <div id="CreditCard" class="card-prompt" style="display: none;">
      <h2>Enter Credit Card Information</h2>
      <form>
        <div class="form-group">
          <label for="cardNumber">Card Number:</label>
          <input type="text" id="cardNumber" placeholder="Card Number" />
        </div>
        <div class="form-group">
          <label for="expiryDate">Expiry Date:</label>
          <input type="text" id="expiryDate" placeholder="MM/YYYY" />
        </div>
        <div class="form-group">
          <label for="cvv">CVV:</label>
          <input type="text" id="cvv" placeholder="CVV" />
        </div>
        <button  type="submit">Pay Now</button>
      </form>
    </div>
     </div>
  </div>
</div>
 </body>
    
</main>

<style>
  button{
    color: darksalmon;
    border: 2px solid darksalmon;
    background-color: white;
  }
</style>
