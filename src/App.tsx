import React, {useEffect, useState} from 'react';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {NotFound} from "./components/pages/NotFound";

import 'antd/dist/antd.min.css';
import {RegForm} from "./components/RegForm/RegForm";
import {LoginForm} from "./components/LoginForm/LoginForm";
import {Dashboard} from "./components/layout/Dashboard";
import {Layout} from "antd";
import {Menu} from 'antd';
import {send} from "./utils/send";
import {Logout} from "./components/pages/Logout";


import './App.css';
import Cookies from "universal-cookie";
import {Home} from "./components/pages/Home";

export const App = () => {


    const {Header, Footer, Content} = Layout;

    const [loggedIn, setLoggedIn] = useState(false);
    const cookies = new Cookies();

    const [allBusiness, setAllBusiness] = useState([]);

    const getAllBusinesses = async () => {
        const resp = await send('business/','GET', cookies.get('apiToken'));
        setAllBusiness(resp.res);

        console.log(resp);
    }

    useEffect(() => {
        (async () => {

/*            const resp = await send('auth/test','GET', cookies.get('apiToken'));
            console.log({cookies: cookies.get('apiToken')});
            console.log(resp);
            if(resp.status === 401) {
                cookies.remove('apiToken', {path: '/'});
                await setLoggedIn(false);
                console.log('Brak dostepu');
            } else if(resp.status === 200) {
                await setLoggedIn(true);
            }*/

            loggedIn && await getAllBusinesses();

        })();

    },[loggedIn]);

/*
    useEffect(() =>{
        loggedIn && getAllBusinesses();
    },[])
*/

    const changeLoggedIn = (value:  boolean) : void => {
       setLoggedIn(value);
    }




    return (

        <BrowserRouter>


            <Layout>
                <Header style={{backgroundColor: 'white'}}>
                    <div className="logo"></div>
                  {/* <Menu theme={'dark'} mode="horizontal" items={items}/>*/}

                    <Menu mode="horizontal">
                    {loggedIn ? (<>
                            {allBusiness.map((business: any) => {
                                return <Link to={`dashboard/${business.id}`}> <Menu.Item title={business.name}>{business.name}</Menu.Item></Link>
                            })}
                        <Link to={'/logout'}> <Menu.Item title={'home'}>Wyloguj</Menu.Item></Link>

                        </>
                    ) : (
                        <>
                            <Link to={'/'}> <Menu.Item title={'home'}>Strona Główna</Menu.Item></Link>
                            <Link to={'/login'}> <Menu.Item title={'login'}>Logowanie</Menu.Item></Link>
                            <Link to={'/register'}> <Menu.Item title={'reg'}>Rejestracja</Menu.Item></Link>

                        </>


                    )}

                    </Menu>

                </Header>
                <Content className={'content'}>

                    <Routes>
                        <Route path="*" element={<NotFound/>}/>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/register" element={<RegForm/>}/>
                        <Route path="/login" element={<LoginForm changeLoggedIn={changeLoggedIn}/>}/>

                        <Route path="/dashboard/" element={<Dashboard loggedIn={loggedIn} reloadBusinessHandler={getAllBusinesses} loginHandler={changeLoggedIn}/>} />
                        <Route path="/dashboard/:businessId" element={<Dashboard loggedIn={loggedIn} reloadBusinessHandler={getAllBusinesses} loginHandler={changeLoggedIn}/>} />
                        <Route path="/dashboard/:businessId/:invoiceId" element={<Dashboard loggedIn={loggedIn} reloadBusinessHandler={getAllBusinesses} loginHandler={changeLoggedIn}/>} />


                        <Route path="/logout/" element={<Logout changeLoggedIn={changeLoggedIn}/>}/>
                        <Route path="/auto-logout/" element={<Logout auto={true} changeLoggedIn={changeLoggedIn}/>}/>
                    </Routes>


                </Content>
                <Footer>Aplikacja powstała w celach edukacyjnych. W celu zaliczenia 8 etapu MegaK.</Footer>
            </Layout>


        </BrowserRouter>

    )
}