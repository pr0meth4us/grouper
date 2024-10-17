import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../api/axiosConfig';

const AddStudentList = () => {
    const [nameList, setNameList] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const addStudents = async () => {
        try {
            const names = nameList.split(/\r?\n/).filter(name => name.trim() !== '');
            const formattedNames = names.map(name => {
                const parts = name.split(/\s+/);
                return parts.map(part =>
                    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                ).join(' ');
            });

            await Promise.all(
                formattedNames.map(name => studentApi.createStudent({ name }))
            );
            navigate('/list');
        } catch (err) {
            setError('Failed to add students. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addStudents();
    };

    return (
        <section className="shadow rounded p-5 my-8 mx-md-8">
            <div className="row">
                <div className="col-md-6 col-12">
                    <h1>Add A Whole List</h1>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="list">List goes here</label>
                    <textarea
                        className="form-control"
                        cols="50"
                        rows="5"
                        id="list"
                        placeholder="Enter names (one per line)"
                        value={nameList}
                        onChange={(e) => setNameList(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </form>
        </section>
    );
};

export default AddStudentList;