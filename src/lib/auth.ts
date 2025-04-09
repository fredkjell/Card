
import { toast } from "@/components/ui/use-toast";

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const USERS_STORAGE_KEY = 'lyric-locker-users';
const CURRENT_USER_KEY = 'lyric-locker-current-user';
const ADMIN_PASSWORD = 'admin123'; // This would be better stored securely in a real app

// Initialize with admin user if no users exist
export const initializeUsers = (): void => {
  const users = getUsers();
  
  if (users.length === 0) {
    // Create default admin user
    const adminUser: User = {
      id: 'admin-1',
      username: 'admin',
      displayName: 'Administrator',
      email: 'admin@example.com',
      isAdmin: true,
      createdAt: new Date().toISOString()
    };
    
    saveUsers([adminUser]);
  }
};

export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  if (!usersJson) return [];
  
  try {
    return JSON.parse(usersJson);
  } catch (error) {
    console.error('Failed to parse users from localStorage', error);
    return [];
  }
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Failed to parse current user from localStorage', error);
    return null;
  }
};

export const saveCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const registerUser = (
  username: string, 
  displayName: string, 
  email: string, 
  password: string
): User | null => {
  const users = getUsers();
  
  // Check if username or email already exists
  if (users.some(u => u.username === username)) {
    toast({
      title: "Registration failed",
      description: "Username already exists",
      variant: "destructive"
    });
    return null;
  }
  
  if (users.some(u => u.email === email)) {
    toast({
      title: "Registration failed",
      description: "Email already in use",
      variant: "destructive"
    });
    return null;
  }
  
  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    username,
    displayName,
    email,
    isAdmin: false, // Default to non-admin
    createdAt: new Date().toISOString()
  };
  
  // Save the user to localStorage
  saveUsers([...users, newUser]);
  
  // Store password separately for authentication
  localStorage.setItem(`user-password-${newUser.id}`, password);
  
  toast({
    title: "Registration successful",
    description: "Your account has been created"
  });
  
  return newUser;
};

export const loginUser = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.username === username);
  
  if (!user) {
    toast({
      title: "Login failed",
      description: "User not found",
      variant: "destructive"
    });
    return null;
  }
  
  const storedPassword = localStorage.getItem(`user-password-${user.id}`);
  if (password !== storedPassword) {
    toast({
      title: "Login failed",
      description: "Incorrect password",
      variant: "destructive"
    });
    return null;
  }
  
  saveCurrentUser(user);
  toast({
    title: "Login successful",
    description: `Welcome back, ${user.displayName}`
  });
  
  return user;
};

export const logoutUser = (): void => {
  saveCurrentUser(null);
  toast({
    title: "Logged out",
    description: "You have been successfully logged out"
  });
};

export const validateAdminPassword = (password: string): boolean => {
  return password === ADMIN_PASSWORD;
};

export const toggleUserAdminStatus = (userId: string): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return false;
  
  users[userIndex].isAdmin = !users[userIndex].isAdmin;
  saveUsers(users);
  
  // If the toggled user is the current user, update current user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    saveCurrentUser(users[userIndex]);
  }
  
  return true;
};

export const deleteUser = (userId: string): boolean => {
  const users = getUsers();
  const updatedUsers = users.filter(u => u.id !== userId);
  
  if (updatedUsers.length === users.length) return false;
  
  saveUsers(updatedUsers);
  
  // If deleted user is current user, log out
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    logoutUser();
  }
  
  return true;
};
