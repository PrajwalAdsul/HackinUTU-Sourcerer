# NLP Backend


## pip3 install -r requirements.txt
## python3 server.py

## API

### URL : /get/contacts

Get contacts from a webapge

POST 

REQUEST
{
	"url" : web_page_url
}

RESPONSE
{
	"numbers" : [Strings],
	"emails" : [Strings],
	"names" : [Strings],
	"social_links" : [Strings]
}
contains caught numbers, emails, names, social_links.
Use these strings to highlight the contect in html DOM.


### URL : /get/contacts/domain

Get contacts from a domain

POST 

REQUEST
{
	"url" : domain_url
}

RESPONSE
{
	"numbers" : [Strings],
	"emails" : [Strings],
	"names" : [Strings],
	"social_links" : [Strings]
}
contains caught numbers, emails, names, social_links.
Use these strings to highlight the contect in html DOM.