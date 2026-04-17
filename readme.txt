  Tema de casa — Tehnologii Web 2026
================================================================================
  POCKET TRADEPRO — Platforma de trading online
================================================================================


1. DESPRE PROIECT
--------------------------------------------------------------------------------
Am ales sa implementez o platforma de tranzactionare financiara inspirata din
aplicatii reale precum XTB si Revolut, pe care am numit-o Pocket TradePro.
Ideea a venit din interesul meu pentru piete financiare si din dorinta de a
construi ceva mai complex decat un magazin online clasic.

Platforma permite utilizatorilor sa vizualizeze piete financiare (actiuni,
criptomonede, obligatiuni, marfuri, ETF-uri), sa efectueze tranzactii simulate,
sa isi gestioneze portofoliul si sa acceseze stiri si evenimente de piata.
Toate datele sunt simulate (mock), deci nu este necesara o conexiune la un API
extern pentru testare.


2. ARHITECTURA TEMPLATE-URILOR
--------------------------------------------------------------------------------
Am organizat proiectul pe trei tipuri de fisiere, separate explicit, fara
stiluri inline in HTML:

  frontend/
  |-- pages/          -> fisierele HTML (structura paginilor)
  |-- sources/        -> fisierele JSX cu logica React si componentele UI
  |-- stylesheets/    -> fisierele CSS cu stilizarea vizuala
  |-- images/         -> resursele grafice (logo, imagini categorii, texturi)

Fiecare pagina are propriul triplet HTML + JSX + CSS cu acelasi nume de baza.
De exemplu, terminal.html, terminal.jsx si terminal.css formeaza impreuna
pagina principala a aplicatiei.

Paginile implementate:

  index.html      -> Homepage / Landing page
  login.html      -> Autentificare
  register.html   -> Creare cont
  profile.html    -> Editare profil utilizator
  terminal.html   -> Aplicatia principala (dashboard trading)
  admin.html      -> Panoul de administrare
  contact.html    -> Pagina de contact si suport
  stock.html      -> Detalii actiune (stock.html?symbol=AAPL)
  crypto.html     -> Detalii criptomoneda (crypto.html?symbol=BTC)
  bonds.html      -> Detalii obligatiune (bonds.html?symbol=US10Y)
  commodity.html  -> Detalii marfa (commodity.html?symbol=XAU)
  etf.html        -> Detalii ETF (etf.html?symbol=SPY)
  news.html       -> Articol de stire (news.html?id=X)

Am folosit urmatorul stack:
  - HTML5
  - CSS3 cu un design system propriu bazat pe variabile CSS
  - JavaScript / React 18 incarcat via CDN (fara build step, fara Node.js)
  - Bootstrap 5.3 + Bootstrap Icons 1.11 (via CDN)


3. INSTRUCTIUNI DE UTILIZARE
--------------------------------------------------------------------------------

PORNIREA APLICATIEI:
  Aplicatia trebuie rulata obligatoriu prin extensia "Live Server" din
  Visual Studio Code. Deschideti folderul proiectului in VS Code, click
  dreapta pe frontend/pages/index.html si alegeti "Open with Live Server".
  Deschiderea directa a fisierelor HTML nu functioneaza corect din cauza 
  path-urilor relative si a modului in care React incarca fisierele JSX.

NAVIGARE (fara server backend):
  Toate paginile permit navigarea completa fara un server backend. Link-urile
  dintre pagini functioneaza prin URL-uri relative standard.

FLUXUL PRINCIPAL:

  a) Homepage (index.html)
     Pagina de start cu prezentarea platformei. De aici se poate merge la
     inregistrare, autentificare sau intrare ca guest.
     Contine o galerie de imagini cu derulare automata la 3 secunde
     (componenta GallerySlider cu 4 imagini si puncte pentru navigare).

  b) Inregistrare (register.html)
     Completez: First name, Last name, Email, Password, Confirm password.
     Parola trebuie sa aiba minim 8 caractere, o cifra, o litera mare si
     un caracter special. Dupa inregistrare are loc redirectarea automata catre terminal.html.

  c) Autentificare (login.html)
     Se introduc email si parola, apoi se apasa Sign In.
     Contul de admin: 
            email: admin@tradepro.com 
            password: administrator
     Orice alt cont este redirectionat catre terminal.html.

  d) Terminal (terminal.html) — aplicatia principala
     Sidebar cu sectiunile disponibile:

     OVERVIEW      -> Valoare totala cont, grafic evolutie, holdings snippet,
                      watchlist si ultimele tranzactii
     PORTFOLIO     -> Portofoliu complet cu breakdown pe clase de active,
                      P&L total, grafic sparkline si lista holdings cu Buy/Sell
     STOCKS        -> Tabel cu 22 actiuni, filtre pe sector, carousel categorii
     CRYPTO        -> Tabel cu 12 criptomonede, filtre pe categorie
     BONDS         -> Tabel cu 10 obligatiuni (guvernamentale si corporative)
     ETF           -> Tabel cu 10 ETF-uri
     COMMODITIES   -> Marfuri (metale pretioase, petrol, gaze naturale)
     TRANSACTIONS  -> Istoricul complet al tranzactiilor cu panou analitic
     EXCHANGE      -> Convertor valutar cu 32 valute si grila rate
     FUNDING       -> Depunere si retragere fonduri cu selectie card bancar
     NEWS          -> Stiri financiare cu glob animat si ceas mondial
     EVENTS        -> Calendar evenimente de piata (earnings, dividende etc.)
     TRENDS        -> Fear & Greed Index, top gainers/losers, most active

     Click pe orice rand din tabel deschide pagina dedicata activului, cu
     grafic interactiv (Line / Candlestick), date fundamentale si panou
     de tranzactionare.

  e) Profil (profile.html)
     Accesat din meniul avatar din navbar. Contine 6 sectiuni:
     - Personal Info, Security, Preferences (tema, valuta, tip grafic),
       Payment Methods (carduri virtuale 3D), Account Verification, Status.

  f) Admin (admin.html)
     Acces exclusiv cu admin@tradepro.com / administrator.
     8 sectiuni: Users, Support (chat tichete), Market Data, Stats,
     News, Events, Exchange, Settings.

  g) Contact (contact.html)
     Date de contact, harta embed, linkuri social media, chat live cu suport
     (dezactivat in modul guest).

  h) Mod Guest (terminal.html?mode=guest)
     Acces la vizualizarea pietelor fara cont. Click pe orice activ sau pe
     actiuni restrictionate afiseaza un modal cu indemn la creare cont.


