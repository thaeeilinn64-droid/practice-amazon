import {cart,removeFromCart,updateDeliveryOption} from '../data/cart.js';// importing updateDeliveryOption
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import  {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';// importing dayjs from the internet
import  {deliveryOptions} from '../data/deliveryOptions.js'; //importing deliveryOptions to checkout.js ,44

hello();
// calculate delivery date ,11
const today = dayjs();// create dayjs and keep in a variable(today)
const deliveryDate = today.add(7,'days');//adding 7 days to dayjs(today) and keep in a variable(deliveryDate)
deliveryDate.format('dddd, MMMM D'); // format that adding date (deliveryDate)
// calculate delivery date

/* 
  Main idea of javaScript
  1.Save the data
  2.Generate the html
  3.Make it interactive
*/
//for regenetating the html
function renderOrderSummary (){

let cartSummaryHTML = '';

cart.forEach((cartItem)=>{

  const productId = cartItem.productId;
  let matchingProduct;
  products.forEach((product)=>{
    if(product.id === productId){
      matchingProduct = product;
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId;// gettting full delivery option, 122
  let deliveryOption; 
  // use this id to find the full delivery options
  //1.loop through 2. looking matching id 3.save inside variable
  deliveryOptions.forEach((option) => {
    if(option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
// 133
  const today = dayjs();
  const deliveryDate = today.add(
    deliveryOption.deliveryDays,
    'days'
  );
  const dateString = deliveryDate.format(
    'dddd, MMMM D'
  )

  cartSummaryHTML +=
  `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  ${(formatCurrency(matchingProduct.priceCents))}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id ="${matchingProduct.id} ">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct,cartItem)} ,100
              </div>
            </div>
          </div>
  `;
});
// Generating HTML
/*
  1.Loop through deliveryOptions
  2.For each option, generate some HTML
  3.Combine the HTML together
*/
function deliveryOptionsHTML(matchingProduct,cartItem) {
  let html = ''; // combining html together, 99
  //loop through delivery options ,55
  deliveryOptions.forEach((deliveryOption) => {
    //claculate delivery date, 77
    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    )

    // calculating price for delivery options, 88
    const priceString = deliveryOption.priceCents === 0 ? 'Free' : `$${formatCurrency(deliveryOption.priceCents)} - `;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId; // we only want it to be checked if it matches the delivery optionId that is save in the cart , 111
    html +=

    // generating html for delivery options, 66
    `<div class="delivery-option js-delivery-option" data-product-id = "${matchingProduct.id}" data-delivery-option-id = "${deliveryOption.id}">
      <input type="radio" ${isChecked ? 'Checked': ''} // check attribute make selector checked
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString} 
        </div>
        <div class="delivery-option-price">
          ${priceString} Shipping
        </div>
      </div>
    </div>`
  });
  return html; // have to return
}

document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click',() => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-contianer-${productId}`);
      container.remove();
    });
  });
//adding evnet listener for each options,155
  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click',() => {
        const {productId,deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId,deliveryOptionId); //166
        renderOrderSummary();// after updating deliveryOptionId , regenerating html,,166
        // recursion == a function can call / re-run itself
      });
   });

}

renderOrderSummary();