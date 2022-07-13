import React from 'react';

export const Home = () => {
    return (
        <>
        <h1>Witaj na Stronie projektu Faktus.pl</h1>
            <p>Aplikacja powstała na szybko w celach edukacyjnych, dlatego też nie nadaje się do użytku 😊
            </p>
            <p>Do frontendu został wykorzystany React z biblioteką  <a href="https://ant.design/">antd</a></p>
            <p>Jak się później okazało był to zły wybór 😂 required i wartości domyślne, które ze sobą nie współpracują w formie to coś na co już nie mam czasu 😒</p>
            <p>backend - NestJS</p>

            <p>Poniżej przedstawiam funkcje jakie aktualnie posiada:</p>
        <ul>
            <li>
                rejestracja użytkownika (hasło szyfrowane - bcrypt, jwt)
            </li>
            <li>
                dodawanie firm (jeden użytkownik może mieć kilka firm)
            </li>
            <li>
                tworzenie faktur, wyświetlanie wszystkich
            </li>
            <li>
                zmiana statusu faktur (wystawiona, wysłana, zapłacona)
            </li>
            <li>
                automatyczny status "Faktura Przeterminowana" jeżeli minął termin płatności, a nadal nie ma statusu "zapłacona"
            </li>

        </ul>



        </>
    )
}