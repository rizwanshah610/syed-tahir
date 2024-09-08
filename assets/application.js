document.addEventListener('DOMContentLoaded', function () {
    // Show popup when the plus button is clicked
    document.querySelectorAll('.plus-icon').forEach(function (icon) {
        icon.addEventListener('click', function () {
            const popupId = icon.getAttribute('data-popup-id');
            const popup = document.getElementById(popupId);

            if (popup) {
                popup.classList.remove('hidden'); // Show popup
                document.body.classList.add('overflow-hidden'); // Optionally stop body scrolling
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
            }
        });
    });

    // Event listener for color selection
    document.querySelectorAll('.color-button').forEach(function (colorButton) {
        colorButton.addEventListener('click', function () {
            selectedColor = colorButton.getAttribute('data-variant-color');
            selectedVariantId = colorButton.getAttribute('data-variant-id'); // Save variant ID

            // Highlight selected color and reset other buttons
            document.querySelectorAll('.color-button').forEach(function (btn) {
                if (btn.getAttribute('data-variant-color') === selectedColor) {
                    btn.classList.add('bg-black', 'text-white');
                    btn.classList.remove('bg-white', 'text-black');
                } else {
                    btn.classList.add('bg-white', 'text-black');
                    btn.classList.remove('bg-black', 'text-white');
                }
            });

            console.log('Selected Color:', selectedColor); // Debugging
            updateAddToCartState();
        });
    });

    // Event listener for size selection
    document.querySelectorAll('.size-select').forEach(function (sizeSelect) {
        sizeSelect.addEventListener('change', function () {
            selectedSize = sizeSelect.options[sizeSelect.selectedIndex].getAttribute('data-size');
            selectedVariantId = sizeSelect.value; // Update variant ID for selected size

            console.log('Selected Size:', selectedSize); // Debugging
            updateAddToCartState();
        });
    });

    // Enable or disable Add to Cart button based on selections
    function updateAddToCartState() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

        if (selectedColor && selectedSize && selectedVariantId) {
            addToCartButtons.forEach(button => {
                button.removeAttribute('disabled'); // Enable button if both color and size are selected
                console.log('Add to Cart Button Enabled');
            });
        } else {
            addToCartButtons.forEach(button => {
                button.setAttribute('disabled', true); // Disable button if incomplete selection
                console.log('Add to Cart Button Disabled');
            });
        }
    }

    // Add product to cart when Add to Cart button is clicked
    document.querySelectorAll('.add-to-cart-button').forEach(function (addToCartButton) {
        console.log('Binding click event for Add to Cart Button'); // Debugging

        addToCartButton.addEventListener('click', function () {
            console.log('Add to Cart Button Clicked'); // Debugging

            if (selectedVariantId) {
                console.log('Adding product to cart:', selectedVariantId);

                const data = {
                    items: [
                        {
                            id: selectedVariantId, // Use the selected variant ID
                            quantity: 1,
                        },
                    ],
                };

                // Add product to cart
                fetch('/cart/add.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                    .then(response => {
                        console.log('Response Status:', response.status); // Debugging
                        if (!response.ok) {
                            throw new Error('Network response was not ok.');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Product added to cart:', data);
                        updateCart(); // Call function to update cart display
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

    // Function to update the cart display
    function updateCart() {
        fetch('/cart.js')
            .then(response => response.json())
            .then(cart => {
                console.log('Cart updated:', cart);
                // Optionally update cart UI here
            })
            .catch(error => {
                console.error('Error fetching cart:', error);
            });
    }
});
