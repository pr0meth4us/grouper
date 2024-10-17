export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with a status code outside the 2xx range
        return error.response.data.message || 'An error occurred';
    } else if (error.request) {
        // Request was made but no response received
        return 'No response from server';
    } else {
        // Something else happened while setting up the request
        return 'Error setting up request';
    }
};
