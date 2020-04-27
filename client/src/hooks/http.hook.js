import {useState, useCallback} from 'react';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const request = useCallback(
        async (url,
               method = 'GET',
               body = null,
               headers = {}) => {

            setError(null);
            setMessage(null);
            setLoading(true);
            if(body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }
            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers
                });
                const data = await response.json();
                console.log(data);
                if(!response.ok) {
                    setError(data);
                    throw new Error(data.message || 'Что-то пошло не так');
                }
                setLoading(false);
                if(data.message) {
                    setMessage(data.message);
                }
                return data;
            } catch (e) {
                setLoading(false);
                throw e;
            }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { loading, request, error, clearError, message }
};