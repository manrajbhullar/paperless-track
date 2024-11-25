import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '@testing-library/jest-dom'; // Import jest-dom matchers

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn(); // Return a mock unsubscribe function
  }),
  setPersistence: jest.fn().mockResolvedValue(),
  signInWithEmailAndPassword: jest.fn(),
  browserLocalPersistence: 'local',
}));

// Mock components
jest.mock('./components/Navbar', () => () => <div>Navbar</div>);
jest.mock('./pages/Auth/SignUp', () => () => <div>SignUp</div>);
jest.mock('./pages/Auth/SignIn', () => () => <div>SignIn</div>);
jest.mock('./pages/Auth/ForgotPassword', () => () => <div>ForgotPassword</div>);
jest.mock('./pages/MainPage/MainPage', () => () => <div>Dashboard</div>);
jest.mock('./pages/Analytics/Analytics', () => () => <div>Analytics</div>);
jest.mock('./pages/Categories/Categories', () => () => <div>Categories</div>);
jest.mock('./pages/UserProfile/UserProfile', () => () => <div>UserProfile</div>);
jest.mock('./pages/MainPage/components/ManualEntry', () => () => <div>ManualUpload</div>);
jest.mock('./pages/LandingPage/LandingPage', () => () => <div>LandingPage</div>);

// Mock BrowserRouter to avoid nested router issue
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    BrowserRouter: ({ children }) => <div>{children}</div>,
  };
});

describe('App', () => {
  beforeEach(() => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn(); // Return a mock unsubscribe function
    });
  });

  test('renders LandingPage when user is not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('LandingPage')).toBeInTheDocument();
  });

  test('renders Navbar when user is authenticated', () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ uid: '123' });
            return jest.fn(); // Return a mock unsubscribe function
        });
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Navbar')).toBeInTheDocument();
    });

    test('redirects to Dashboard when user is authenticated', () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ uid: '123' });
            return jest.fn(); // Return a mock unsubscribe function
        });
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    test('renders SignIn route', () => {
        render(
            <MemoryRouter initialEntries={['/signin']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('SignIn')).toBeInTheDocument();
    });

    test('renders SignUp route', () => {
        render(
            <MemoryRouter initialEntries={['/signup']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('SignUp')).toBeInTheDocument();
    });

    test('renders ForgotPassword route', () => {
        render(
            <MemoryRouter initialEntries={['/forgot-password']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('ForgotPassword')).toBeInTheDocument();
    });

    test('redirects to SignIn for protected routes when user is not authenticated', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('SignIn')).toBeInTheDocument();
    });

    test('renders Dashboard route when user is authenticated', () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ uid: '123' });
            return jest.fn(); // Return a mock unsubscribe function
        });
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    test('renders Analytics route when user is authenticated', () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ uid: '123' });
            return jest.fn(); // Return a mock unsubscribe function
        });
        render(
            <MemoryRouter initialEntries={['/analytics']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    test('renders Categories route when user is authenticated', () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ uid: '123' });
            return jest.fn(); // Return a mock unsubscribe function
        });
        render(
            <MemoryRouter initialEntries={['/categories']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Categories')).toBeInTheDocument();
    });

    test('renders UserProfile route when user is authenticated', () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ uid: '123' });
            return jest.fn(); // Return a mock unsubscribe function
        });
        render(
            <MemoryRouter initialEntries={['/profile']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('UserProfile')).toBeInTheDocument();
    });

    test('renders ManualUpload route when user is authenticated', () => {
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback({ uid: '123' });
            return jest.fn(); // Return a mock unsubscribe function
        });
        render(
            <MemoryRouter initialEntries={['/manual-upload']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('ManualUpload')).toBeInTheDocument();
    });
});