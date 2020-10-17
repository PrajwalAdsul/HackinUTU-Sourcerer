import requests
import nlp
import enchant
import pymongo
from bs4 import BeautifulSoup

# load the english dictionery
eng_dic = enchant.Dict("en_US")

# connect to mongodb database
client = pymongo.MongoClient("mongodb+srv://praj:pra@cluster0-jpt7l.mongodb.net/test?retryWrites=true&w=majority")
db = client.get_database('sourcerer')
contacts = db.domains

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

def rec(url, numbers, emails, names, social_links, depth, set_urls):
	"""
		recursive function to get all urls and extract contacts
	"""
	set_urls.add(url)

	# adjust the depth of recursion appropriately
	# for huge domain and larger depth, it will take more time
	if(depth == 2):
		return

	# if url is not correct then return immediately
	try:
		r = requests.get(url)
		html = r.text
	except:
		return
	
	# get contacts from the current page
	dic = nlp.get_contacts(html)
	
	# get numbers
	sn = set()
	for x in dic["numbers"]:
		if validno(x) is True and x not in sn: 
				numbers.append(x)
				sn.add(x)
			
	# get emails
	se = set()
	for x in dic["emails"]:
		if(x.find(".") != -1):
			if x not in se:
				emails.append(x)
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
				names.append(allnames[x])
				s.add(allnames[x])

	# beautifulsoup tokenizes html
	soup = BeautifulSoup(html, 'html.parser')
	urls = []

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

	# get social links
	for a in soup.find_all('a', href=True):
		ss = str(a['href'])
		flag = False
		if ss.find(url) != -1 and ss not in set_urls:
			urls.append(ss)
			flag = True

		if flag is False:
			if ss[0] == '/':
				if url[len(url) - 1] == '/':
					link_url = url + ss[1 : len(ss)]
					if link_url not in set_urls and url.find(ss[1 : len(ss)]) == -1:
						urls.append(url + ss[1 : len(ss)])
				else:
					link_url = url + ss
					if link_url not in set_urls and url.find(ss) == -1:
						urls.append(url + ss)

		for x in social_links_domain:
			if(ss.find(x) != -1):
				social_links.append(ss)
				break
		
	# recur for further urls
	for x in urls:
		if(x not in s):
			rec(x, numbers, emails, names, social_links, depth + 1, set_urls)

def get_contacts(url):
	"""
		driver function to contacts from html of the given url domain
	"""

	# check if url is already cached
	# if cached then return the response here itself
	try:
	    res = contacts.find_one({"url" : url})
	    return res["ret"]
	except:
		numbers = []
		emails = []
		names = []
		social_links = []
		s = set()

		# recursively scrap all the links from the domain
		rec(url, numbers, emails, names, social_links, 0, s)
		final_numbers = []
		final_emails = []
		final_names = []
		final_social_links = []
		
		# get numbers
		sn = set()
		for x in numbers:
			if x not in sn:
				final_numbers.append(x)
				sn.add(x)

		# get emails
		sn = set()
		for x in emails:
			if x not in sn:
				final_emails.append(x)
				sn.add(x)

		# get names
		sn = set()
		for x in names:
			if x not in sn:
				final_names.append(x)
				sn.add(x)


		sn = set()
		for x in social_links:
			if x not in sn:
				final_social_links.append(x)
				sn.add(x)

		# make the response
		ret = {"numbers" : final_numbers, "emails" : final_emails, "names" : final_names, "social_links" : final_social_links}
		
		# add data to mongodb cache
		contacts.insert_one({"url" : url, "ret" : ret})
		return ret