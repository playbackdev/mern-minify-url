import React, {useContext, useState} from "react";
import './CreatePage.scss';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {useHistory} from 'react-router-dom';

export const CreatePage = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const {request, message, error} = useHttp();
    const [link, setLink] = useState('');
    const changeHandler = e => {
        setLink(e.target.value);
    };
    const submitHandler = async e => {
        e.preventDefault();
        try {
            const data = await request('/api/link/generate',
                'POST',
                {from: link},
                {Authorization: `Bearer ${auth.token}`}
            );
            setTimeout(() => {
                history.push(`/detail/${data.link._id}`);
            }, 900);
        } catch (e) {
        }
    };

    return (
        <div className="CreatePage row">
            <h3>Create minified link</h3>
                <form onSubmit={submitHandler}>
                    <div className="input-field">
                        <input
                            id="link"
                            type="text"
                            name="link"
                            className=""
                            value={link}
                            onChange={changeHandler}
                        />
                        <label htmlFor="link">Url</label>

                    </div>
                    <button className="btn blue lighten-1"
                            type="submit"
                    >
                        Создать
                    </button>
                </form>
            {message ? <span className="message valid">
                    {message}
            </span> : null}
            {error ? <span className="message invalid">
                    {error.message}
            </span> : null}
        </div>
    )
};