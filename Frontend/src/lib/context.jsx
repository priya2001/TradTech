import { createContext, useContext, useState, useEffect } from "react";

// Mock data
const mockUsers = [
  { id: "1", name: "Admin User", email: "admin@example.com", role: "admin" },
  {
    id: "2",
    name: "Shop Owner 1",
    email: "shop1@example.com",
    role: "shopkeeper",
  },
  {
    id: "3",
    name: "Shop Owner 2",
    email: "shop2@example.com",
    role: "shopkeeper",
  },
  {
    id: "4",
    name: "Customer 1",
    email: "customer1@example.com",
    role: "customer",
  },
  {
    id: "5",
    name: "Customer 2",
    email: "customer2@example.com",
    role: "customer",
  },
];

const mockShops = [
  {
    id: "1",
    name: "Green Juice Haven",
    ownerId: "2",
    location: { lat: 28.6139, lng: 77.209 },
    address: "123 Green St, Delhi",
    rating: 4.5,
    machineId: "1",
    isApproved: true,
  },
  {
    id: "2",
    name: "Solar Sips",
    ownerId: "3",
    location: { lat: 28.6229, lng: 77.208 },
    address: "456 Solar Ave, Delhi",
    rating: 4.2,
    machineId: "2",
    isApproved: true,
  },
];

const mockMachines = [
  {
    id: "1",
    shopId: "1",
    batteryPercentage: 75,
    solarEfficiency: 0.8,
    isCharging: true,
    speed: 70,
    isPaymentMachineOn: true,
    isLightOn: false,
    fanSpeed: "medium",
  },
  {
    id: "2",
    shopId: "2",
    batteryPercentage: 45,
    solarEfficiency: 0.6,
    isCharging: true,
    speed: 60,
    isPaymentMachineOn: true,
    isLightOn: true,
    fanSpeed: "low",
  },
];

const mockOrders = [
  {
    id: "1",
    customerId: "4",
    shopId: "1",
    glassCount: 2,
    status: "completed",
    timestamp: Date.now() - 86400000,
  },
  {
    id: "2",
    customerId: "5",
    shopId: "1",
    glassCount: 1,
    status: "processing",
    timestamp: Date.now() - 3600000,
  },
];

const mockRegistrations = [
  {
    id: "1",
    shopkeeperId: "3",
    shopName: "Eco Juice Corner",
    address: "789 Eco Blvd, Delhi",
    location: { lat: 28.6329, lng: 77.2195 },
    machineId: "3",
    status: "pending",
    timestamp: Date.now() - 172800000,
  },
];

