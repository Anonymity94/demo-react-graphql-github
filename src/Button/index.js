import React from 'react';

const Button = ({ children, className, color = 'black', type = 'button', ...props }) => (
  <button className={`${className} Button Button_${color}`} type={type} {...props}>
    {children}
  </button>
);

export default Button;
