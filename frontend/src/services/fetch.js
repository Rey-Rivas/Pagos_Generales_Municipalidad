// utils/fetch.js
export default async function fetchBase(endpoint, options = {}) {
    const baseURL = `http://${import.meta.env.VITE_BACK_HOST}:${import.meta.env.VITE_BACK_PORT}/api`;
    
    // Add default headers
    const headers = {
        'Accept': '*/*',
        'Content-Type': 'application/json',  // Add this line
        ...options.headers,  // Merge with headers from options
    };
    // Log the request data
    console.log('Request data:', {
        url: baseURL + endpoint,
        options: { ...options, headers },
    });

    const response = await fetch(baseURL + endpoint, { ...options, headers });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}