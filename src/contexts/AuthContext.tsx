
import React, { createContext, useContext, useEffect, useState } from "react";
import api, { User, LoginData, RegisterData } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      const response = await api.login(data);
      
      if (response.success && response.user) {
        setUser(response.user);
        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.register(data);
      
      if (response.success) {
        toast.success("Registration successful. Please log in.");
        return true;
      } else {
        toast.error(response.message || "Registration failed");
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        register,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
