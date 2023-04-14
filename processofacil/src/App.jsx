import React, { useState } from 'react';
import axios from 'axios';
import ProcessosLicitatorios from './ProcessosLicitatorios';

function App() {

  const url = 'http://ec2-18-222-195-112.us-east-2.compute.amazonaws.com:3000';
  return (
    <div>
      <ProcessosLicitatorios
        url={url}
        ></ProcessosLicitatorios>

    </div>
  );
}

export default App;
