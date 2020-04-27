import React, {useCallback, useContext, useEffect, useState} from "react";
import './LinksPage.scss';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import {LinksList} from "../components/LinksList";

export const LinksPage = () => {
    const [links, setLinks] = useState([]);
    const {loading, request, message, error} = useHttp();
    const {token} = useContext(AuthContext);

    const fetchLinks = useCallback(async () => {
        try {
            const fetched = await request('/api/link', 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setLinks(fetched);
        }   catch (e) {
        }
    }, [token, request]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    if(loading) {
        return <Loader/>;
    }

    return (
        <div>
            <h3>Links Page</h3>
            {
                !loading && <LinksList links={links}/>
            }
            {message ? <span className="message valid">
                    {message}
            </span> : null}
            {error ? <span className="message invalid">
                    {error.message}
            </span> : null}
        </div>
    )
};