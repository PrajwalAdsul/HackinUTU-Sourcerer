import string 

# import required flask extensions
from flask import Flask, request, jsonify
from flask_cors import CORS

# import the required code
import webscrap as ws 
import domainscrap as ds

app = Flask(__name__)  
CORS(app)

@app.route('/', methods = ['GET'])
def get():
	return jsonify("Sourcerer")

@app.route('/get/contacts', methods = ['POST'])
def getContacts():
	return jsonify(ws.get_contacts(request.json['url']))

@app.route('/get/contacts/domain', methods = ['POST'])
def getContactsDomain():
	return jsonify(ds.get_contacts(request.json['url']))

# run the flask app
if __name__ == '__main__': 
	app.run(debug = True) 
