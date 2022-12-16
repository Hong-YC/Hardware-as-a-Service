from flask import Flask, send_from_directory, jsonify, request
from pymongo import MongoClient
import certifi
import bcrypt

app = Flask(__name__, static_url_path='', static_folder='ui/build/')

def encrypt(passw):
    bytes = passw.encode('utf-8')
    salt = bcrypt.gensalt()
    hash = bcrypt.hashpw(bytes, salt)
    return hash

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/createUser/', methods=['POST'])
def create_user():
    if request.method == 'POST':
        data = request.json
        userID = data['userID']
        username = data['username']
        password = encrypt(data['passw'])
        # Connect to MongoDB
        db = get_Database()
        user_collection = db.User

        # check whether the userID exist already
        if findUser(userID, user_collection) is None:  # This is a valid userID!
            # TODO: Encrypt the password!
            new_user = {"username": username,
                        "userID": userID,
                        "password": password,
                        "joinedProjects": []}
            # Add the new user into the database
            user_collection.insert_one(new_user)

            return jsonify({
                "success": True,
                "errorMessage": None
            })
        else:  # The userID exist! return an error message
            return jsonify({
                "success": False,
                "errorMessage": "This UserID already exists! Please choose another one."
            })


@app.route('/api/loginUser/', methods=['POST'])
def login_user():
    if request.method == 'POST':
        data = request.json
        userID = data['userID']
        password = data['passw']
        passbytes = password.encode('utf-8')
        # Connect to DB
        db = get_Database()
        user_collection = db.User

        user = findUser(userID, user_collection)
        if user is not None:  # The userID is in the User database
            # TODO: Encrypt the password
            if bcrypt.checkpw(passbytes, user["password"]):  # The password is correct!
                return jsonify({
                    "success": True,
                    "errorMessage": "",
                    "username": user["username"],
                    "userID": user["userID"]
                })
            else:  # Incorrect password
                return jsonify({
                    "success": False,
                    "errorMessage": "Incorrect password",
                    "username": None,
                    "userID": None
                })
        else:  # UserID doesn't exist
            return jsonify({
                "success": False,
                "errorMessage": "UserID does not exist",
                "username": None,
                "userID": None
            })

@app.route('/api/createProject/<string:projID>/<string:name>/<string:description>/<string:authorizedUserIDs>/<string:currentUserID>', methods=['POST'])
def create_project(name, projID, description, authorizedUserIDs, currentUserID):
    if request.method == 'POST':
        db = get_Database()
        proj_collection = db.Project
        user_collection = db.User

        user = findUser(currentUserID, user_collection)
        proj = findProject(projID, proj_collection)
        
        if proj is None: # This is a valid projID!

            autUserIds = processAuthorizedUserIDs(authorizedUserIDs)
            autUserIds.add(currentUserID)
            autUserIds.add("Eking")
            autUserIds.add("Asamant")
            authorizedUsers = list(autUserIds)

            new_proj = {
                "projID":  projID,
                "projName": name,
                "projDescription": description,
                "authorizedUsers": authorizedUsers, # [currentUserID, "Eking", "Asamant"],
                "set1CheckedOutUnits": 0,
                "set2CheckedOutUnits": 0
            }
            # Add the new project to the database
            proj_collection.insert_one(new_proj)

            # Add project to the joined projects of the user
            user["joinedProjects"].append(projID)
            userFilter = {"userID": currentUserID}
            newValue = {"$set": {"joinedProjects": user["joinedProjects"]}}
            user_collection.update_one(userFilter, newValue)

            return jsonify({
                "success": True,
                "errorMessage": None
            })
        else:  # ProjID already exist!!!
            return jsonify({
                "success": False,
                "errorMessage": "Invalid ProjectID. This ID already exists!"
            })


@app.route('/api/editProject/<string:projID>/<string:name>/<string:description>/<string:authorizedUserIDs>',  methods=['POST'])
def edit_project(projID, name, description, authorizedUserIDs):
    if request.method == 'POST':
        db = get_Database()
        proj_collection = db.Project
        proj = findProject(projID, proj_collection)
        if proj is None:
            return jsonify({
                "success": False,
                "errorMessage": "No such Project"
            })

        # Edit the project info
        autUserIds = processAuthorizedUserIDs(authorizedUserIDs)
        # autUserIds.add(currentUserID) #TODO: add currentUserID in frontend
        autUserIds.add("Eking")
        autUserIds.add("Asamant")
        authorizedUsers = list(autUserIds)

        projFilter = {"projID": projID}
        newValue = {"$set": {"projName": name,
                             "projDescription": description,
                             "authorizedUsers": authorizedUsers}}
        proj_collection.update_one(projFilter, newValue)

        return jsonify({
            "success": True,
            "errorMessage": ""
        })


