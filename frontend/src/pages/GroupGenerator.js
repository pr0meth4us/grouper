import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { groupingApi } from '../api/axiosConfig';

const GroupGenerator = () => {
    const [groupMethod, setGroupMethod] = useState('1');
    const [groupSize, setGroupSize] = useState('');
    const [numberOfGroups, setNumberOfGroups] = useState('');
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (groupMethod === '1') {
                response = await groupingApi.generateGroupsBySize(parseInt(groupSize), false);
            } else {
                response = await groupingApi.generateGroupsByNumber(parseInt(numberOfGroups), false);
            }
            setGroups(response.data);
            setError('');
        } catch (err) {
            setError('Failed to generate groups. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="shadow rounded p-5 my-8 mx-md-8">
            <h1>Group Generator</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="mb-3">
                <label className="form-label">Select a method for group generation:</label>
                <div className="form-check">
                    <input
                        id="choice1"
                        name="choice"
                        value="1"
                        type="radio"
                        checked={groupMethod === '1'}
                        onChange={(e) => setGroupMethod(e.target.value)}
                        className="form-check-input"
                    />
                    <label htmlFor="choice1" className="form-check-label">
                        By size of each group
                    </label>
                </div>
                <div className="form-check">
                    <input
                        id="choice2"
                        name="choice"
                        value="2"
                        type="radio"
                        checked={groupMethod === '2'}
                        onChange={(e) => setGroupMethod(e.target.value)}
                        className="form-check-input"
                    />
                    <label htmlFor="choice2" className="form-check-label">
                        By total number of groups
                    </label>
                </div>

                {groupMethod === '1' && (
                    <input
                        type="number"
                        className="form-control mt-3"
                        placeholder="Enter the number of members in each group"
                        value={groupSize}
                        onChange={(e) => setGroupSize(e.target.value)}
                    />
                )}

                {groupMethod === '2' && (
                    <input
                        type="number"
                        className="form-control mt-3"
                        placeholder="Enter the number of groups"
                        value={numberOfGroups}
                        onChange={(e) => setNumberOfGroups(e.target.value)}
                    />
                )}

                <button
                    type="submit"
                    className="btn btn-secondary sgds mt-3"
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate'}
                </button>
            </form>

            {groups.length > 0 && (
                <div className="mt-4">
                    {groups.map((group, index) => (
                        <div key={index} className="card sgds mb-3">
                            <div className="card-body">
                                <h4 className="card-title">Group {index + 1}</h4>
                                <ul className="list-unstyled">
                                    {group.map((student, studentIndex) => (
                                        <li key={studentIndex}>{student}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                    <Link to="/exclude" className="btn btn-danger">
                        Need to exclude someone?
                    </Link>
                </div>
            )}
        </section>
    );
};

export default GroupGenerator;
