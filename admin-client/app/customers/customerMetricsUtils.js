// Utility functions for calculating customer metrics

export const calculateTotalSpend = (orders) => {
  return orders.reduce((total, order) => total + order.totalAmount, 0);
};

export const calculateAverageOrderValue = (orders) => {
  const totalSpend = calculateTotalSpend(orders);
  return orders.length > 0 ? totalSpend / orders.length : 0;
};

export const getOrderCount = (orders) => {
  return orders.length;
};

export const getLastPurchaseDate = (orders) => {
  if (orders.length === 0) return null;
  return new Date(Math.max(...orders.map(order => new Date(order.orderDate))));
};

export const getRecentOrders = (orders, limit = 5) => {
  return orders
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, limit)
    .map(order => ({
      date: new Date(order.orderDate).toISOString().split('T')[0],
      amount: order.totalAmount
    }));
};

export const determineLoyaltyTier = (totalSpend) => {
  if (totalSpend >= 5000) return 'Gold';
  if (totalSpend >= 1000) return 'Silver';
  return 'Bronze';
};