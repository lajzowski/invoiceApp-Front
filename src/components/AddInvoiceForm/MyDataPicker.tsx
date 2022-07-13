import React, {useEffect} from "react";
import {DatePicker} from "antd";
import moment from "moment";
interface Props {
    defaultValue: moment.Moment;
    setPaymentHandler: any;
    setDifferentDatePayHandler: () => void;
}
export const MyDataPicker = (props: Props) => {

useEffect(() => {

},[props.defaultValue])

    const changeValue = (value: any) => {
    props.setPaymentHandler(value);
    props.setDifferentDatePayHandler();
    }

    return (
        <DatePicker value={props.defaultValue} onChange={changeValue}/>
    )

}