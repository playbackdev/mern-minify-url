import React, {useCallback, useContext, useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import './DetailPage.scss';
import {Loader} from "../components/Loader";
import {LinkCard} from "../components/LinkCard";

export const DetailPage = () => {
    const {token} = useContext(AuthContext);
    const [link, setLink] = useState(null);
    const linkId = useParams().id;
    const {request, loading, error, message} = useHttp();

    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setLink(fetched);
            console.log('Answer: ', fetched);

        } catch (e) {
            console.log('Error: ', e);
        }
    }, [token, linkId, request]);

    useEffect(() => {
        getLink();
    }, [getLink]);

    if(loading) {
        return <Loader/>
    }
    return (
        <div>
            <h3>Detail Page</h3>
            {!loading && link && <LinkCard link={link}/>}
            {message ? <span className="message valid">
                    {message}
            </span> : null}
            {error ? <span className="message invalid">
                    {error.message}
            </span> : null}
        </div>
    )
};