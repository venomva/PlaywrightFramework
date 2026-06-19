/**
 * Test data for the Testver Playground application.
 * Centralized here for easy maintenance and reuse.
 */

export const LOGIN_CREDENTIALS = {
  valid: {
    admin: { username: 'admin', password: 'admin123' },
    tester: { username: 'tester', password: 'test123' },
    manager: { username: 'manager', password: 'manager123' },
  },
  invalid: {
    wrongPassword: { username: 'admin', password: 'wrongpassword' },
    wrongUsername: { username: 'wronguser', password: 'admin123' },
    empty: { username: '', password: '' },
  },
} as const;

export const OTP_DATA = {
  valid: '123456',
  invalid: '000000',
} as const;

export const APP_URLS = {
  home: '/',
  login: '/auth/login',
  signup: '/auth/signup',
  twoFactor: '/auth/2fa',
  forms: '/forms',
  elements: '/elements',
  tables: '/tables',
  widgets: '/widgets',
  dynamic: '/dynamic',
  ajax: '/ajax',
  shop: '/shop',
  frames: '/frames',
} as const;

export const SIGNUP_DATA = {
  valid: {
    fullName: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@testver.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  },
  shortUsername: {
    fullName: 'Jane Smith',
    username: 'ab', // less than 3 characters
    email: 'jane.smith@testver.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  },
  invalidEmail: {
    fullName: 'Jane Smith',
    username: 'janesmith',
    email: 'invalid-email',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  },
  weakPassword: {
    fullName: 'Jane Smith',
    username: 'janesmith',
    email: 'jane.smith@testver.com',
    password: 'short',
    confirmPassword: 'short',
  },
  mismatchedPassword: {
    fullName: 'Jane Smith',
    username: 'janesmith',
    email: 'jane.smith@testver.com',
    password: 'Password123!',
    confirmPassword: 'DifferentPassword!',
  },
} as const;

export const SHOP_URLS = {
  shop: '/shop',
  cart: '/shop/cart',
} as const;

export const PRODUCT_IDS = [1, 2, 3, 4, 5] as const;

export const MESSAGES = {
  loginPageTitle: 'Sign in · TestverQA',
  homePageTitle: 'Home · TestverQA',
  twoFactorPageTitle: '2FA · TestverQA',
  signupPageTitle: 'Sign up · TestverQA',
  invalidCredentials: 'Invalid credentials',
  welcomeHeading: 'Welcome back 👋',
  signupHeading: 'Create account',
  homeHeading: 'A complete playground for test automation',
  youTypedPrefix: 'You typed:',
  // Validation messages
  usernameMinLength: 'Username must be at least 3 characters',
  emailInvalid: 'Valid email required',
  passwordMinLength: 'Password must be at least 8 characters',
  termsRequired: 'You must accept the terms',
} as const;