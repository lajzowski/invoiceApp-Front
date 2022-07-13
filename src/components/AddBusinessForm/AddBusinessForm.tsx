import React, {useState} from 'react';
import {Button, Form, Input, message, Radio, Result, Space, Spin} from "antd";
import {send} from "../../utils/send";
import Cookies from "universal-cookie";

interface Props {

    closeDrawerHanlder: () => void;
    reloadBusinessHandler: () => void;

}

export const AddBusinessForm = (props: Props) => {

    const [form] = Form.useForm();
    const [formSend, setFormSend] = useState(false);
    const [loading, setLoading] = useState(false);
    const cookies = new Cookies();

    const sendForm = async (obj: any) => {
        setLoading(true);
        setFormSend(true);
        const res = await send('business/','POST', cookies.get('apiToken'), obj.business);

        if(res.status !==201) {
            setFormSend(false);
            setLoading(false);
            return message.error('Wystąpił nieznany problem. Firma nie została dodana. Prosimy spróbować ponownie..',5);
        }


        setLoading(false);
        console.log('FormSend!');

        console.log(obj);

        await props.reloadBusinessHandler();

    }


    const closeForm = () => {
        props.closeDrawerHanlder();
        form.resetFields();
        setFormSend(false);
    }

    const resetForm = () => {
        form.resetFields();
        setFormSend(false);
    }

    return (


            formSend ? (
                <Spin tip="Loading..." spinning={loading}>
                <Result
                    status="success"
                    title="Firma została dodana do panelu!"
                    subTitle="Możesz teraz wybrać ją z górnego menu i rozpocząć dodawanie faktur."
                    extra={[
                        <Button type="primary" key="console" onClick={resetForm}>
                            Dodaj kolejną firmę
                        </Button>,
                        <Button key="buy" onClick={closeForm}>Zamknij</Button>,
                    ]}
                />
                </Spin>


            ) : (
                <Form
                    layout={'vertical'}
                    form={form}
                    onFinish={sendForm}
                >

                    <Form.Item label="Nazwa firmy" rules={[{required: true, min: 3, message: 'Nazwa firmy musi mieć minimum 3 znaki.'}]} name={['business', 'name']}>
                        <Input placeholder="Wpisz pełną nazwę firmy" />
                    </Form.Item>

                    <Form.Item label="subdomain" rules={[{required: true, min: 3, max: 30 , pattern: new RegExp('^[0-9a-z\-]{3,30}$'), message: 'Subdomena musi mieć od 3 do 30  znaków i może się składać wyłącznie z liter, cyfr i "-"'}]} name={['business', 'subdomain']}>
                        <Input addonBefore="https://" suffix=".faktus.pl" defaultValue="" placeholder="twoja-nazwa" />
                    </Form.Item>

                    <Form.Item label="NIP" rules={[{required: true, type: "string", message: 'Podaj poprawny numer NIP bez "-"', pattern: new RegExp('^[0-9]{10}$')}]} name={['business', 'nip']}>
                        <Input placeholder="NIP"/>
                    </Form.Item>

                    <Form.Item label="Rodzaj prowadzonej działalności"  rules={[{required: true, message: 'Musisz wybrać rodzaj firmy.'}]} name={['business', 'type']}>
                        <Radio.Group>
                            <Radio.Button value="0">Działalność gospodarcza</Radio.Button>
                            <Radio.Button value="1">Spółka z ograniczoną odpowiedzialnością</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Firma jest Vatowcem" rules={[{required: true, message: 'Nie wybrano czy firma jest Vatowcem.'}]} name={['business', 'vat']}>
                        <Radio.Group>
                            <Radio.Button value="1">TAK</Radio.Button>
                            <Radio.Button value="0">NIE</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Adres" rules={[{required: true, message: 'Wpisz poprawną nazwę ulicy'}]} name={['business', 'address']}>
                        <Input placeholder="Podaj ulicę oraz numer lokalu" />
                    </Form.Item>
                    <Form.Item label="Kod pocztowy" rules={[{required: true, message: 'Podaj kod pocztowy', pattern: new RegExp('^[0-9]{2}-[0-9]{3}$')}]} name={['business', 'postcode']}>
                        <Input placeholder="00-000" />
                    </Form.Item>

                    <Form.Item label="Miasto" rules={[{required: true, message: 'Wpisz poprawną nazwę miasta'}]} name={['business', 'city']}>
                        <Input placeholder="Wpisz miasto" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button onClick={closeForm}>Anuluj</Button>
                            <Button type="primary" htmlType="submit">
                                Dodaj firmę
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            )






    );

}