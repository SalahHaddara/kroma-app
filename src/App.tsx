import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ThemeProvider} from './services/contexts/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import React from 'react';
import AuthPage from "./pages/AuthPage";
import {AuthProvider} from "@/services/contexts/AuthContext";

// import About from './pages/About';
// import Privacy from './pages/Privacy';
// import Contact from './pages/Contact';

const App = () => {
    return (
        <ThemeProvider>
            <Router>
                <AuthProvider>
                    <div className="min-h-screen">
                        <Header/>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/login" element={<AuthPage isLogin={true}/>}/>
                            <Route path="/signup" element={<AuthPage isLogin={false}/>}/>

                            {/*<Route path="/about" element={<About/>}/>*/}
                            {/*<Route path="/privacy" element={<Privacy/>}/>*/}
                            {/*<Route path="/contact" element={<Contact/>}/>*/}
                        </Routes>
                        <Footer/>
                    </div>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
};

export default App;