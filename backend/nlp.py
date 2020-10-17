import re
import nltk
from nltk.corpus import stopwords
stop = stopwords.words('english')


# uncomment this if you are running the code first time
# this will load the required nltk libraries
"""
nltk.download('maxent_ne_chunker')
nltk.download('words')
"""

def extract_phone_numbers(string):
    """
        function to extract all syntactical types of phone numbers 
        from a string
    """
    phone_numbers = re.findall(r'[\+\ +\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]', string)
    return [re.sub(r'\D', '', number) for number in phone_numbers]

def extract_email_addresses(string):
    """
        function to extract email address from a string
    """
    r = re.compile(r'[\w\.-]+@[\w\.-]+')
    return r.findall(string)

def ie_preprocess(document):
    """
        function to preprocess the text
    """
    document = ' '.join([i for i in document.split() if i not in stop])
    sentences = nltk.sent_tokenize(document)
    sentences = [nltk.word_tokenize(sent) for sent in sentences]
    sentences = [nltk.pos_tag(sent) for sent in sentences]
    return sentences

def extract_names(document):
    """
        function to extract names from a string
    """
    names = []
    sentences = ie_preprocess(document)
    for tagged_sentence in sentences:
        for chunk in nltk.ne_chunk(tagged_sentence):
            if type(chunk) == nltk.tree.Tree:
                if chunk.label() == 'PERSON':
                    names.append(' '.join([c[0] for c in chunk]))
    res = []
    return names

def get_contacts(string):
    """
        driver function to extract contacts from a string
    """
    numbers = extract_phone_numbers(string)
    emails = extract_email_addresses(string)
    names = extract_names(string)
    return {"numbers" : numbers, "emails" : emails, "names" : names}