export const send = async (url: string, method: string, token: string, data?: any): Promise<any> => {

    const result = await fetch(`http://localhost:3001/${url}`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            charset: 'utf-8',
            mode: 'cors',
            Authorization: token!=='' ? `Bearer ${token}` : '',
        },
        method: method,
        body: JSON.stringify(data),
    });

    console.log(result);



    return {res: await result.json() , status: result.status};
}