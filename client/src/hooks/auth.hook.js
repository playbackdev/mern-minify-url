import {useState, useCallback, useEffect} from 'react';
import {useHttp} from "./http.hook";

const storageName = 'userData';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [ready, setReady] = useState(false);

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken);
        setUserId(id);

        localStorage.setItem(storageName, JSON.stringify({userId: id, token: jwtToken}))
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem(storageName);
    }, []);

    const {request} = useHttp();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));
        console.log('useEffect auth.hook');
        ///////////////////////////////////////////
        const checkAuth = async () => {
            if(data && data.token && data.userId) {
                try {
                    const answer = await request('/api/auth/checkAuth',
                        'POST',
                        {checkAuth: 'checkAuth'},
                        {Authorization: `Bearer ${data.token}`}
                    );
                    if(answer.checkAuth) {
                        console.log('CheckAuth OK!');
                        login(data.token, data.userId);
                        setReady(true);
                    }
                } catch (e) {
                    console.log('CheckAuth error: ', e);
                    logout();
                    setReady(true);
                }
            }

        };
        checkAuth();
        /////////////////////////////////////
        // if(data && data.token && data.userId) {
        //     login(data.token, data.userId);
        //     setReady(true);
        // }

    }, [login, logout, request]);

    return { login, logout, token, userId, ready }
};