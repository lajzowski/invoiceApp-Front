import React, {useState} from 'react';
import {Button, Card, DatePicker, Form, Input, message, Result, Select, Space} from "antd";
import {send} from "../../utils/send";
import Cookies from "universal-cookie";
import moment from "moment";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {useNavigate, useParams} from "react-router-dom";

interface Props {
}

export const AddInvoiceForm = (props: Props) => {

    const [form] = Form.useForm();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [formSend, setFormSend] = useState(false);
    const navigate = useNavigate();

    const [invoiceData, setInvoiceData] =useState(null);

    const [payDate, setPayDate] = useState(moment().add(7,'days'));
    const [payRange, setPayRange] = useState('7');


    const[formDateValue, setFormDateValue] = useState({
        date_created: moment(),
        date_payment: moment().add(7,'days'),
        date_sold: moment(),
    })

    const cookies = new Cookies();

    const sendForm = async (obj: any) => {
        console.log(obj);


        setLoading(true);


        const invoice = {
            ...obj.invoice,
            buyer_type: 1,
            entries: obj.entries,
        }
        console.log(invoice);

        const res = await send(`invoices/${params.businessId}`,'POST', cookies.get('apiToken'), invoice);
        if(res.status !==201) {
            setFormSend(false);
            setLoading(false);
            return message.error('Wystąpił nieznany problem. Faktura nie została dodana...',5);


        }
        setLoading(false);

        await setInvoiceData(res.res);
        setFormSend(true);




     //   await props.reloadBusinessHandler();

    }

    const resetForm = () => {
        form.resetFields();
        setLoading(false);
        setFormSend(false);
    }

    const onDatePaymentChange = (value: string) => {
        setPayDate(moment().add(Number(value),'days'));
        setPayRange(value);
        console.log(value);
    }

    const setDifferentDatePay = () => {
        setPayRange('');
    }

    const changeDateFormHandler = (event: any) => {
        setFormDateValue((date) => {
            let obj = date;
            obj.date_created = event.target.value;
            return obj;
        });
    }

    const changeValue = (value: any) => {
        setPayDate(value);
        setDifferentDatePay();
    }


    return (

        formSend ?

            <Result
            status="success"
                // @ts-ignore
            title={`Faktura nr ${invoiceData.number} Zosała wystawiona`}
            subTitle="Użyj poniższych przycików, aby przejść do faktury lub wystawić kolejną."
            extra={[// @ts-ignore
                <Button type="primary" key="go-to-fv" onClick={() => navigate(`${invoiceData.id}`)}>
                    Przejdź do faktury
                </Button>,
                <Button key="newInvoice" onClick={resetForm}>Wystaw Kolejną</Button>,
            ]}
        />
            :

        <Card title="Wystaw Fakturę">
        <Form
            layout={'vertical'}
            form={form}
            onFinish={sendForm}
        >
            <Card type={"inner"} title="Nabywca">

                <Form.Item label="NIP" rules={[{required: true, type: "string", message: 'Podaj poprawny numer NIP bez "-"', pattern: new RegExp('^[0-9]{10}$')}]} name={['invoice', 'buyer_nip']}>
                    <Input placeholder="NIP"/>
                </Form.Item>

                <Form.Item label="Nazwa firmy" rules={[{required: true, min: 3, message: 'Nazwa firmy musi mieć minimum 3 znaki.'}]} name={['invoice', 'buyer_name']}>
                    <Input placeholder="Wpisz pełną nazwę firmy Nabywcy" />
                </Form.Item>

                <Form.Item label="Adres" rules={[{required: true, message: 'Wpisz poprawną nazwę ulicy'}]} name={['invoice', 'buyer_address']}>
                    <Input placeholder="Podaj ulicę oraz numer lokalu" />
                </Form.Item>
                <Form.Item label="Kod pocztowy" rules={[{required: true, message: 'Podaj kod pocztowy', pattern: new RegExp('^[0-9]{2}-[0-9]{3}$')}]} name={['invoice', 'buyer_postcode']}>
                    <Input placeholder="00-000" />
                </Form.Item>

                <Form.Item label="Miasto" rules={[{required: true, message: 'Wpisz poprawną nazwę miasta'}]} name={['invoice', 'buyer_city']}>
                    <Input placeholder="Wpisz miasto Nabywcy" />
                </Form.Item>

            </Card>

            <Card type={"inner"} title="Towar / Usługi">
                <Form.List name="entries">
                    {(entries, { add, remove }) => (
                        <>
                            {entries.map(({ key, name, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'product_name']}
                                        rules={[{ required: true, message: 'Podaj nazwę produktu lub usługi' }]}
                                    >
                                        <Input placeholder="Podaj nazwę produktu lub usługi" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'quantity']}
                                        rules={[{ required: true, message: 'Podaj ilość' }]}
                                    >
                                        <Input placeholder="Podaj ilość" />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'unit']}
                                        rules={[{ required: true, message: 'Wprowadź jednostkę' }]}
                                    >
                                        <Select>
                                            <Select.Option value={0}>Sztuk</Select.Option>
                                            <Select.Option value={1}>KG</Select.Option>
                                            <Select.Option value={2}>CM</Select.Option>

                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'price_netto']}
                                        rules={[{ required: true, message: 'Wprowadź cenę netto' }]}
                                    >
                                        <Input placeholder="Cena netto" />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'vat_percentage']}
                                        rules={[{ required: true, message: 'Wprowadź % VAT' }]}
                                    >
                                        <Input placeholder="Wprowadź VAT np. 23" />
                                    </Form.Item>

                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Dodaj Towar / Usługę do faktury
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Card>

            <Card type={"inner"} title="Płatność i Daty">
                <Form.Item label="Data Wystawienia" rules={[{required: true, message: 'Wprowadź datę wystawienia faktury'}]} name={['invoice', 'date_created']}>
                    <DatePicker value={moment()}/>
                </Form.Item>

                <Form.Item label="Data Sprzedaży" rules={[{required: true, message: 'Wprowadź datę sprzedaży'}]} name={['invoice', 'date_sold']}>
                    <DatePicker />
                </Form.Item>

                <Input.Group compact>

{/*                    <Form.Item label={'Data płatności'} style={{width: '150px'}}>
                    <Select value={payRange} onChange={onDatePaymentChange} >
                        <Select.Option value="7">7 dni</Select.Option>
                        <Select.Option value="14">14 dni</Select.Option>
                        <Select.Option value="30">30 dni</Select.Option>
                        <Select.Option value="">Inna</Select.Option>
                    </Select>
                    </Form.Item>*/}

                    <Form.Item  label={'Wybierz Termin Płatności'} rules={[{required: true, message: 'Wprowadź termin płatności'}]} name={['invoice', 'date_payment']}>
                        <DatePicker value={payDate} onChange={changeValue}/>
                    </Form.Item>
                </Input.Group>


                <Form.Item  label={'Forma płatności'} rules={[{required: true, message: 'Wprowadź formę płatności'}]} name={['invoice', 'payment_type']}>
                    <Select>
                        <Select.Option value={0}>Gotówka</Select.Option>
                        <Select.Option value={1}>Przelew</Select.Option>
                        <Select.Option value={2}>SplitPayment</Select.Option>

                    </Select>
                </Form.Item>



            </Card>

            <Card type={"inner"} title="Inne">
                <Form.Item label="Uwagi" rules={[{required: false, message: 'Wpisz uwagi do faktury'}]} name={['invoice', 'comments']}>
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item label="Podpis Sprzedawcy" rules={[{required: false, message: 'Wpisz imię i nazwisko sprzedającego'}]} name={['invoice', 'seller_signature']}>
                    <Input />
                </Form.Item>
            </Card>


            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">
                        Wystaw Fakturę
                    </Button>
                </Space>
            </Form.Item>
        </Form>
        </Card>
    )

}