const AppContext = createContext({
  currentUser: null,
  users: [],
  shops: [],
  machines: [],
  orders: [],
  registrations: [],
  login: () => Promise.resolve(false),
  logout: () => {},
  signup: () => Promise.resolve(false),
  updateMachine: () => {},
  createOrder: () => "",
  updateOrderStatus: () => {},
  submitShopRegistration: () => "",
  approveShopRegistration: () => {},
  rejectShopRegistration: () => {},
  userLocation: null,
  setUserLocation: () => {},
  selectedShop: null,
  setSelectedShop: () => {},
  getShopById: () => undefined,
  getMachineByShopId: () => undefined,
});

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [shops, setShops] = useState(mockShops);
  const [machines, setMachines] = useState(mockMachines);
  const [orders, setOrders] = useState(mockOrders);
  const [registrations, setRegistrations] = useState(mockRegistrations);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);

  const SHOPKEEPER_API_BASE = "http://localhost:3000/api"; // update this if needed

  const signupShopkeeperAPI = async (payload) => {
    try {
      const res = await fetch(`${SHOPKEEPER_API_BASE}/shopkeepers/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      // console.log(data);
      if (res.ok && data) {
        return data; // ✅ Return full data if signup is successful
      } else {
        console.error("Signup failed:", data);
        return null; // ❌ Return null if signup failed
      }
    } catch (error) {
      console.error("Error during signup:", error);
      return null;
    }
  };

  const loginShopkeeperAPI = async (email, password) => {
    console.log(email, password);
    const res = await fetch(`${SHOPKEEPER_API_BASE}/shopkeepers/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMachines((prev) =>
        prev.map((machine) => {
          let batteryChange = 0;
          if (machine.isCharging)
            batteryChange += 0.05 * machine.solarEfficiency;
          if (machine.isPaymentMachineOn) batteryChange -= 0.001;
          if (machine.isLightOn) batteryChange -= 0.002;
          if (machine.fanSpeed === "low") batteryChange -= 0.003;
          else if (machine.fanSpeed === "medium") batteryChange -= 0.005;
          else if (machine.fanSpeed === "high") batteryChange -= 0.008;

          const newBattery = Math.max(
            0,
            Math.min(100, machine.batteryPercentage + batteryChange)
          );
          return { ...machine, batteryPercentage: newBattery };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const login = async (email, password, role) => {
    if (role === "shopkeeper") {
      // console.log(email);
      try {
        const data = await loginShopkeeperAPI(email, password);

        if (data.data.active === false) {
          alert("Approval pending ");
          return false;
        }
        const user = {
          role: "shopkeeper",
          data: data.data,
        };
        console.log(data);
        localStorage.setItem("token", data.token);

        setCurrentUser(user);
        return true;
      } catch (err) {
        console.error("Shopkeeper Login Error:", err);
        return false;
      }
    } else {
      // Customer or Admin Login with mock
      const user = users.find(
        (user) => user.email === email && user.role === role
      );
      if (user) {
        setCurrentUser(user);
        return true;
      }
      return false;
    }
  };

  const verifyToken = async (token) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const user = {
        role: data.user.role,
        data: { shopkeeper: { data: data.user } },
      };
      console.log(user);
      setCurrentUser(user);
      return { valid: true, data };
    } catch (err) {
      console.error("Error verifying token:", err);
      return { valid: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const signup = async (name, email, password, role) => {
    // Customer or Admin Signup with mock
    if (users.some((user) => user.email === email)) return false;

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const shopkeepersignup = async (payload) => {
    try {
      console.log(payload);
      const data = await signupShopkeeperAPI(payload);
      console.log(2);
      console.log(data);
      if (data.status === "success") {
        const newUser = {
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: "shopkeeper",
        };

        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Shopkeeper Signup Error:", err);
      return false;
    }
  };

  const updateMachine = (machineId, updates) => {
    setMachines((prev) =>
      prev.map((machine) =>
        machine.id === machineId ? { ...machine, ...updates } : machine
      )
    );
  };

  const createOrder = (customerId, shopId, glassCount) => {
    const orderId = `order-${Date.now()}`;
    const newOrder = {
      id: orderId,
      customerId,
      shopId,
      glassCount,
      status: "pending",
      timestamp: Date.now(),
    };
    setOrders((prev) => [...prev, newOrder]);
    return orderId;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const submitShopRegistration = (registration) => {
    const registrationId = `reg-${Date.now()}`;
    const newRegistration = {
      ...registration,
      id: registrationId,
      status: "pending",
      timestamp: Date.now(),
    };
    setRegistrations((prev) => [...prev, newRegistration]);
    return registrationId;
  };

  const approveShopRegistration = (registrationId) => {
    const registration = registrations.find((r) => r.id === registrationId);
    if (!registration) return;

    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === registrationId ? { ...reg, status: "approved" } : reg
      )
    );

    const newShop = {
      id: `shop-${Date.now()}`,
      name: registration.shopName,
      ownerId: registration.shopkeeperId,
      location: registration.location,
      address: registration.address,
      rating: 0,
      machineId: registration.machineId,
      isApproved: true,
    };

    setShops((prev) => [...prev, newShop]);

    if (!registration.machineId) {
      const newMachine = {
        id: `machine-${Date.now()}`,
        shopId: newShop.id,
        batteryPercentage: 100,
        solarEfficiency: 0.7,
        isCharging: true,
        speed: 50,
        isPaymentMachineOn: true,
        isLightOn: false,
        fanSpeed: "off",
      };
      setMachines((prev) => [...prev, newMachine]);
    }
  };

  const rejectShopRegistration = (registrationId) => {
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.id === registrationId ? { ...reg, status: "rejected" } : reg
      )
    );
  };

  const getShopById = (shopId) => {
    return shops.find((shop) => shop.id === shopId);
  };

  const getMachineByShopId = (shopId) => {
    return machines.find((machine) => machine.shopId === shopId);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        shops,
        machines,
        orders,
        registrations,
        login,
        logout,
        signup,
        shopkeepersignup,
        updateMachine,
        createOrder,
        updateOrderStatus,
        submitShopRegistration,
        approveShopRegistration,
        rejectShopRegistration,
        userLocation,
        setUserLocation,
        selectedShop,
        setSelectedShop,
        getShopById,
        getMachineByShopId,
        verifyToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