@app.route('/api/joinProject/<string:projID>/<string:currentUserID>', methods=['POST'])
def join_project(currentUserID, projID):

    if request.method == 'POST':
        db = get_Database()
        user_collection = db.User
        proj_collection = db.Project
        user = findUser(currentUserID, user_collection)
        proj = findProject(projID, proj_collection)

        if user is None:
            return jsonify({
                "success": False,
                "errorMessage": "No such User!"
            })
        if proj is None:
            return jsonify({
                "success": False,
                "errorMessage": "No such Project"
            })

        # Check whether the user is authorized to join the project
        if currentUserID in proj["authorizedUsers"]:
            if projID not in user["joinedProjects"]:
                user["joinedProjects"].append(projID)
                # Update the DB
                userFilter = {"userID": currentUserID}
                newValue = {"$set": {"joinedProjects": user["joinedProjects"]}}
                user_collection.update_one(userFilter, newValue)

                return jsonify({
                    "success": True,
                    "errorMessage": None
                })
            else:
                return jsonify({
                    "success": False,
                    "errorMessage": "You already joined this project!"
                })
        else:
            return jsonify({
                "success": False,
                "errorMessage": "You are not authorized to join this project!"
            })


@app.route('/api/leaveProject/<string:projID>/<string:currentUserID>', methods=['POST'])
def leave_project(currentUserID, projID):

    if request.method == 'POST':
        db = get_Database()
        user_collection = db.User
        proj_collection = db.Project
        user = findUser(currentUserID, user_collection)
        proj = findProject(projID, proj_collection)

        if user is None:
            return jsonify({
                "success": False,
                "errorMessage": "No such User!"
            })
        if proj is None:
            return jsonify({
                "success": False,
                "errorMessage": "No such Project"
            })

        # Check whether the user has joined the project
        if projID in user["joinedProjects"]:
            user["joinedProjects"].remove(projID)
            # Update the DB
            userFilter = {"userID": currentUserID}
            newValue = {"$set": {"joinedProjects": user["joinedProjects"]}}
            user_collection.update_one(userFilter, newValue)

            return jsonify({
                "success": True,
                "errorMessage": None
            })
        else:
            return jsonify({
                "success": False,
                "errorMessage": "You haven't joined this project!"
            })


@app.route('/api/getProjects/<string:currentUserID>', methods=['GET'])
def get_projects(currentUserID):
    """
    Return hardware set and project information for current User
    """
    if request.method == 'GET':
        db = get_Database()
        user_collection = db.User
        proj_collection = db.Project
        hw_collection = db.HardwareSet
        user = findUser(currentUserID, user_collection)

        if user is None:
            return jsonify({
                "success": False,
                "errorMessage": "No such User!",
                "sets": None,
                "joinedProjects": None
            })
        sets = get_sets_info(hw_collection)
        Projects = []
        for projID in user["joinedProjects"]:
            Projects.append(get_project_info(projID, proj_collection))

        return jsonify({
            "success": True,
            "errorMessage": "",
            "sets": sets,
            "joinedProjects": Projects
        })


@app.route('/api/checkOut/<string:projID>/<string:setID>/<int:qty>/<string:currentUserID>', methods=['POST'])
def checkout_hw(currentUserID, projID, setID, qty):
    if request.method == 'POST':
        db = get_Database()
        user_collection = db.User
        proj_collection = db.Project
        hw_collection = db.HardwareSet
        user = findUser(currentUserID, user_collection)
        proj = findProject(projID, proj_collection)
        hw_set = findSet(setID, hw_collection)

        if user is None:
            return jsonify({
                "success": False,
                "errorMessage": "No such User!"
            })
        if proj is None:
            return jsonify({
                "success": False,
                "errorMessage": "No such Project"
            })
        # Check whether user is authorized
        if currentUserID not in proj["authorizedUsers"]:
            return jsonify({
                "success": False,
                "errorMessage": "Unauthorized Action"
            })
        # Check whether user has joined the project
        if projID not in user["joinedProjects"]:
            return jsonify({
                "success": False,
                "errorMessage": "You haven't joined this project!"
            })

        if qty < 0:
            return jsonify({
                "success": False,
                "errorMessage": "Invalid input!"
            })

        # Check whether there is enough hardware left
        if hw_set["availability"] < qty:
            return jsonify({
                "success": False,
                "errorMessage": "Not enough sets left for checkout!"
            })

        # Perform checkout
        # Update hardware availability
        hwFilter = {"setID": setID}
        newValue = {"$set": {"availability": hw_set["availability"] - qty}}
        hw_collection.update_one(hwFilter, newValue)

        # Update Project checkout unit
        projFilter = {"projID": projID}
        projCheckoutSet = "set1CheckedOutUnits" if setID == "1" else "set2CheckedOutUnits"
        newValue = {"$set": {projCheckoutSet: proj[projCheckoutSet] + qty}}
        proj_collection.update_one(projFilter, newValue)

        return jsonify({
            "success": True,
            "errorMessage": None
        })


