import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="d-flex align-items-center justify-content-center min-h-screen">
            <header>
                <nav className="navbar bg-body-tertiary">
                    <div className="container-fluid logo">
                        <img src="/img/logo.png" alt="Logo" height="150" className="d-inline-block align-text-top" />
                    </div>
                </nav>
            </header>
            <div className="container d-flex align-items-center justify-content-center">
                <div className="wrapper">
                    <h2>Class E3.2 Grouping App</h2>
                    <div className="d-grid gap-2 mx-auto">
                        <Link to="/list" className="btn btn-dark">
                            Show the current list
                        </Link>
                        <Link to="/group" className="btn btn-dark">
                            Group Generator
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;