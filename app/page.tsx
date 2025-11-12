import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>Welcome to My Next.js App</h1>
                <p>This is the main page of the application.</p>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;