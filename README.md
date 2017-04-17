# witai_bot
Bot for cinema tickets search

Использует NLP процессор на основе Wit.ai.

Чтобы получить данные по сеансам, парсит страницу Афиши.

```
$ node witbot2.js <WIT-TOKEN>
> Где посмотреть Живое?
Session 003d1440-21f0-11e7-966e-37d47db2c70e received Где посмотреть Живое?
The current context is {}
Wit extracted {"movie":[{"confidence":0.9891401350249142,"type":"value","value":"Живое"}],"intent":[{"confidence":0.9993275448521775,"value":"findCinema"}]}
Kinostar De Lux (Химки)
20:15
user said... Где посмотреть Живое?
sending... {"text":" Живое идёт в Kinostar De Lux (Химки) в 20:15"}
```
