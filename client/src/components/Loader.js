import React from "react";
import './Loader.scss'

export const Loader = () => {
    return (
        <div className="Loader spinner-layer spinner-red">
            <div className="circle-clipper left">
                <div className="circle"/>
            </div>
            <div className="gap-patch">
                <div className="circle"/>
            </div>
            <div className="circle-clipper right">
                <div className="circle"/>
            </div>
        </div>
    )
};