import React, {useState} from 'react';
import {Alert, Button, Form, Input, Spin} from 'antd';
import { Typography } from 'antd';
import {send} from "../../utils/send";

export const RegForm = () => {

    const [form] = Form.useForm();

    const [formSend, setFormSend] = useState(false);
    const [loading, setLoading] = useState(true);

    /* eslint-disable no-template-curly-in-string */

    const validateMessages = {
        required: '${label} jest wymagana!',
        types: {
            email: 'Nieprawidłowy adresem e-mail!',
            number: 'Nieprawidłowy numer!',
        },
        number: {
            range: '${label} musi być od ${min} do ${max}',
        },
    };
    /* eslint-enable no-template-curly-in-string */

    const formItemLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 8},
    }

    const buttonItemLayout = {
        wrapperCol: {span: 14, offset: 4},
    }


    const sendForm = async (obj: any) => {
        const res = await send('users/','POST', '', obj);

        return await res;
    }


    const onFormChange = () => {
        return null;
    }

    const onFormFinished = async (obj: any) => {
        setFormSend(true);
        const { password2, ...user } = obj.user;
        const res = await sendForm(user);
        console.log(res);
        setLoading(false);
    }

    if(formSend) {
        return <Spin tip="Loading..." spinning={loading}>
            <Alert
                message="Dziękujemy za rejestracje!"
                description="Możesz teraz przejść do strony logowania."
                type="success"
            />
        </Spin>
    }

    return (
        <>
            <Typography.Title level={4}>Rejestracja Użytkownika</Typography.Title>
            <Form
                {...formItemLayout}
                layout={"horizontal"}
                form={form}
                initialValues={{layout: "horizontal"}}
                onValuesChange={onFormChange}
                onFinish={onFormFinished}
                validateMessages={validateMessages}
            >
                <Form.Item label="Nazwa Użytkownika" rules={[{required: true, min: 5, message: 'Nazwa użytkownika musi mieć minimum 5 znaków.'}]} name={['user', 'username']} >
                    <Input placeholder="Wpisz nazwę użytkownika po kórej będziesz mógł się logować..."/>
                </Form.Item>

                <Form.Item label="E-mail" rules={[{required: true, type: "email"}]} name={['user', 'email']} >
                    <Input placeholder="Twój e-mail"/>
                </Form.Item>

                <Form.Item label="Hasło" rules={[{required: true, type: "string", min: 5, message: 'Hasło musi mieć minimum 5 znaków.'}]} name={['user', 'password']}
                           hasFeedback>
                    <Input.Password placeholder="Wprowadź hasło..."/>
                </Form.Item>

                <Form.Item label="Powtórz hasło"
                           rules={[
                               {required: true, type: "string"},
                               ({getFieldValue}) => ({
                                   validator(_, value) {
                                       if (!value || getFieldValue(['user', 'password']) === value) {
                                           return Promise.resolve();
                                       }
                                       return Promise.reject(new Error('Podane hasła różnią się od siebie!'));
                                   },
                               }),]}

                           name={['user', 'password2']}
                           dependencies={[['user', 'password']]}
                           hasFeedback
                >
                    <Input.Password placeholder="Powtórz wprowadzone wyżej hasło..."/>
                </Form.Item>


                <Form.Item label="Imię" rules={[{required: true, type: "string"}]} name={['user', 'name']}>
                    <Input placeholder="Wprowadź imię"/>
                </Form.Item>

                <Form.Item label="Nazwisko" rules={[{required: true, type: "string"}]} name={['user', 'surname']}>
                    <Input placeholder="Wprowadź nazwisko"/>
                </Form.Item>

                <Form.Item {...buttonItemLayout}>
                    <Button type="primary" htmlType="submit">Zarejestruj!</Button>
                </Form.Item>
            </Form>

        </>
    );
};