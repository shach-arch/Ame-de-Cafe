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
  const orderStatus = writable('Pending');
  const cartCount = writable(0); // Declare and initialize cartCount variable

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
// Fetch the price for "Espresso Roast" from the database
async function fetchEspressoRoastPrice() {
  try {
    const { data } = await supabase
      .from('Products')
      .select('current_wholesale_price')
      .match({ product:'Espresso Roast' })
      .single();

    const espressoRoastPrice = parseFloat(data?.current_wholesale_price || 0);
    return espressoRoastPrice;

  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    return {
      price: 0,
          }
  }
}
async function fetchCivetCatPrice(){
  try{
    const { data } = await supabase
    .from('Products')
    .select('current_wholesale_price')
    .match({product:'Civet Cat'})
    .single();

    const civetCatPrice = parseFloat(data?.current_wholesale_price || 0);
    return civetCatPrice;
  }catch(error){
    console.error('Error fetching data from Supabase:', error);
    return {
      price: 0,
    }
  }
}

function updateOrderStatus(status) {
  orderStatus.set(status);
}

function addToCart() {
    cartCount.update((count) => count + 1);
  }
  
  function submitOrder() {
      // Order submitted
  updateOrderStatus('Submitted');
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
  addToCart();
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
 <section class="">
  <div class="container">
    <div class="row">
      <!-- sidebar -->
      <div class="col-lg-3">
        <!-- Toggle button -->
        <button
                class="btn btn-outline-secondary mb-3 w-100 d-lg-none"
                type="button"
                data-mdb-toggle="collapse"
                data-mdb-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
          <span>Show filter</span>
        </button>
        <!-- Collapsible wrapper -->
        <div class="collapse card d-lg-block mb-5" id="navbarSupportedContent">
          <div class="accordion" id="accordionPanelsStayOpenExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                        class="accordion-button text-dark bg-light"
                        type="button"
                        data-mdb-toggle="collapse"
                        data-mdb-target="#panelsStayOpen-collapseOne"
                        aria-expanded="true"
                        aria-controls="panelsStayOpen-collapseOne"
                        >
                  Menu
                </button>
              </h2>
              <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne">
                <div class="accordion-body">
                  <ul class="list-unstyled">
                    <li><a href="#" class="text-dark">Food </a></li>
                    <li><a href="#" class="text-dark">Tea </a></li>
                    <li><a href="#" class="text-dark">Coffee </a></li>
                    <li><a href="#" class="text-dark">Beverages </a></li>
             
                  </ul>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button
                        class="accordion-button text-dark bg-light"
                        type="button"
                        data-mdb-toggle="collapse"
                        data-mdb-target="#panelsStayOpen-collapseThree"
                        aria-expanded="false"
                        aria-controls="panelsStayOpen-collapseThree"
                        >
    
                  Size
                </button>
              </h2>
              <div id="panelsStayOpen-collapseFour" class="accordion-collapse collapse show" aria-labelledby="headingThree">
                <div class="accordion-body">
                  <input type="checkbox" class="btn-check border justify-content-center" id="btn-check2" checked autocomplete="off" />
                  <label class="btn btn-white mb-1 px-1" style="width: 60px;" for="btn-check2">SM</label>
                  <input type="checkbox" class="btn-check border justify-content-center" id="btn-check3" checked autocomplete="off" />
                  <label class="btn btn-white mb-1 px-1" style="width: 60px;" for="btn-check3">LG</label>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button
                        class="accordion-button text-dark bg-light"
                        type="button"
                        data-mdb-toggle="collapse"
                        data-mdb-target="#panelsStayOpen-collapseFive"
                        aria-expanded="false"
                        aria-controls="panelsStayOpen-collapseFive"
                        >
                  Ratings
                </button>
              </h2>
              <div id="panelsStayOpen-collapseFive" class="accordion-collapse collapse show" aria-labelledby="headingThree">
                <div class="accordion-body">
                  <!-- Default checkbox -->
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked />
                    <label class="form-check-label" for="flexCheckDefault">
                      <i class="fas fa-star text-warning"></i><i class="fas fa-star text-warning"></i><i class="fas fa-star text-warning"></i><i class="fas fa-star text-warning"></i>
                      <i class="fas fa-star text-warning"></i>
                    </label>
                  </div>
                  <!-- Default checkbox -->
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked />
                    <label class="form-check-label" for="flexCheckDefault">
                      <i class="fas fa-star text-warning"></i><i class="fas fa-star text-warning"></i><i class="fas fa-star text-warning"></i><i class="fas fa-star text-warning"></i>
                      <i class="fas fa-star text-secondary"></i>
                    </label>
                  </div>
                  <!-- Default checkbox -->
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked />
                    <label class="form-check-label" for="flexCheckDefault">
                      <i class="fas fa-star text-warning"></i><i class="fas fa-star text-warning"></i><i class="fas fa-star text-warning"></i><i class="fas fa-star text-secondary"></i>
                      <i class="fas fa-star text-secondary"></i>
                    </label>
                  </div>
                  <!-- Default checkbox -->
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked />
                    <label class="form-check-label" for="flexCheckDefault">
                      <i class="fas fa-star text-warning"></i><i class="fas fa-star text-warning"></i><i class="fas fa-star text-secondary"></i><i class="fas fa-star text-secondary"></i>
                      <i class="fas fa-star text-secondary"></i>
                    </label>
                    <!--to be move (dont like currect position)-->
                    <h3>Cart</h3>
                    <p>Items: <span id="cartCount">0</span></p>
                    <p>Selected Item Price: <span id="selectedPrice">0</span></p>
                    <p>Total Price: <span id="totalPrice">0</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <!-- sidebar -->


<!-- content -->
<div class="col-lg-9">
  <header class="d-sm-flex align-items-center border-bottom mb-4 pb-3">
    <strong class="d-block py-2">32 Items found </strong>
    <div class="ms-auto">
      <select class="form-select d-inline-block w-auto border pt-1">
        <option value="0">Best match</option>
        <option value="1">Recommended</option>
        <option value="2">High rated</option>
        <option value="3">Randomly</option>
      </select>
      <div class="btn-group shadow-0 border">
        <a href="#" class="btn btn-light" title="List view">
          <i class="fa fa-bars fa-lg"></i>
        </a>
        <a href="#" class="btn btn-light active" title="Grid view">
          <i class="fa fa-th fa-lg"></i>
        </a>
      </div>
    </div>
  </header>

  <div class="row justify-content-center mb-3">
    <div class="col-md-12">
      <div class="card shadow-0 border rounded-3">
        <div class="card-body">
          <div class="row g-0">
            <div class="col-xl-3 col-md-4 d-flex justify-content-center">
              <div class="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
                <img src="src/images/marina-zaharkina-oWBTvKB8Ro8-unsplash.jpg" class="w-100" />
                <a href="#!">
                  <div class="hover-overlay">
                    <div class="mask" style="background-color: rgba(253, 253, 253, 0.15);"></div>
                  </div>
                </a>
              </div>
            </div>
            <div class="col-xl-6 col-md-5 col-sm-7">
              <h5>Civet Cat</h5>
              <div class="d-flex flex-row">
                <div class="text-warning mb-1 me-2">
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fas fa-star-half-alt"></i>
                  <span class="ms-1">
                    4.5
                  </span>
                </div>
                <span class="text-muted">154 orders</span>
              </div>

              <p class="text mb-4 mb-md-0">
                The most expensive coffee in the world, the cats do all the work. 
              </p>
            </div>
            <div class="col-xl-3 col-md-3 col-sm-5">
              <div class="d-flex flex-row align-items-center mb-1">
              {#await fetchCivetCatPrice}
                <p>Loading price...</p>
              {:then civetCatPrice}
                {#if typeof civetCatPrice === 'number'}
                  <h4 class="mb-1 me-1">${civetCatPrice.toFixed(2)}</h4>
                {:else}
                  <p>Error: invalid</p>
                {/if}
              {:catch error}
                <p>Error fetching price: {error.message}</p>
              {/await}
              </div>
              <div class="mt-4">
                <button class="btn btn-primary shadow-0" type="button">Buy this</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-content-center mb-3">
    <div class="col-md-12">
      <div class="card shadow-0 border rounded-3">
        <div class="card-body">
          <div class="row g-0">
            <div class="col-xl-3 col-md-4 d-flex justify-content-center">
              <div class="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
                <img src="/src/images/nathan-dumlao-XOhI_kW_TaM-unsplash.jpg" class="w-100" />
                <a href="#!">
                  <div class="hover-overlay">
                    <div class="mask" style="background-color: rgba(253, 253, 253, 0.15);"></div>
                  </div>
                </a>
              </div>
            </div>
            <div class="col-xl-6 col-md-5 col-sm-7">
              <h5>Espresso Roast</h5>
              <div class="d-flex flex-row">
                <div class="text-warning mb-1 me-2">
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="far fa-star"></i>
                  <i class="far fa-star"></i>
                  <span class="ms-1">
                    3
                  </span>
                </div>
                <span class="text-muted">73 orders</span>
              </div>
              <p class="text mb-4 mb-md-0">
                Our house blend for a good espresso shot.
              </p>
            </div>
            <!-- gets item price from database and display it -->
            <div class="col-xl-3 col-md-3 col-sm-5">
              <div class="d-flex flex-row align-items-center mb-1">
                {#await fetchEspressoRoastPrice()}
                <p>Loading price...</p>
              {:then espressoRoastPrice}
                <h4 class="mb-1 me-1">${espressoRoastPrice.toFixed(2)}</h4>
              {:catch error}
                <p>Error fetching price: {error.message}</p>
              {/await}
              </div>
              <div class="mt-4">
                <button class="btn btn-primary shadow-0" type="button" on:click="{submitOrder}">Buy this</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-content-center mb-3">
    <div class="col-md-12">
      <div class="card shadow-0 border rounded-3">
        <div class="card-body">
          <div class="row g-0">
            <div class="col-xl-3 col-md-4 d-flex justify-content-center">
              <div class="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
                <img src="/src/images/jayden-sim-OINDTAHGjrc-unsplash.jpg" class="w-100" />
                <a href="#!">
                  <div class="hover-overlay">
                    <div class="mask" style="background-color: rgba(253, 253, 253, 0.15);"></div>
                  </div>
                </a>
              </div>
            </div>
            <div class="col-xl-6 col-md-5 col-sm-7">
              <h5>T-shirt for Men Blue Cotton Base</h5>
              <div class="d-flex flex-row">
                <div class="text-warning mb-1 me-2">
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fas fa-star-half-alt"></i>
                  <i class="far fa-star"></i>
                  <span class="ms-1">
                    3.5
                  </span>
                </div>
                <span class="text-muted">910 orders</span>
              </div>

              <p class="text mb-4 mb-md-0">
                Short description about the product goes here, for ex its features. Lorem ipsum dolor sit amet with hapti you enter into any new area of science, you almost lorem ipsum is great text
                consectetur adipisicing
              </p>
            </div>
            <div class="col-xl-3 col-md-3 col-sm-5">
              <div class="d-flex flex-row align-items-center mb-1">
                <h4 class="mb-1 me-1">$99,50</h4>
              </div>
              <h6 class="text-success">Free shipping</h6>
              <div class="mt-4">
                <button class="btn btn-primary shadow-0" type="button">Buy this</button>
                <a href="#!" class="btn btn-light border px-2 pt-2 icon-hover"><i class="fas fa-heart fa-lg px-1"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-content-center mb-3">
    <div class="col-md-12">
      <div class="card shadow-0 border rounded-3">
        <div class="card-body">
          <div class="row g-0">
            <div class="col-xl-3 col-md-4 d-flex justify-content-center">
              <div class="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
                <img src="/src/images/mockup-graphics-AIkFaeX9ILc-unsplash.jpg" class="w-100" />
                <a href="#!">
                  <div class="hover-overlay">
                    <div class="mask" style="background-color: rgba(253, 253, 253, 0.15);"></div>
                  </div>
                </a>
              </div>
            </div>
            <div class="col-xl-6 col-md-5 col-sm-7">
              <h5>Winter Jacket for Men and Women</h5>
              <div class="d-flex flex-row">
                <div class="text-warning mb-1 me-2">
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fas fa-star-half-alt"></i>
                  <span class="ms-1">
                    4.5
                  </span>
                </div>
                <span class="text-muted">154 orders</span>
              </div>

              <p class="text mb-4 mb-md-0">
                Short description about the product goes here, for ex its features. Lorem ipsum dolor sit amet with hapti you enter into any new area of science, you almost lorem ipsum is great text
              </p>
            </div>
            <div class="col-xl-3 col-md-3 col-sm-5">
              <div class="d-flex flex-row align-items-center mb-1">
                <h4 class="mb-1 me-1">$140</h4>
                <span class="text-danger"><s>$190</s></span>
              </div>
              <h6 class="text-success">Free shipping</h6>
              <div class="mt-4">
                <button class="btn btn-primary shadow-0" type="button">Buy this</button>
                <a href="#!" class="btn btn-light border px-2 pt-2 icon-hover"><i class="fas fa-heart fa-lg px-1"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-content-center mb-3">
    <div class="col-md-12">
      <div class="card shadow-0 border rounded-3">
        <div class="card-body">
          <div class="row g-0">
            <div class="col-xl-3 col-md-4 d-flex justify-content-center">
              <div class="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
                <img src="/src/images/abhishek-hajare-kkrXVKK-jhg-unsplash.jpg" class="w-100" />
                <a href="#!">
                  <div class="hover-overlay">
                    <div class="mask" style="background-color: rgba(253, 253, 253, 0.15);"></div>
                  </div>
                </a>
              </div>
            </div>
            <div class="col-xl-6 col-md-5 col-sm-7">
              <h5>T-shirt for Men Blue Cotton Base</h5>
              <div class="d-flex flex-row">
                <div class="text-warning mb-1 me-2">
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fa fa-star"></i>
                  <i class="fas fa-star-half-alt"></i>
                  <span class="ms-1">
                    4.5
                  </span>
                </div>
                <span class="text-muted">154 orders</span>
              </div>

              <p class="text mb-4 mb-md-0">
                Short description about the product goes here, for ex its features. Lorem ipsum dolor sit amet with hapti you enter into any new area of science, you almost lorem ipsum is great text
              </p>
            </div>
            <div class="col-xl-3 col-md-3 col-sm-5">
              <div class="d-flex flex-row align-items-center mb-1">
                <h4 class="mb-1 me-1">$99.50</h4>
                <span class="text-danger"><s>$190</s></span>
              </div>
              <h6 class="text-success">Free shipping</h6>
              <div class="mt-4">
                <button class="btn btn-primary shadow-0" type="button">Buy this</button>
                <a href="#!" class="btn btn-light border px-2 pt-2 icon-hover"><i class="fas fa-heart fa-lg px-1"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <hr />      
  <!-- Pagination -->
  <nav aria-label="Page navigation example" class="d-flex justify-content-center mt-3">
    <ul class="pagination">
      <li class="page-item disabled">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item active"><a class="page-link" href="#">1</a></li>
      <li class="page-item"><a class="page-link" href="#">2</a></li>
      <li class="page-item"><a class="page-link" href="#">3</a></li>
      <li class="page-item"><a class="page-link" href="#">4</a></li>
      <li class="page-item"><a class="page-link" href="#">5</a></li>
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
  <!-- Pagination -->
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
 </body>
    
</main>

<style>
  button{
    color: darksalmon;
    border: 2px solid darksalmon;
    background-color: white;
  }
</style>
