document.addEventListener('DOMContentLoaded', function () {
  let selectedColor = '';
  let selectedSize = '';
  let selectedVariantId = '';
  const variants = {}; // Object to map (color, size) to variant ID

  // Show popup when the plus button is clicked
  document.querySelectorAll('.plus-icon').forEach(function (icon) {
      icon.addEventListener('click', function () {
          const popupId = icon.getAttribute('data-popup-id');
          console.log('Popup ID:', popupId); // Debugging

          const popup = document.getElementById(popupId);

          if (popup) {
              popup.classList.remove('hidden'); // Show popup
              document.body.classList.add('overflow-hidden'); // Optionally stop body scrolling
              console.log('Popup displayed');
          } else {
              console.error('Popup not found for ID:', popupId); // Error if popup is not found
          }
      });
  });

  // Hide popup when the close button is clicked
  document.querySelectorAll('.close-popup').forEach(function (button) {
      button.addEventListener('click', function () {
          const popupOverlay = button.closest('.popup-overlay');

          if (popupOverlay) {
              popupOverlay.classList.add('hidden'); // Hide popup
              document.body.classList.remove('overflow-hidden'); // Optionally resume body scrolling
              console.log('Popup hidden');
          } else {
              console.error('Popup overlay not found');
          }
      });
  });

  // Populate variants mapping (example, adjust as necessary)
  document.querySelectorAll('.color-button').forEach(function (colorButton) {
      const variantId = colorButton.getAttribute('data-variant-id');
      const color = colorButton.getAttribute('data-variant-color');
      const size = colorButton.getAttribute('data-variant-size'); // Ensure this is correct
      
      if (!variantId || !color || !size) {
          console.error('Missing data on color button', { variantId, color, size });
          return;
      }

      // Map color and size to variant ID
      variants[`${color}-${size}`] = variantId;

      colorButton.addEventListener('click', function () {
          selectedColor = color;
          // Update color button styles
          document.querySelectorAll('.color-button').forEach(function (btn) {
              if (btn.getAttribute('data-variant-color') === selectedColor) {
                  btn.classList.add('bg-black', 'text-white');
                  btn.classList.remove('bg-white', 'text-black');
              } else {
                  btn.classList.add('bg-white', 'text-black');
                  btn.classList.remove('bg-black', 'text-white');
              }
          });

          console.log('Selected Color:', selectedColor);
          updateSelectedVariantId();
          updateAddToCartState();
      });
  });

  document.querySelectorAll('.size-select').forEach(function (sizeSelect) {
      sizeSelect.addEventListener('change', function () {
          selectedSize = sizeSelect.options[sizeSelect.selectedIndex].getAttribute('data-size');
          const variantId = sizeSelect.value; // Assuming variant ID is stored as value
          
          // Ensure variantId is correctly captured
          console.log('Size Selected Variant ID:', variantId);

          // Update the variant ID based on size
          selectedVariantId = variantId;

          console.log('Selected Size:', selectedSize);
          updateSelectedVariantId();
          updateAddToCartState();
      });
  });

  function updateSelectedVariantId() {
      // Update selectedVariantId based on selected color and size
      selectedVariantId = variants[`${selectedColor}-${selectedSize}`];
      console.log('Updated Variant ID:', selectedVariantId);
  }

  function updateAddToCartState() {
      const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

      if (selectedColor && selectedSize && selectedVariantId) {
          addToCartButtons.forEach(button => {
              button.removeAttribute('disabled');
              console.log('Add to Cart Button Enabled');
          });
      } else {
          addToCartButtons.forEach(button => {
              button.setAttribute('disabled', true);
              console.log('Add to Cart Button Disabled');
          });
      }
  }

  document.querySelectorAll('.add-to-cart-button').forEach(function (addToCartButton) {
      console.log('Binding click event for Add to Cart Button');

      addToCartButton.addEventListener('click', function () {
          console.log('Add to Cart Button Clicked');

          if (selectedVariantId) {
              console.log('Adding product to cart:', selectedVariantId);

              const data = {
                  items: [
                      {
                          id: selectedVariantId,
                          quantity: 1,
                      },
                  ],
              };

              fetch('/cart/add.js', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                  },
                  body: JSON.stringify(data),
              })
                  .then(response => {
                      console.log('Response Status:', response.status);
                      if (!response.ok) {
                          throw new Error('Network response was not ok.');
                      }
                      return response.json();
                  })
                  .then(data => {
                      console.log('Product added to cart:', data);
                      updateCart();
                      alert('Product added to cart successfully!');
                  })
                  .catch(error => {
                      console.error('Error adding product to cart:', error);
                      alert('Error adding product to cart. Please try again.');
                  });
          } else {
              alert('Please select both color and size before adding to the cart.');
          }
      });
  });

  function updateCart() {
      fetch('/cart.js')
          .then(response => response.json())
          .then(cart => {
              console.log('Cart updated:', cart);
          })
          .catch(error => {
              console.error('Error fetching cart:', error);
          });
  }
});
