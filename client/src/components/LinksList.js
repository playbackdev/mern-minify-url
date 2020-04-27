import React from "react";
import {Link} from 'react-router-dom';
import './LinksList.scss';

export const LinksList = ({links}) => {
    if(!links.length) {
        return <p className="center">Ссылок пока нет</p>
    }
    return (
        <table className="LinksList">
            <thead>
            <tr>
                <th>№</th>
                <th>Url</th>
                <th>Source</th>
                <th>Открыть</th>
            </tr>
            </thead>

            <tbody>
            { links.map((link, index) => {
                return (
                    <tr key={link._id}>
                        <td>{index + 1}</td>
                        <td>
                            <div>
                                {link.from}
                            </div>
                        </td>
                        <td>{link.to}</td>
                        <td>
                            <Link to={`/detail/${link._id}`}>Открыть</Link>
                        </td>
                    </tr>
                )
            }) }

            </tbody>
        </table>
    )
};