@app.route('/api/checkIn/<string:projID>/<string:setID>/<int:qty>/<string:currentUserID>', methods=['POST'])
def checkin_hw(currentUserID, projID, setID, qty):
    if request.method == 'POST':
        db = get_Database()
        user_collection = db.User
        proj_collection = db.Project
        hw_collection = db.HardwareSet
        user = findUser(currentUserID, user_collection)
        proj = findProject(projID, proj_collection)
        hw_set = findSet(setID, hw_collection)

        if user is None:
            return jsonify({
                "success": False,
                "errorMessage": "No such User!"
            })
        if proj is None:
            return jsonify({
                "success": False,
                "errorMessage": "No such Project"
            })
        # Check whether user is authorized
        if currentUserID not in proj["authorizedUsers"]:
            return jsonify({
                "success": False,
                "errorMessage": "Unauthorized Action"
            })
        # Check whether user has joined the project
        if projID not in user["joinedProjects"]:
            return jsonify({
                "success": False,
                "errorMessage": "You haven't joined this project!"
            })

        if qty < 0:
            return jsonify({
                "success": False,
                "errorMessage": "Invalid input!"
            })

        projCheckoutSet = "set1CheckedOutUnits" if setID == "1" else "set2CheckedOutUnits"

        # Check whether there is enough hardware to check in
        if proj[projCheckoutSet] < qty:
            return jsonify({
                "success": False,
                "errorMessage": "Not enough sets to check in!"
            })

        # Perform checkin
        # Update hardware availability
        hwFilter = {"setID": setID}
        newValue = {"$set": {"availability": hw_set["availability"] + qty}}
        hw_collection.update_one(hwFilter, newValue)

        # Update Project checkout unit
        projFilter = {"projID": projID}
        newValue = {"$set": {projCheckoutSet: proj[projCheckoutSet] - qty}}
        proj_collection.update_one(projFilter, newValue)

        return jsonify({
            "success": True,
            "errorMessage": None
        })


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


def processAuthorizedUserIDs(authorizedUserIDs):
    authorizedUserIDs = authorizedUserIDs.strip()
    if len(authorizedUserIDs) == 0:
        return set()

    autUserIDs = [userID.strip() for userID in authorizedUserIDs.split(",") if len(userID.strip()) > 0]
    return set(autUserIDs)


def get_project_info(projID, proj_col):
    project = findProject(projID, proj_col)
    return {
        "projID": project["projID"],
        "projName": project["projName"],
        "projDescription": project["projDescription"],
        "authorizedUsers": project["authorizedUsers"],
        "set1CheckedOutUnits": project["set1CheckedOutUnits"],
        "set2CheckedOutUnits": project["set2CheckedOutUnits"]
    }


def get_sets_info(hw_col):
    hwSet1 = hw_col.find_one({'setID': '1'})
    hwSet2 = hw_col.find_one({'setID': '2'})
    return [
        {
            "setID": hwSet1["setID"],
            "capacity": hwSet1["capacity"],
            "availability": hwSet1["availability"]
        },
        {
            "setID": hwSet2["setID"],
            "capacity": hwSet2["capacity"],
            "availability": hwSet2["availability"]
        }
    ]


def get_Database():
    client = MongoClient(
        "mongodb+srv://hhhong:qUm3lloxJHPThmyu@cluster0.7mhaxdv.mongodb.net/?retryWrites=true&w=majority", \
        tlsCAFile=certifi.where())
    # get the user collection from EE461L_DB database
    return client.EE461L_DB


def findUser(userID, user_col):
    """
    Find the user in the user collection, return None if not exist
    """
    return user_col.find_one({'userID': userID})


def findProject(projID, proj_col):
    """
    Find the project in the project collection, return None if not exist
    """
    return proj_col.find_one({'projID': projID})


def findSet(setID, set_col):
    """
    Find the hardware set in the hardware collection, return None if not exist
    """
    return set_col.find_one({'setID': setID})


if __name__ == '__main__':
    app.run()
    # app.run()
    # print(processAuthorizedUserIDs("7777, Eking, 2222"))
    # flask_app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))


