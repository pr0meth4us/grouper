import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi } from '../api/axiosConfig';

const EditStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const fetchStudent = async () => {
        try {
            const response = await studentApi.getStudentById(id);
            setName(response.data.name);
        } catch (err) {
            setError('Failed to fetch student details.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await studentApi.updateStudent(id, { name });
            navigate('/list');
        } catch (err) {
            setError('Failed to update student.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <section className="shadow rounded p-5 my-8 mx-md-8">
            <h1>Edit student name</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="col-sm-8 mb-3">
                    <label className="form-label" htmlFor="name">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
        </section>
    );
};

export default EditStudent;
