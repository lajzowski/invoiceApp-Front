## Aplikacja zaliczeniowa MegaK do fakturowania (FRONT-END)

Aplikacja powstała na szybko w celach edukacyjnych, dlatego też nie nadaje się do użytku 😊

Do frontendu został wykorzystany React z biblioteką antd

Jak się później okazało był to zły wybór 😂 required i wartości domyślne, które ze sobą nie współpracują w formie to coś na co już nie mam czasu 😒

backend - NestJS

Poniżej przedstawiam funkcje jakie aktualnie posiada:

rejestracja użytkownika (hasło szyfrowane - bcrypt, jwt)
dodawanie firm (jeden użytkownik może mieć kilka firm)
tworzenie faktur, wyświetlanie wszystkich
zmiana statusu faktur (wystawiona, wysłana, zapłacona)
automatyczny status "Faktura Przeterminowana" jeżeli minął termin płatności, a nadal nie ma statusu "zapłacona"