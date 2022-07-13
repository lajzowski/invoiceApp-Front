import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Drawer, Form, Input, Menu, Space, Typography, Radio, Card, Col, Row} from "antd";
import type {MenuProps, MenuTheme} from 'antd/es/menu';
import { PlusOutlined } from '@ant-design/icons';


import {
    AppstoreOutlined,
    CalendarOutlined,
    LinkOutlined,
    MailOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import Cookies from "universal-cookie";
import {AddBusinessForm} from "../AddBusinessForm/AddBusinessForm";
import {send} from "../../utils/send";
import {AddInvoiceForm} from "../AddInvoiceForm/AddInvoiceForm";
import {ShowAllInvoice} from "../Invoice/ShowAllInvoice";
import {Invoice} from "../Invoice/Invoice";
import {BusinessSettingsForm} from "../BusinessSettingsForm/BusinessSettingsForm";

interface Props {

    loggedIn: boolean;
    reloadBusinessHandler: () => void;
    loginHandler: (value: boolean) => void;

}

enum MenuChoose {
    notChoose,
    createInvoice,
    showAllInvoice,
    settings,
}

export const Dashboard = (props: Props) => {
    const navigate = useNavigate();
    const params = useParams();
    const cookies = new Cookies();
    const [visibleNewBusiness, setVisibleNewBusiness] = useState(false);
    const [currentBusiness, setCurrentBusiness] : any= useState(null);
    const [menuChoose, setMenuChoose] = useState(MenuChoose.notChoose)


    useEffect(() => {


        (async () => {
            if (props.loggedIn === false) {


                const resp = await send('auth/test', 'GET', cookies.get('apiToken'));
                console.log({cookies: cookies.get('apiToken')});
                console.log(resp);
                if (resp.status === 401) {
                    cookies.remove('apiToken', {path: '/'});
                    props.loginHandler(false);
                    console.log('Brak dostepu');
                } else if (resp.status === 200) {
                    props.loginHandler(true);
                }


            }

            if (props.loggedIn === false) {
                navigate('/auto-logout');
            }

        })();


    }, [props.loggedIn]);


    useEffect(() => {

        (async () => {
            const resp = await send(`business/${params.businessId}`,'GET' , cookies.get('apiToken'));
            if(resp.status === 200) {
                setCurrentBusiness(resp.res);
            }
        })();


    },[params.businessId, menuChoose])


    type MenuItem = Required<MenuProps>['items'][number];

    function getItem(
        label: React.ReactNode,
        key?: React.Key | null,
        icon?: React.ReactNode,
        children?: MenuItem[],
    ): MenuItem {
        return {
            key,
            icon,
            children,
            label,
        } as MenuItem;
    }


    const items: MenuItem[] = [
        getItem(<Link to={`/dashboard/${params.businessId}`} onClick={() => setMenuChoose(MenuChoose.createInvoice)}>Wystaw Fakturę</Link>, '1', null),
        getItem(<Link to={`/dashboard/${params.businessId}`} onClick={() => setMenuChoose(MenuChoose.showAllInvoice)}>Wystawione Faktury</Link>, '2', null),
        getItem(<Link to={`/dashboard/${params.businessId}`} onClick={() => setMenuChoose(MenuChoose.settings)}>Ustawienia</Link>, '3', <SettingOutlined/>),

    ];


    const closeNewBusinessDrawer = () => {
        setVisibleNewBusiness(false);
    }


    const clearMenu = () => {
        setMenuChoose(MenuChoose.notChoose);
    }




    return (

        <>

            {
                params.businessId && currentBusiness ? (<>
                    <Row justify={"start"} gutter={[0, 2]}>
                        <Col flex="250px">
                            <Card style={{ width: 300 }}>
                                <Typography.Title level={5}>{currentBusiness.name}</Typography.Title>
                                <Typography.Text>NIP: {currentBusiness.nip}</Typography.Text>
                            </Card>
                            <Menu
                                style={{width: 300}}
                                mode={'vertical'}
                                theme={'light'}
                                items={items}
                            />
                        </Col>
                        <Col flex="auto" style={{paddingLeft: '20px',}}>

                            {
                                menuChoose === MenuChoose.createInvoice && <AddInvoiceForm/>
                            }

                            {
                                menuChoose === MenuChoose.showAllInvoice && <ShowAllInvoice clearMenu={clearMenu}/>
                            }

                            {
                                menuChoose === MenuChoose.settings && <BusinessSettingsForm businessId={params.businessId as string}/>
                            }

                            {
                                params.invoiceId && <Invoice/>
                            }


                        </Col>


                    </Row>



                </>): (
                    <>

                        <Typography.Title level={1}>Witaj, {cookies.get('name')}</Typography.Title>
                        <Typography.Text>Wybierz firmę z górnego menu, aby zacząć wystawiać faktury.</Typography.Text>
                        <Typography.Title level={4}>Chcesz dodać nową firmę do panelu?</Typography.Title>

                        <Button type="primary" onClick={() => setVisibleNewBusiness(true)} icon={<PlusOutlined/>} size={'large'}>
                            Dodaj firmę
                        </Button>


                        <Drawer
                            title="Formularz dodawania firmy do panelu"
                            width={520}
                            onClose={closeNewBusinessDrawer}
                            visible={visibleNewBusiness}
                            bodyStyle={{paddingBottom: 80}}
                        >


                            <Space>

                                <AddBusinessForm  reloadBusinessHandler={props.reloadBusinessHandler} closeDrawerHanlder={closeNewBusinessDrawer}/>

                            </Space>


                        </Drawer>


                    </>


                )
            } </>)


}