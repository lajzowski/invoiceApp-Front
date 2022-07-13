import { Alert } from 'antd';
import React, { useEffect } from 'react';

import './Logout.css';
import Cookies from "universal-cookie";

interface Props {
    changeLoggedIn: (value: boolean) => void;
    auto?: boolean;
}

export const Logout = (props: Props) => {
    const cookies = new Cookies();

    useEffect(() => {
        cookies.remove('apiToken',{path: '/'});
        cookies.remove('name',{path: '/'});
        props.changeLoggedIn(false);
    },[]);
    return (
        props.auto ? <Alert className={'my-alert'}
            message="Automatyczne wylogowanie"
            description="Ze względu na długi czas bezczynności nastąpiło automatyczne wylogowanie z panelu."
            type="info"
            showIcon
        /> : <Alert className={'my-alert'}
            message="Wylogowany"
            description="Zostałeś poprawnie wylogowany, dziękujemy za korzystanie z panelu."
            type="success"
            showIcon
        />
    )
}