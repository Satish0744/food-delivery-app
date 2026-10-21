import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/helpers";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadFromStorage("user", null));
  const [orders, setOrders] = useState(() => loadFromStorage("orders", []));

  useEffect(() => {
    saveToStorage("user", user);
  }, [user]);

  useEffect(() => {
    saveToStorage("orders", orders);
  }, [orders]);

  const login = (email, password) => {
    if (!email || !password) return { success: false, message: "Fill all fields" };
    // Simulated auth
    const existingUser = loadFromStorage("registeredUser", null);
    if (!existingUser)
      return {
        success: false,
        message: "No account found. Please sign up first.",
      };
    if (existingUser.email !== email || existingUser.password !== password)
      return { success: false, message: "Invalid credentials" };

    setUser({ name: existingUser.name, email: existingUser.email });
    return { success: true, message: "Logged in successfully" };
  };

  const signup = (name, email, password) => {
    if (!name || !email || !password)
      return { success: false, message: "Fill all fields" };
    if (password.length < 6)
      return { success: false, message: "Password must be 6+ characters" };

    saveToStorage("registeredUser", { name, email, password });
    setUser({ name, email });
    return { success: true, message: "Account created!" };
  };

  const logout = () => setUser(null);

  const placeOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, orders, placeOrder }}
    >
      {children}
    </AuthContext.Provider>
  );
};