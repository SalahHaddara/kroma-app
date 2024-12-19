import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ThemeProvider} from './services/contexts/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import React from 'react';
// import About from './pages/About';
// import Privacy from './pages/Privacy';
// import Contact from './pages/Contact';

const App = () => {
    return (
        <ThemeProvider>
            <Router>
                <div className="min-h-screen">
                    <Header/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        {/*<Route path="/about" element={<About/>}/>*/}
                        {/*<Route path="/privacy" element={<Privacy/>}/>*/}
                        {/*<Route path="/contact" element={<Contact/>}/>*/}
                    </Routes>
                    <Footer/>
                </div>
            </Router>
        </ThemeProvider>
    );
};

export default App;