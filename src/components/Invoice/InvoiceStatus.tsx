import React, {useEffect, useState} from 'react';
import {Button, Dropdown, Menu, message, Tag} from "antd";
import {MenuProps} from "antd/es/menu";
import Cookies from "universal-cookie";
import {send} from "../../utils/send";
import {useParams} from "react-router-dom";

interface Props {
    invoiceId: string;
    businessId: string;
    status: number;
}

export const InvoiceStatus = (props: Props) => {
    const cookies = new Cookies();
    const params = useParams();
    const [status, setStatus] = useState<number>();


    useEffect(() => {
        setStatus(props.status);
    },[]);


    const changeStatus = async (status: number) : Promise<void> => {

        const res = await send(`invoices/${props.businessId}/${props.invoiceId}`,'PATCH', cookies.get('apiToken'), {status});

        if(res.res.success === true) {
            message.success('Status faktury został prawidłowo zaauktalizowany.');
            setStatus(status);
        } else {
            message.error('Wystąpił nieznany błąd...');
        }

    }

    const onMenuClick: MenuProps['onClick'] = async e => {
        console.log('click', e);
        await changeStatus(Number(e.key));
    };





    const menu = (
        <Menu
            onClick={onMenuClick}
            items={[
                {
                    key: 0,
                    label: 'Wystawiona',
                },
                {
                    key: 1,
                    label: 'Wysłana',
                },
                {
                    key: 2,
                    label: 'Opłacona',
                },
            ]}
        />
    );


    return (<>

            <Dropdown.Button type="text" overlay={menu}>
        {
            status === 0 && <Tag color="default">Wystawiona</Tag>
}

    {
        status === 1 && <Tag color="processing">Wysłana</Tag>
    }

    {
        status === 2 && <Tag color="success">Opłacona</Tag>
    }

    {
        status === -1 && <Tag color="error">Faktura Przeterminowana!</Tag>
    }

            </Dropdown.Button>

        </>
    )


}