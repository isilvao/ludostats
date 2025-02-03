'use client';
import React from 'react';

const MyComponent = () => {
  const handleButtonClick1 = () => {
    console.log('Button 1 clicked');
  };

  const handleButtonClick2 = () => {
    console.log('Button 2 clicked');
  };

  return (
    <div>
      <button onClick={handleButtonClick1}>Button 1</button>
      <button onClick={handleButtonClick2}>Button 2</button>
    </div>
  );
};

export default MyComponent;
