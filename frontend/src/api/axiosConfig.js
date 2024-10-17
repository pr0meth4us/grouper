import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const studentApi = {
    getAllStudents: () => api.get('/students'),
    getStudentById: (id) => api.get(`/students/${id}`),
    createStudent: (data) => api.post('/students', data),
    updateStudent: (id, data) => api.put(`/students/${id}`, data),
    deleteStudent: (id) => api.delete(`/students/${id}`),
};

export const groupingApi = {
    generateGroupsBySize: (groupSize, exclude) =>
        api.get(`/grouping/bySize?groupSize=${groupSize}&exclude=${exclude}`),
    generateGroupsByNumber: (numberOfGroups, exclude) =>
        api.get(`/grouping/byNumber?numberOfGroups=${numberOfGroups}&exclude=${exclude}`),
    getExcludedList: () => api.get('/grouping/exclude'),
    updateExcludedList: (ids) => api.put('/grouping/exclude', ids),
};

export default api;