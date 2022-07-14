import React, {useContext} from "react";
import {Button, Form, Input, Row, Typography} from 'antd';
import { useCookies } from 'react-cookie';
import {send} from "../../utils/send";
import {useNavigate} from "react-router-dom";
import { message, Space } from 'antd';

import './LoginForm.css';
import Cookies from "universal-cookie";
import {Config} from "../../config";

interface Props {
    changeLoggedIn: (value: boolean) => void,
}


export const LoginForm = (props: Props) => {

    let navigate = useNavigate();

    const cookies = new Cookies();


    const sendForm = async (obj: any) => {
        const result = await fetch(`${Config.apiHost}/auth/login`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                charset: 'utf-8',
                mode: 'cors'
            },
            method: 'POST',
            body: JSON.stringify(obj),
        });

        return await result.json();
    }

    const onFinish = async (values: any) => {
        const hide = message.loading('Trwa logowanie..', 0);
        console.log('Success:', values);
        const res = await sendForm(values);
        console.log(res);

        if(res.access_token) {
            console.log('UDALO SIE ZALOGOWAC!!!');
           // await setCookie('token',res.access_token, {path: '/'});


            cookies.set('apiToken', res.access_token, { path: '/' });
            cookies.set('name',res.name,{ path: '/' });
            //console.log(await cookies.get('myCat')); // Pacman


            props.changeLoggedIn(true);
            navigate("/dashboard", { replace: true });
            hide();
            message.success('Udało się! Jesteś zalogowany! Możesz teraz przejść do wystawiania faktur :)');

        }

        if(res.statusCode === 401) {
            message.error('Błędne dane logowania! Proszę spróbować ponownie.');
            hide();
        }

    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };


    const testGet = async () => {
        const res = await send('business','GET',await  cookies.get('apiToken'));
        console.log(res);
    }

    return (<>
        <Row justify="center" align="top" style={{minHeight: '25vh'}}>
        <Form


            className={'form-login'}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Typography.Title level={2} style={{textAlign: 'center'}}>Logowanie</Typography.Title>

            <Form.Item
                label="Użytkownik"
                name="username"
                rules={[{ required: true, message: 'Nazwa użytkownika nie została wpisana!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Hasło"
                name="password"
                rules={[{ required: true, message: 'Hasło nie zostało wpisane!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 11, span: 8 }}>
                <Button type="primary" htmlType="submit">
                    Zaloguj
                </Button>
            </Form.Item>
        </Form>
        </Row>
        </>
    );
};
