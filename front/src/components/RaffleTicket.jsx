import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import './css/RaffleTicket.css';

function SelectedNumbers({ selectedNumbers }) {
  return (
    <span>
      {selectedNumbers.length > 0 && (
        <>
          {selectedNumbers.join(', ')}
        </>
      )}
    </span>
  );
}

function RaffleTicket() {

  const qtdNumeros = 200;

  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [soldNumbers, setSoldNumbers] = useState([12, 24, 35, 46, 57]);
  const [customerData, setCustomerData] = useState({ name: '', phone: '' });
  
  const handleInputChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleNumberClick = (number) => {
    if (soldNumbers.includes(number)) {
      return;
    }

    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const hasSelectedNumbers = selectedNumbers.length > 0;

  return (
    <div className="raffle-container">
      <div className="raffle-ticket">
        <h1>
          Raffle Ticket{' '}
          <span style={{ float: 'right' }}>
            <SelectedNumbers selectedNumbers={selectedNumbers} />
          </span>
        </h1>
        <div className="numbers">
          {Array.from({ length: qtdNumeros }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              variant={selectedNumbers.includes(number) ? 'success' : 'default'}
              disabled={soldNumbers.includes(number)}
              className={selectedNumbers.includes(number) ? 'selected-number' : ''}
              onClick={() => handleNumberClick(number)}
              style={{ width: '55px' }}
            >
              {number}
            </Button>
          ))}
        </div>
        <form className="customer-data">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerData.name}
            onChange={handleInputChange}
          />
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={customerData.phone}
            onChange={handleInputChange}
          />
        </form>
      </div>

      {hasSelectedNumbers && (
        <Button
          className="following-button"
          variant={'primary'}
        >
          Seguir
        </Button>
      )}
    </div>
  );
}

export default RaffleTicket;