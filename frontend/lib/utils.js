import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Format date
export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Get auth user from localStorage
export function getAuthUser() {
  if (typeof window !== 'undefined') {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
        return null;
      }
    }
  }
  return null;
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getAuthUser();
}

// Check if user is admin
export function isAdmin() {
  const user = getAuthUser();
  return user?.isAdmin === true;
}

// Simple form validation helper
export function validateForm(form, rules) {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = form[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
    }
    
    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
    }
    
    if (fieldRules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors[field] = `${field} must be a valid email address`;
      }
    }
    
    if (fieldRules.match && value) {
      if (value !== form[fieldRules.match]) {
        errors[field] = `${field} does not match ${fieldRules.match}`;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Debounce function for search inputs
export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}