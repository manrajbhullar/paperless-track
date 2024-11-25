import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import SignUp from './pages/Auth/SignUp';
import SignIn from './pages/Auth/SignIn';
import Navbar from './components/Navbar'; 
import Analytics from './pages/Analytics/Analytics';
import Categories from './pages/Categories/Categories';
import UserProfile from './pages/UserProfile/UserProfile';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Dashboard from './pages/MainPage/MainPage'; 
import './styles/style.css'; 
import ManualUpload from './pages/MainPage/components/ManualEntry';
import LandingPage from './pages/LandingPage/LandingPage';  // Import the Header (landing page)
import ErrorBoundary from './ErrorBoundary'; // Adjust the import path as necessary

const App = () => {
    const [isSignUp, setIsSignUp] = useState(false); 
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    // Monitor user authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe(); 
    }, []);

    // Loading state while checking authentication
    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <ErrorBoundary>
            <Router>
                <div className="app-container">
                    {/* Render Navbar only if user is authenticated */}
                    <Navbar isAuthenticated={!!user} />
                    <Routes>
                        {/* Default route to LandingPage (Landing Page) when user is not authenticated */}
                        <Route 
                            path="/" 
                            element={user ? <Navigate to="/dashboard" /> : <LandingPage />} 
                        />
                        
                        {/* Sign Up and Sign In routes */}
                        <Route path="/signin" element={<SignIn toggleForm={toggleForm} />} />
                        <Route path="/signup" element={<SignUp toggleForm={toggleForm} />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} /> 

                        {/* Protected routes that require authentication */}
                        <Route 
                            path="/dashboard" 
                            element={user ? <Dashboard user={user} /> : <Navigate to="/signin" />} 
                        />
                        <Route 
                            path="/analytics" 
                            element={user ? <Analytics user={user} /> : <Navigate to="/signin" />} 
                        />
                        <Route 
                            path="/categories" 
                            element={user ? <Categories user={user} /> : <Navigate to="/signin" />} 
                        />
                        <Route 
                            path="/profile" 
                            element={user ? <UserProfile /> : <Navigate to="/signin" />} 
                        />
                        <Route 
                            path="/manual-upload" 
                            element={user ? <ManualUpload user={user} /> : <Navigate to="/signin" />} 
                        />
                    </Routes>
                </div>
            </Router>
        </ErrorBoundary>
    );
};

export default App;
