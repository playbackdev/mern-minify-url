import React, {useContext, useEffect, useState} from "react";
import './AuthPage.scss';
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const messageToast = useMessage();
    const {loading, error, message, request} = useHttp();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [validationErrors, setValidationErrors] = useState({email:'', password:''});

    useEffect(() => {
        //обработка массива errors если он есть
        if(error && error.errors) {
            const errorsObj = {};
            error.errors.forEach(item => {
                errorsObj[item.param] = item.msg;
            });
            setValidationErrors(errorsObj);
        }
        //вывод error.message в toast
        if(error && error.message) {
            messageToast(error.message);
        }
    }, [error, messageToast]);

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value});
        setValidationErrors({
            ...validationErrors,
            [event.target.name]: ''
        })
    };

    const registerHandler = async () => {
        setValidationErrors({email:'', password:''});
        try {
            const data = await request('/api/auth/register', 'POST', {...form});
            messageToast(data.message);
        } catch (e) {

        }
    };

    const loginHandler = async () => {
        setValidationErrors({email:'', password:''});
        try {
            const data = await request('/api/auth/login', 'POST', {...form});
            messageToast(data.message);
            auth.login(data.token, data.userId);
        } catch (e) {

        }
    };

    return (
        <div className="AuthPage row">
            <div className="col s6 offset-s3">
                <h2>Minify Url</h2>
                <div className="card grey darken-4">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <form>

                            <div className="input-field">
                                <input
                                       id="email"
                                       type="text"
                                       name="email"
                                       value={form.email}
                                       className={validationErrors.email ? "validate invalid" : ""}
                                       onChange={changeHandler}
                                />
                                <label htmlFor="email">Email</label>
                                {validationErrors.email ?
                                <span className="helper-text"
                                      data-error={validationErrors.email}>

                                </span>:null}
                            </div>

                            <div className="input-field">
                                <input
                                       id="password"
                                       type="password"
                                       name="password"
                                       value={form.password}
                                       className={validationErrors.password ? "validate invalid" : ""}
                                       onChange={changeHandler}
                                />
                                <label htmlFor="password">Пароль</label>
                                {validationErrors.password ?
                                <span className="helper-text"
                                      data-error={validationErrors.password}>

                                </span>:null}
                            </div>
                            {
                                loading ?
                                    <span className="form-validation-info">
                                        Загрузка ...
                                    </span>
                                : error && error.message ?
                                    <span className="form-validation-info invalid">
                                            {error.message}
                                    </span>
                                : message ?
                                    <span className="form-validation-info valid">
                                        {message}
                                    </span>
                                        : null
                            }


                        </form>
                    </div>
                    <div className="card-action">
                        <button className="btn yellow darken-4"
                                onClick={loginHandler}
                                disabled={loading}
                        >
                            Войти
                        </button>
                        <button className="btn grey lighten-1 black-text"
                                onClick={registerHandler}
                                disabled={loading}
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};