4. ROLURI UTILIZATORI
--------------------------------------------------------------------------------
Am implementat 3 roluri cu drepturi diferite:

  GUEST    -> Poate naviga pe homepage, login, register, contact si poate
              vizualiza pietele in terminal (read-only). Nu poate tranzactiona,
              nu are acces la portofoliu, tranzactii sau funding.

  USER     -> Acces complet la terminal: tranzactionare, portofoliu,
              istoric tranzactii, depunere/retragere fonduri, schimb valutar,
              editare profil si carduri bancare.

  ADMIN    -> Acces la panoul de administrare. Poate gestiona utilizatori,
              piete, stiri, evenimente, tichete de suport si setarile
              platformei.

5. CONTRIBUTII SI ELEMENTE DE ORIGINALITATE
--------------------------------------------------------------------------------
In afara de paginile de baza cerute, am adaugat o serie de functionalitati
si elemente vizuale pe care le consider interesante:

  - Glob pamantesc animat 3D in sectiunea News, construit din 4 straturi CSS
    suprapuse (textura noapte, textura zi, nori, shadow interior) cu rotatie
    continua si ceas mondial afisand ora live in 8 orase

  - Fear & Greed Index in sectiunea Trends — gauge semicircular SVG cu ac
    animat si 5 zone colorate, plus 5 indicatori de piata cu bare de progres

  - Carduri bancare virtuale 3D cu efect flip fata/verso, gradient aleator,
    chip EMV auriu, logo brand detectat automat (Visa/Mastercard/Amex) si
    un calendar picker custom pentru data de expirare

  - Market Summary Carousel sincronizat cu filtrele din tabel — carduri cu
    imagine de fundal per sector/categorie, navigare cu efect fade

  - Grafice SVG custom (line si candlestick sintetice) generate din datele
    de pret, cu selector de perioada si toggle tip grafic, prezente pe toate
    paginile de activ si in terminal

  - Currency Converter bidirectional cu 32 valute, conversie in timp real
    la editarea oricarui camp, animatie swap si grila de preturi paginate

  - Panou analitic in sectiunea Transactions cu donut chart interactiv
    (hover pe segmente si legenda), top simboluri cumparate si volume per tip

  - Design system propriu cu variabile CSS, tema dark/light comutabila instant
    si persistata in localStorage, cu detectia temei inainte de render React
    pentru a evita flash-ul de culoare la incarcare

  - Mod guest implementat via URL param (?mode=guest) cu restrictionare
    granulara pe sectiuni si actiuni individuale

  - Pagina de administrare cu 8 sectiuni functionale, incluzand un panou
    de statistici cu grila de performanta pe clase de active, suport chat
    in stil WhatsApp pe mobil si un sistem de notificari cu navigare directa

  - Responsive complet pe toate paginile (breakpoint unic 768px): sidebar
    drawer cu backdrop, tabele cu coloane selective, filtre dropdown in loc
    de pills, exchange list ca rows verticale

  - MarketSessionsDisplay cu 12 burse mondiale, ore locale live,
    logo oficial per bursa si badge Open/Closed calculat din timezone

  - Culoarea secundara din tema paginilor (verde) este aleasă în acord
    cu logo-ul aplicatiei.


6. TESTARE
--------------------------------------------------------------------------------
  Conexiunea la internet nu este necesara pentru functionarea de baza.
  Cateva resurse externe (steaguri tari, texturile globului)
  necesita internet pentru a se incarca corect.

================================================================================
