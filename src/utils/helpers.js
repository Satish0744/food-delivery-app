export const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

export const loadFromStorage = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage failed", e);
  }
};

export const generateOrderId = () =>
  "ORD" + Math.floor(100000 + Math.random() * 900000);

export const generateOtp = () =>
  Math.floor(1000 + Math.random() * 9000).toString();