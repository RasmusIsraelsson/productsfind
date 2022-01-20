# Product Frontend

## Intro:

Hej! Detta är en React frontend som visar upp mina produkter och dess priser
under vissa datum i en snygg tabell.
Tack för att ni tar er tiden att kika igenom min kod!
Allt gott,
Rasmus, er framtida kollega ;)

## Live Demo

Exempel 1: "https://productfind.herokuapp.com/?catnr=27773-02"
Exempel 2: "https://productfind.herokuapp.com/?catnr=20866-02"

## Kod som är intressant för er att kolla på

```
src
└───MyTable.jsx                     # Displaying data in a table
└───SortData.js                     # sorting data in correct order
```

## Installera programmet och kör lokalt på er dator:

### Prerequisites:

- CommandLine/Terminal installerat på din dator
- NodeJS version 14.18.1+
- NPM version 8.3.0+ CLI installerat
- GIT CLI installed

### Command line - Kör programmet:

1. Öppna din Commandline
2. Kör kommandot `git clone https://github.com/RasmusIsraelsson/productsfind.git`
3. Gå in i productfind mappen genom att köra kommandot `cd productfind`
4. Kör `npm i` för att installera alla programmets dependencies
5. Kör `npm start` för att köra programmet

### Pages

`/?catnr=[CatalogEntryCode]`<br>
Denna sida visar en produkts prishistoria efter en specifierad CatalogEntryCode

### Kontakt:

Om ni har några frågor kan ni alltid nå mig på rasmus.israelsson1@gmail.com
