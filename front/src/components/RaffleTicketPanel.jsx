import React, { useState } from 'react';

function RaffleTicket() {
  const [cart, setCart] = useState([]);

  function selectNumber(number) {
    if (!cart.includes(number)) {
      setCart([...cart, number]);
    }
  }

  return (
    <div>
      {Array.from({ length: 1000 }, (_, i) => i + 1).map(number => (
        <button key={number} onClick={() => selectNumber(number)}>
          {number}
        </button>
      ))}
      <Cart cart={cart} />
    </div>
  );
}

function Cart({ cart }) {
  return <div>Your selected numbers: {cart.join(', ')}</div>;
}

export default RaffleTicket;