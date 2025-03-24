$('.quantity_inner .bt_minus').click(function () {
    let $input = $(this).parent().find('.quantity');
    let count = parseInt($input.val()) - 1;
    count = count < 1 ? 1 : count;
    $input.val(count);
});
$('.quantity_inner .bt_plus').click(function () {
    let $input = $(this).parent().find('.quantity');
    let count = parseInt($input.val()) + 1;
    count = count > parseInt($input.data('max-count')) ? parseInt($input.data('max-count')) : count;
    $input.val(parseInt(count));
});
$('.quantity_inner .quantity').bind("change keyup input click", function () {
    if (this.value.match(/[^0-9]/g)) {
        this.value = this.value.replace(/[^0-9]/g, '');
    }
    if (this.value == "") {
        this.value = 1;
    }
    if (this.value > parseInt($(this).data('max-count'))) {
        this.value = parseInt($(this).data('max-count'));
    }
}); 

document.addEventListener('DOMContentLoaded', () => {
    const popups = document.querySelectorAll('.overlay');
  
    popups.forEach((popup) => {
     const popupId = popup.id.replace('popup', '');
     const btMinus = popup.querySelector('.bt_minus');
     const btPlus = popup.querySelector('.bt_plus');
     const quantityInput = popup.querySelector('.quantity');
     const btBuy = popup.querySelector('.bt_buy');
     const cakeName = popup.querySelector('.name_cake_popup').textContent;
     const cakePriceText = popup.querySelector('.price_popup').textContent;
     const cakeImageSrc = popup.querySelector('img').src;
  
     let quantity = parseInt(quantityInput.value);
     const maxCount = parseInt(quantityInput.dataset.maxCount);
  
     let cakePrice; // Store initial cake price
     const getCakePrice = () => {
      let priceText = cakePriceText.replace('ОТ ', '').replace(' ₽', '');
      if (priceText.includes('-')) {
       priceText = priceText.split('-')[0];
      }
      return parseFloat(priceText);
     };
     cakePrice = getCakePrice(); // initialize
  
     // Update total price in basket item
     const updatebasketItem = () => {
      return {
       id: popupId, // Include the popup ID
       name: cakeName,
       price: cakePrice,
       quantity: quantity,
       image: cakeImageSrc,
       totalPrice: cakePrice * quantity,
      };
     };
  
     // Function to save/update basket in localStorage
     const savebasket = (basket) => {
      localStorage.setItem('basket', JSON.stringify(basket));
     };
  
     btMinus.addEventListener('click', () => {
      if (quantity > 1) {
       quantity--;
       quantityInput.value = quantity;
       cakePrice = getCakePrice();
      }
     });
  
     btPlus.addEventListener('click', () => {
      if (quantity < maxCount) {
       quantity++;
       quantityInput.value = quantity;
       cakePrice = getCakePrice();
      }
     });
  
     btBuy.addEventListener('click', () => {
      quantity = parseInt(quantityInput.value);
      const basketItem = updatebasketItem();
  
      let basket = JSON.parse(localStorage.getItem('basket') || '[]');
  
      // Check if the item is already in the basket:
      const existingItemIndex = basket.findIndex((item) => item.id === basketItem.id);
  
      if (existingItemIndex !== -1) {
       // If the item is already in the basket, update the quantity and totalPrice:
       basket[existingItemIndex].quantity = basketItem.quantity;
       basket[existingItemIndex].totalPrice = basketItem.totalPrice;
      } else {
       // If the item is not in the basket, add it:
       basket.push(basketItem);
      }
  
      savebasket(basket);
      window.location.href = 'basket.html';
     });
  
     // Refresh basket value to be consistent
     quantityInput.addEventListener('change', () => {
      quantity = parseInt(quantityInput.value);
      if (isNaN(quantity) || quantity < 1) {
       quantity = 1;
       quantityInput.value = quantity;
      } else if (quantity > maxCount) {
       quantity = maxCount;
       quantityInput.value = quantity;
      }
      cakePrice = getCakePrice(); // update new price
     });
    });
   });