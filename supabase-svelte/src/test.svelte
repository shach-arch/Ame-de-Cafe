<script>
  import { createClient } from "@supabase/supabase-js";
  const url = "https://ujnattukwsqsjmzuhyoh.supabase.co";
  const anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbmF0dHVrd3Nxc2ptenVoeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1OTUyMDgsImV4cCI6MjAwMTE3MTIwOH0.G9dIZVpPY5ylDQD63YRjGFGuP3LGtECuQndt8OdxtZM";
  const supabase = createClient(url, anonKey);

  let subtotal = 0;

  let cart = JSON.parse(sessionStorage.getItem("jsArray"));
  var cartList = [];
  let arrId = [];

  cart.forEach((item) => {
    arrId.push(item.product_id);
    cartList.push(item);
  });

  let promise = filter();

  async function filter() {
    try {
      const { data } = await supabase
        .from("Products")
        .select()
        .in("product_id", arrId);
      total();
      //   data.forEach((item) => console.log(item));
      return data;
    } catch (error) {
      console.error("Error fetching data from Supabase:", error);
      return error;
    }
  }

  function remove(item) {
    var id = item.product_id;
    const index = arrId.indexOf(id);

    if (index > -1) {
      // only splice array when item is found
      arrId.splice(index, 1); // 2nd parameter means remove one item only
    }

    // Remove from session
    const objWithIdIndex = cartList.findIndex((item) => item.product_id === id);

    cartList.splice(objWithIdIndex, 1);
    sessionStorage.setItem("jsArray", JSON.stringify(cartList));

    promise = filter();
  }

  function total() {
    subtotal = 0;
    cartList.forEach((item) => {
      const priceWithoutSymbol = item.current_retail_price.replace("$", "");
      const cost = parseFloat(priceWithoutSymbol);
      subtotal += cost;
    });

    console.log(subtotal);
  }
</script>

<main>
  <!-- Check Out -->
  <section class="h-custom scroll">
    <div class="container">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col">
          <div class="card">
            <div class="card-body p-4">
              <div class="row">
                <!-- Item List -->
                <div class="col-lg-7 scrollSection">
                  <h5 class="mb-3">
                    <a href="#!" class="text-body"
                      ><i class="fas fa-long-arrow-alt-left me-2" />
                      Continue Shopping</a
                    >
                  </h5>
                  <hr />

                  <div
                    class="d-flex justify-content-between align-items-center mb-4"
                  >
                    <div>
                      <p class="mb-1">Shopping cart</p>
                      <p class="mb-0">
                        You have
                        {#await promise}
                          0
                        {:then data}
                          {data.length}
                        {/await}
                        items in your cart
                      </p>
                    </div>
                  </div>
                  {#await promise}
                    <p>...waiting</p>
                  {:then data}
                    {#each data as item}
                      <div class="card mb-3">
                        <div class="card-body">
                          <div class="d-flex justify-content-between">
                            <div class="d-flex flex-row align-items-center">
                              <div>
                                <img
                                  src="../static/images/{item.product_group}.jpg"
                                  class="img-fluid rounded-3"
                                  alt="Shopping item"
                                  style="width: 65px;"
                                />
                              </div>
                              <div class="ms-3">
                                <h5>{item.product}</h5>
                                <p class="small mb-0">{item.product_group}</p>
                              </div>
                            </div>
                            <div class="d-flex flex-row align-items-center">
                              <div style="width: 80px;">
                                <h5 class="mb-0">
                                  {item.current_retail_price}
                                </h5>
                                <button
                                  type="button"
                                  class="btn btn-outline-primary mt-2"
                                  on:click={() => remove(item)}>Remove</button
                                >
                              </div>
                              <a href="#!" style="color: #cecece;"
                                ><i class="fas fa-trash-alt" /></a
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    {/each}
                  {/await}
                </div>

                <!-- Card Details -->
                <div class="col-lg-5">
                  <div class="card bg-custom text-white rounded-3">
                    <div class="card-body">
                      <div
                        class="d-flex justify-content-between align-items-center mb-4"
                      >
                        <h5 class="mb-0">Card details</h5>
                      </div>

                      <p class="small mb-2">Card type</p>

                      <form class="mt-4">
                        <div class="form-outline form-white mb-4">
                          <input
                            type="text"
                            id="typeName"
                            class="form-control form-control-lg"
                            size="17"
                            placeholder="Cardholder's Name"
                          />
                          <label class="form-label" for="typeName"
                            >Cardholder's Name</label
                          >
                        </div>

                        <div class="form-outline form-white mb-4">
                          <input
                            type="text"
                            id="typeText"
                            class="form-control form-control-lg"
                            size="17"
                            placeholder="1234 5678 9012 3457"
                            minlength="19"
                            maxlength="19"
                          />
                          <label class="form-label" for="typeText"
                            >Card Number</label
                          >
                        </div>

                        <div class="row mb-4">
                          <div class="col-md-6">
                            <div class="form-outline form-white">
                              <input
                                type="text"
                                id="typeExp"
                                class="form-control form-control-lg"
                                placeholder="MM/YYYY"
                                size="7"
                                minlength="7"
                                maxlength="7"
                              />
                              <label class="form-label" for="typeExp"
                                >Expiration</label
                              >
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-outline form-white">
                              <input
                                type="password"
                                id="typeText"
                                class="form-control form-control-lg"
                                placeholder="&#9679;&#9679;&#9679;"
                                size="1"
                                minlength="3"
                                maxlength="3"
                              />
                              <label class="form-label" for="typeText"
                                >Cvv</label
                              >
                            </div>
                          </div>
                        </div>
                      </form>

                      <hr class="my-4" />

                      {#await promise then data}
                        <div class="d-flex justify-content-between">
                          <p class="mb-2">Subtotal</p>
                          <p class="mb-2">${subtotal.toFixed(2)}</p>
                        </div>

                        <div class="d-flex justify-content-between">
                          <p class="mb-2">Shipping</p>
                          <p class="mb-2">$00.00</p>
                        </div>

                        <div class="d-flex justify-content-between mb-4">
                          <p class="mb-2">Total(Incl. taxes)</p>
                          <p class="mb-2">${subtotal.toFixed(2)}</p>
                        </div>

                        <button
                          type="button"
                          class="btn btn-info btn-block btn-lg"
                        >
                          <div class="d-flex justify-content-between">
                            <span
                              >${subtotal.toFixed(2)}
                              Checkout
                              <i
                                class="fas fa-long-arrow-alt-right ms-2"
                              /></span
                            >
                          </div>
                        </button>
                      {/await}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  .scroll {
    height: 57.5rem;
    overflow-y: scroll;
  }

  .scrollSection {
    height: 900px;
    overflow-y: scroll;
  }

  button {
    color: darksalmon;
    border: 2px solid darksalmon;
    background-color: white;
  }

  button:hover {
    background-color: darksalmon;
    transition: 0.7s;
  }

  .bg-custom {
    background-color: rgba(233, 150, 122, 0.882);
  }
</style>
