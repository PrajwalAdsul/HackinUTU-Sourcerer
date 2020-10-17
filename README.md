# HackinUTU-Sourcerer


## Implementation of project Sourcerer
### Team ID - 418
### PS ID - 46
<br />

### Technologies used 
Python <br />
JS <br />
NLTK + REGEX <br />
Web scraping <br />
Chrome API <br />
Mongo DB

<br />

### Plugin in action
![ext](https://github.com/PrajwalAdsul/HackinUTU-Sourcerer/blob/main/screenshots/extension.png)

### Highlighting contacts
![highlight](https://github.com/PrajwalAdsul/HackinUTU-Sourcerer/blob/main/screenshots/highlight.gif)

<br />

### Idea

Chrome Extension <br />
Easy + Elegant UI - Highlighting contacts <br />
Backend Regex + NLP model to extract contact information <br />
Fine tuning model <br />
Caching data at backend

<br />


#### Chrome Plugin
###### JavaScript
Background script and Content script
###### CSS
To highlight details in webpage and display properly in pop up UI as well
###### Chrome API
Chrome Tabs and Runtime API to get access to DOM content of webpage

<br />

#### Backend
###### Regex
re python library
###### NLP
Python nltk + pyenchant  
###### Caching
Atlas mongodb

<br />

### Directory structure
```
.
├── backend
│   ├── domainscrap.py
│   ├── nlp.py
│   ├── README.md
│   ├── requirements.txt
│   ├── server.py
│   └── webscrap.py
├── extension
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   ├── content.js
│   │   └── popup.js
│   ├── manifest.json
│   ├── popup.html
│   ├── README.md
│   └── screenshot.png
├── README.md
└── screenshots
    ├── extension_1.png
    ├── extension_2.png
    └── extension.png
```
<br />

### Running server

#### Install python and pip if not installed before
```
> sudo apt update
> sudo apt install python3.8
> sudo apt install python3-pip

```

#### Run python flask server
```
> git clone https://github.com/PrajwalAdsul/HackinUTU-Sourcerer.git
> cd HackinUTU-Sourcerer
> cd backend
> pip3 install -r requirements.txt 
> python3 server.py
```
<br />

#### Running Chrome Extension
```
> Open your Chromium Based Browser 
> Go to chrome://extensions/ 
> Turn on the developers mode on the top right
> Click on the Load unpacked to upload the extension directory 
> You can see extension uploaded into chrome
> Pin the extension to toolbar which is on the right side of search bar
```
For more information refer this [Link](https://support.google.com/chrome_webstore/answer/2664769?hl=en)

<br />

#### Features
Get contacts easily <br />
Scrap domains <br />
Import contacts to csv <br />


### Uses
Networking - Easy access to contacts <br />
Knowing the best vendor <br />
People connected to a particular organization <br />

<br />
