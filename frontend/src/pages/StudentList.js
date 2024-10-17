import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../api/axiosConfig';


const StudentList = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await studentApi.getAllStudents();
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/students/${id}`, {
                method: 'DELETE',
            });
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    return (
        <div className="row">
            <div className="col-md-2 col-12"></div>
            <div className="col-md-6 col-12">
                <div>
                    <h2>List of Students</h2>
                    <Link to="/list/add" className="btn btn-dark">Add New Student</Link>
                    <Link to="/addlist/form" className="btn btn-dark">Add New List</Link>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student, index) => (
                            <tr key={student.id}>
                                <td>{index + 1}</td>
                                <td>{student.name}</td>
                                <td>
                                    <Link to={`/list/edit/${student.id}`} className="btn btn-outline-info sgds btn-sm">
                                        Edit
                                    </Link>
                                    <button
                                        className="btn btn-outline-warning sgds btn-sm ms-2"
                                        onClick={() => handleDelete(student.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentList;