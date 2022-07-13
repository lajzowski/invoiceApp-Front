import React, {useEffect, useState} from 'react';
import {Card, Col, message, Spin, Row, Typography, Table} from "antd";
import {send} from "../../utils/send";
import moment from "moment";
import {useParams} from "react-router-dom";
import Cookies from "universal-cookie";
import {ColumnsType} from "antd/es/table";
import {InvoiceStatus} from "./InvoiceStatus";

interface Props {
    
}

interface DataType {
    key: string;
    product_name: string;
    unit: number;
    quantity: number;
    price_netto: number;
    price_netto_sum: number;
    vat_percentage: number;
    price_brutto_sum: number;
}

interface InvoiceInterface {
    buyer_address: string;
    buyer_city: string;
    buyer_id: string | null;
    buyer_name: string;
    buyer_nip: number;
    buyer_postcode: string;
    buyer_type: number;
    comments: string | null;
    date_created: string;
    date_payment: string;
    date_sold: string;
    entries: DataType[];
    id: string;
    number: string;
    payment_type: string;
    seller_address: string;
    seller_city: string;
    seller_name: string;
    seller_nip: number;
    seller_postcode: string;
    seller_signature: string;
    status: number;
}

export const Invoice = (props: Props) => {

    const params = useParams();
    const cookies = new Cookies();
    const [invoice, setInvoice] = useState<InvoiceInterface>();
    const [invoiceSum,setInvoiceSum] = useState<{nettoSum: number; vatSum: number; bruttoSum: number;}>();

    useEffect(() => {

        (async () => {
            const res = await send(`invoices/${params.businessId}/${params.invoiceId}`,'GET', cookies.get('apiToken'));
            if(res.status !==200) {
                return message.error('Wystąpił nieznany problem z pobieraniem faktur...',5);
            }

            res.res.date_payment = res.res.date_payment.substring(0,10);
            if(moment(res.res.date_payment).isBefore(moment())) {

                res.res.status = -1;
            }
            console.log(res.res);
            await setInvoice(res.res);


        })();

    },[params.businessId, params.invoiceId]);


    useEffect(() => {

        if(invoice) {
            const nettoSum = invoice.entries.reduce((prev,curr) => {
                return prev+curr.price_netto*curr.quantity
            },0);

            const vatSum = invoice.entries.reduce((prev,curr) => {
                return prev+((curr.vat_percentage/100)*curr.price_netto*curr.quantity);
            },0);

            const bruttoSum = invoice.entries.reduce((prev,curr) => {
                return prev+((curr.vat_percentage/100+1)*curr.price_netto*curr.quantity);
            },0);

            setInvoiceSum(
                {
                    nettoSum,
                    vatSum,
                    bruttoSum,
                }
            )

        }
    },[invoice]);


    if(!invoice || !invoiceSum) {
        return (<Card style={{textAlign: 'center', minHeight: '250px',}}>
                <Spin />
            </Card>

        )
    }


    const unitTest = (unit: number) : string => {
      return unit===0 ? 'Sztuk' : unit===1 ? 'KG' : 'CM'
    }

    const columns : ColumnsType<DataType>= [
        {
            title: 'Nazwa produktu /Usługi',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'Jednostka',
            dataIndex: 'unit',
            key: 'unit',
            render: a => <span>{unitTest(a)}</span>

        },
        {
            title: 'Ilość',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Netto',
            dataIndex: 'price_netto',
            key: 'price_netto',
            render: a => <span>{a.toFixed(2)}</span>
        },
        {
            title: 'Netto Łącznie',
            dataIndex: 'price_netto_sum',
            key: 'price_netto_sum',
            render: (a,b) => <span>{(b.price_netto*b.quantity).toFixed(2)}</span>
        },
        {
            title: 'VAT',
            dataIndex: 'vat_percentage',
            key: 'vat_percentage',
            render: a => <span>{a}%</span>
        },

        {
            title: 'Brutto',
            dataIndex: 'price_brutto_sum',
            key: 'price_brutto_sum',
            render: (a,b) => <span>{(b.price_netto*b.quantity*(b.vat_percentage/100+1)).toFixed(2)}</span>
        },
    ];




    // @ts-ignore
    // @ts-ignore
    return (
        <Card title={`Faktura: ${invoice.number}`}>

            <Row justify="center" gutter={[20, 20]}>
                <Col md={12}>
                    <Card type={"inner"} title="Kupujący" style={{height: '225px'}}>
                        <p style={{fontWeight: 'bold'}}>{invoice.buyer_name}</p>
                        <p>{invoice.buyer_address}</p>
                        <p>{invoice.buyer_postcode} {invoice.buyer_city}</p>
                        <p>NIP: {invoice.buyer_nip}</p>





                    </Card>
                </Col>
                <Col md={12} >
                    <Card type={"inner"} title="Podsumowanie" style={{height: '225px'}}>

                       <p>Do zapłaty Netto: <span style={{fontWeight: 'bold'}}>{invoiceSum.nettoSum.toFixed(2)}</span></p>
                       <p>Do zapłaty podatku VAT: <span style={{fontWeight: 'bold'}}>{invoiceSum.vatSum.toFixed(2)}</span></p>
                       <p>Do zapłaty Brutto: <span style={{fontWeight: 'bold'}}>{invoiceSum.bruttoSum.toFixed(2)}</span></p>

                        <p>
                            <InvoiceStatus status={invoice.status} businessId={params.businessId as string} invoiceId={invoice.id}/>
                        </p>

                    </Card>
                </Col>

                <Col md={24} >
                    <Card type={"inner"} title="Towar / Usługi">

                        <Table dataSource={invoice.entries} columns={columns} pagination={false}/>;

                    </Card>
                </Col>

            </Row>



        </Card>
    );
}