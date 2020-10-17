import requests
import nlp
import enchant
import pymongo
import os
from bs4 import BeautifulSoup

# load the english dictionery
eng_dic = enchant.Dict("en_US")

# connect to mongodb database
client = pymongo.MongoClient(os.getenv('MONGO_ATLAS_URI'))
db = client.get_database('sourcerer')
contacts = db.contacts

def validno(number):
	"""
		extra validation for a phone number
	"""
	c = 0
	plus = False
	for x in number:
		if(x == '+'):
			plus = True
		if(x >= '0' and x <= '9'):
			c = c + 1
	if(c >= 10 and c <= 12):
		return True
	return False


def get_contacts(url):
	"""
		driver function to contacts from html of the given url
	"""
	
	# check if url is already cached
	# if cached then return the response here itself
	try:
	    res = contacts.find_one({"url" : url})
	    return res["ret"]
	except:

		# get the html content of webpage
		r = requests.get(url)
		html = r.text
		dic = nlp.get_contacts(html)

		dic_numbers = []
		dic_emails = []
		dic_names = []

		# get numbers
		sn = set()
		for x in dic["numbers"]:
			if validno(x) is True and x not in sn: 
				dic_numbers.append(x)
				sn.add(x)

		# get emails
		se = set()
		for x in dic["emails"]:
			if(x.find(".") != -1):
				if x not in se:
					dic_emails.append(x)
					se.add(x)

		# get names
		allnames = dic["names"]
		s = set()
		for x in range(0, len(allnames)):
			lis = allnames[x].split()
			flag = False
			for y in lis:
				if(eng_dic.check(y.lower()) == True):
					flag = True
					break
			if flag == False:	
				if allnames[x] not in s:		
					dic_names.append(allnames[x])
					s.add(allnames[x])

		# beautifulsoup tokenizes html
		soup = BeautifulSoup(html, 'html.parser')
		
		# these social profiles will be scraped
		social_links_domain = [
		 'pinterest.com',
		 'youtube.com',
		 'linkedin.com',
		 'facebook.com',
		 'flipboard.com',
		 'instagram.com',
		 'plus.google.com',
		 'instagram.com',
		 'twitter.com'
		]
		
		# find all the social links from the page
		social_links = []
		for a in soup.find_all('a', href=True):
			ss = str(a['href'])
			for x in social_links_domain:
				if(ss.find(x) != -1):
					social_links.append(ss)
					break

		# make the response
		ret = {"numbers" : dic_numbers, "emails" : dic_emails, "names" : dic_names, "social_links" : social_links}

		# add data to mongodb cache
		contacts.insert_one({"url" : url, "ret" : ret})
		
		# return the response
		return ret
