<!-- OrderTracker.svelte -->
<script>
    import { orderStatus } from './orderStatus.js';
    let orderId = '';
    let orderStatusValue = '';
  
    function trackOrder() {
      // Simulating asynchronous order tracking
      setTimeout(() => {
        const status = Math.random() < 0.5 ? 'In Transit' : 'Delivered';
        orderStatus.set(status);
      }, 2000);
    }
  </script>
  
  <div>
    <h2>Order Tracker</h2>
    <form on:submit|preventDefault="{trackOrder}">
      <label for="orderId">Order ID:</label>
      <input type="text" id="orderId" bind:value="{orderId}" />
      <button type="submit">Track</button>
    </form>
    <p>{orderStatusValue}</p>
  </div>
  