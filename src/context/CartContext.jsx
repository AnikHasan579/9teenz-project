import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 🔥 Add to Cart (Stock Check shoho)
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(
        (item) => 
          (item._id || item.id) === (product._id || product.id) && 
          item.size === product.size
      );
      
      // Size onujayi stock ber koro
      const sizeData = product.sizes?.find(s => s.size === product.size);
      const maxStock = sizeData ? sizeData.stock : 0;

      if (exists) {
        // Stock limit check
        if (exists.quantity + 1 > maxStock) {
          alert(`Sorry, only ${maxStock} items available for size ${product.size}!`);
          return prev; // Quantity barabe na
        }

        return prev.map((item) =>
          (item._id || item.id) === (product._id || product.id) && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Prothom bar add er somoy stock check
      if (maxStock <= 0) {
        alert(`Out of Stock for size ${product.size}!`);
        return prev;
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 🔥 Remove from Cart
  const removeFromCart = (id, size) => {
    setCart((prev) => prev.filter((item) => 
      !((item._id || item.id) === id && item.size === size)
    ));
  };

  // 🔥 Increase Qty (Stock Check shoho)
  const increaseQty = (id, size) => {
    setCart((prev) =>
      prev.map((item) => {
        if ((item._id || item.id) === id && item.size === size) {
          const sizeData = item.sizes?.find(s => s.size === size);
          const maxStock = sizeData ? sizeData.stock : 0;

          if (item.quantity + 1 > maxStock) {
            alert(`Stock limit reached! Max ${maxStock} items available for size ${size}.`);
            return item; // Quantity barabe na
          }

          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  // 🔥 Decrease Qty
  const decreaseQty = (id, size) => {
    setCart((prev) =>
      prev
        .map((item) =>
          (item._id || item.id) === id && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}