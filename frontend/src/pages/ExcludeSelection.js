import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupingApi, studentApi } from '../api/axiosConfig';

const ExcludeSelection = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await studentApi.getAllStudents();
            setStudents(response.data);
        } catch (err) {
            setError('Failed to fetch students.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await groupingApi.updateExcludedList(selectedStudents);
            navigate('/groupwithexclusion');
        } catch (err) {
            setError('Failed to update exclusion list.');
        }
    };

    const handleSelectionChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedStudents(selectedOptions);
    };

    return (
        <section className="shadow rounded p-5 my-8 mx-md-8">
            <h1>Select people to exclude</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="col-sm-8 mb-3">
                <form onSubmit={handleSubmit}>
                    <select
                        multiple
                        className="form-select"
                        onChange={handleSelectionChange}
                        size="10"
                    >
                        {students.map(student => (
                            <option
                                key={student.id}
                                value={student.id}
                                className="btn-lg"
                            >
                                {student.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="btn btn-primary mt-3">
                        Generate
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ExcludeSelection;