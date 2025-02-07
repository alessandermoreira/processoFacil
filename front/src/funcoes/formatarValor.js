import React from "react";

const formatCurrency = (value)  => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
}

export default formatCurrency