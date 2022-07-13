import React, {useEffect, useState} from 'react';
import {Button, Card, Input, message} from "antd";
import {send} from "../../utils/send";
import moment from "moment";
import Cookies from "universal-cookie";

interface Props {
    businessId: string;
}

export const BusinessSettingsForm = (props: Props) => {

    const [invoiceFormat, setInvoiceFormat] = useState<string>();
    const cookies = new Cookies();


    useEffect(() => {

        (async () => {
            const res = await send(`business/${props.businessId}/settings`,'GET', cookies.get('apiToken'));
            if(res.status !==200) {
                return message.error('Wystąpił błąd...',5);
            }

            setInvoiceFormat(res.res.format);


        })();
    },[]);


    const changeInvoiceFormat = async () : Promise<void> => {

        const res = await send(`business/${props.businessId}/settings`,'PATCH', cookies.get('apiToken'), {format: invoiceFormat});

        if(res.res.success === true) {
            message.success('Ustawienia zostały zapisane.');
        } else {
            message.error('Wystąpił nieznany błąd...');
        }

    }


    return (<Card title={'Ustawienia'}>


        Format numeracji faktur: <Input value={invoiceFormat} onChange={(el)=> setInvoiceFormat(el.target.value)} style={{maxWidth: '150px'}}/> <Button type="primary" onClick={changeInvoiceFormat}>Zapisz</Button>

        <p style={{fontSize: 'small', marginTop: '50px'}}>
        [YC] - kolejny nr liczony od początku roku, np. 1,2 itd.<br/>
        [MC] - kolejny nr liczony od początku miesiąca<br/>
        [DC] - kolejny nr liczony w danym dniu<br/>
        [YYYY] - rok czterocyfrowy np. 2022<br/>
        [MM] – miesiąc<br/>
        [DD] - dzień<br/>
    </p>



    </Card>)
}