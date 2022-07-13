import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {Card, message, Table, Tag} from "antd";
import {send} from "../../utils/send";
import Cookies from "universal-cookie";
import {ColumnsType} from "antd/es/table";
import moment from "moment";
import {InvoiceStatus} from "./InvoiceStatus";

interface Props {
    clearMenu: () => void;
}

export const ShowAllInvoice = (props: Props) => {

    interface DataType {
        id: string;
        number: string;
        buyer_name: string;
        buyer_nip: string;
        date_payment: string;
        status: number;
    }
    const params = useParams();
    const cookies = new Cookies();

    const [tableRow, setTableRow] = useState<DataType[]>();



    const columns: ColumnsType<DataType> = [
        {
            title: 'Numer faktury',
            dataIndex: 'number',
            key: 'number',
            render: (text,ar) => <Link onClick={() => props.clearMenu()} to={`${ar.id}`}>{text}</Link>,
        },
        {
            title: 'Kupujący',
            dataIndex: 'buyer_name',
            key: 'buyer_name',
        },
        {
            title: 'NIP Kupującego',
            dataIndex: 'buyer_nip',
            key: 'buyer_nip',
        },
        {
            title: 'Termin Płatności',
            dataIndex: 'date_payment',
            key: 'date_payment',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_, { status, id }) => <InvoiceStatus status={status} invoiceId={id} businessId={params.businessId as string} />,
        },
    ];





    useEffect(() => {

        (async () => {
            const res = await send(`invoices/${params.businessId}`,'GET', cookies.get('apiToken'));
            if(res.status !==200) {
                return message.error('Wystąpił nieznany problem z pobieraniem faktur...',5);
            }

            console.log(res.res);

            await res.res.map((data: DataType) => {
                data.date_payment = data.date_payment.substring(0,10);

                if(moment(data.date_payment).isBefore(moment()) && data.status !== 2) {
                    data.status = -1;
                }
            });

            setTableRow(res.res)
            console.log({tableRow: tableRow});

            const newData = {
                id: 1234,
                test: 4444,
            }


        })();

    },[params.businessId]);





    return (
        <Card title="Lista Wystawionych Faktur">

            <Table columns={columns} dataSource={tableRow} />;
        </Card>
    )

}