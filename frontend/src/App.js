// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingProvider } from './context/LoadingContext';
import Layout from './components/Layout';
import Home from "./pages/Home";
import StudentList from "./pages/StudentList";
import AddStudent from "./pages/AddStudent";
import AddStudentList from "./pages/AddStudentList";
import EditStudent from "./pages/EditStudent";
import GroupGenerator from "./pages/GroupGenerator";
import ExcludeSelection from "./pages/ExcludeSelection";
// ... import other components

const App = () => {
    return (
        <LoadingProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/list" element={<StudentList />} />
                        <Route path="/list/add" element={<AddStudent />} />
                        <Route path="/addlist/form" element={<AddStudentList />} />
                        <Route path="/list/edit/:id" element={<EditStudent />} />
                        <Route path="/group" element={<GroupGenerator />} />
                        <Route path="/exclude" element={<ExcludeSelection />} />
                    </Routes>
                </Layout>
            </Router>
        </LoadingProvider>
    );
};

export default App;