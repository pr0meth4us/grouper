import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../api/axiosConfig';

const AddStudent = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await studentApi.createStudent({ name });
            navigate('/list');
        } catch (err) {
            setError('Failed to add student. Please try again.');
        }
    };

    return (
        <section className="shadow rounded p-5 my-8 mx-md-8">
            <h1>Add New Student</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="name">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </form>
        </section>
    );
};

export default AddStudent;