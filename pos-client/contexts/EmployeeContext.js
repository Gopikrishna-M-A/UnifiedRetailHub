"use client"

import React, { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};

export const EmployeeProvider = ({ children }) => {
  const [currentEmployee, setCurrentEmployee] = useState(null);

  return (
    <EmployeeContext.Provider value={{ currentEmployee, setCurrentEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};