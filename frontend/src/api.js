/**
 * API Configuration Module
 * 
 * This module configures and exports an Axios instance for making HTTP requests
 * to the Django REST Framework backend. It handles base URL configuration from
 * environment variables and sets default headers.
 * 
 * @module api
 */

import axios from 'axios';

/**
 * Axios instance configured for the Snippet Locker API
 * 
 * Configuration:
 * - Base URL: Reads from VITE_API_URL environment variable
 * - Fallback: http://127.0.0.1:8000/api/ (for local development)
 * - Default Headers: Content-Type set to application/json
 * 
 * Usage Example:
 * ```javascript
 * import api from './api';
 * 
 * // GET request
 * const response = await api.get('snippets/');
 * 
 * // POST request
 * await api.post('snippets/', { title, code, language });
 * 
 * // DELETE request
 * await api.delete(`snippets/${id}/`);
 * ```
 * 
 * @constant {AxiosInstance}
 */
const api = axios.create({
    // Read API base URL from environment variable (.env file)
    // Falls back to localhost if not defined
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
});

export default api;