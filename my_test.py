from app import app


# def test_create_project2():
#     with app.test_client() as test_client:
#         exist_userID = "2222"
#         new_projID = "aut_project"
#         name = "test_authorized_user"
#         description = "testing"
#         authorizeUserID = "test_user, 123"
#         url = f"/api/createProject/{new_projID}/{name}/{description}/{authorizeUserID}/{exist_userID}"
#         response = test_client.post(url)
#         assert response.status_code == 200
#

def test_create_project():
    """
    Test creating new project with existing ProjID
    """
    with app.test_client() as test_client:
        """
        Given a exist projID and userID in the database
        When user try to create a project with that projID
        Then return not success and error message "Invalid ProjectID. This ID already exists!"
        """

        exist_userID = "2222"
        exist_projID = "0001"
        name = "hahaha"
        description = "testing"
        authorizeUserID = "test_user, 123"
        url = f"/api/createProject/{exist_projID}/{name}/{description}/{authorizeUserID}/{exist_userID}"
        response = test_client.post(url)
        assert response.status_code == 200
        assert not response.json["success"]
        assert response.json["errorMessage"] == "Invalid ProjectID. This ID already exists!"


def test_checkout_hw():
    """
     Test checkout one unit of hwSet1 and hwSet2, check whether the available quantity decrease by one respectively
    """
    with app.test_client() as test_client:
        """
        Given a exist projID and userID, and that user is authorized and joined the project
        And given hardware 1 and 2 both have more than one unit of hardware available => We first assume this is true
        When user checkout one unit of hardware 1 and 2
        Then return success and the availability of hardware 1 and 2 should decrease by one 
        """
        # Get the initial availability of hardware 1 and 2
        exist_userID = "2222"
        query_set_url = f"/api/getProjects/{exist_userID}"
        response = test_client.get(query_set_url)
        init_avail_1 = response.json["sets"][0]["availability"]
        init_avail_2 = response.json["sets"][1]["availability"]

        # Perform checkout
        exist_projID = "8888"
        setID_1 = "1"
        setID_2 = "2"
        checkout_qty = "1"

        # checkout hw 1
        url = f"/api/checkOut/{exist_projID}/{setID_1}/{checkout_qty}/{exist_userID}"
        response = test_client.post(url)
        assert response.status_code == 200
        assert response.json["success"]

        # checkout hw 2
        url = f"/api/checkOut/{exist_projID}/{setID_2}/{checkout_qty}/{exist_userID}"
        response = test_client.post(url)
        assert response.status_code == 200
        assert response.json["success"]


        response = test_client.get(query_set_url)
        cur_avail_1 = response.json["sets"][0]["availability"]
        cur_avail_2 = response.json["sets"][1]["availability"]
        assert (cur_avail_1 - init_avail_1) == -1
        assert (cur_avail_2 - init_avail_2) == -1


def test_checkin_hw():
    """
    Test checkin one unit of hwSet1, check whether the available quantity increase
    """
    with app.test_client() as test_client:
        """
        Given a exist projID and userID, and that user is authorized and joined the project
        And given the project have checkout more than one unit of hardware 1 => We first assume this is true
        When user checkin one unit of hardware 1
        Then return success and the availability of hardware 1 should increase by one 
        """
        # Get the initial availability of hardware set 1
        exist_userID = "2222"
        query_set_url = f"/api/getProjects/{exist_userID}"
        response = test_client.get(query_set_url)
        init_avail = response.json["sets"][0]["availability"]

        # Perform checkin
        exist_projID = "8888"
        setID = "1"
        checkin_qty = "1"
        url = f"/api/checkIn/{exist_projID}/{setID}/{checkin_qty}/{exist_userID}"
        response = test_client.post(url)
        assert response.status_code == 200
        assert response.json["success"]

        # Get the availability of hardware 1
        response = test_client.get(query_set_url)
        cur_avail = response.json["sets"][0]["availability"]
        assert (cur_avail - init_avail) == 1


def test_join_project():
    """
    Test joining an authorized project with existing userID, checkin hardware 2
    check whether the available quantity increase
    """
    with app.test_client() as test_client:
        """
        Given a exist projID and userID, and that user is authorized to join the project
        And given the project have checkout more than one unit of hardware 2 => We first assume this is true
        When user join and checkin one unit of hardware 2
        Then return success and the availability of hardware 2 should increase by one 
        """
        exist_userID = "test_user"
        exist_projID = "8888"
        setID = "2"

        # Get the initial availability of hardware set 1
        query_set_url = f"/api/getProjects/{exist_userID}"
        response = test_client.get(query_set_url)
        init_avail = response.json["sets"][1]["availability"]

        # Join the project
        join_url = f"/api/joinProject/{exist_projID}/{exist_userID}"
        response = test_client.post(join_url)
        assert response.status_code == 200
        assert response.json["success"]


        # Perform checkin
        checkin_qty = "1"
        url = f"/api/checkIn/{exist_projID}/{setID}/{checkin_qty}/{exist_userID}"
        response = test_client.post(url)
        assert response.status_code == 200
        assert response.json["success"]

        # Get the availability of hardware 2
        response = test_client.get(query_set_url)
        cur_avail = response.json["sets"][1]["availability"]
        assert (cur_avail - init_avail) == 1

        # Leave the project
        join_url = f"/api/leaveProject/{exist_projID}/{exist_userID}"
        response = test_client.post(join_url)
        assert response.status_code == 200
        assert response.json["success"]



def test_login_user():
    """
    Test login user (Just for practice, not in the requirement for hw7)
    """
    with app.test_client() as test_client:

        """
        Given a exist userID and password in the database
        When user login with that userID and password
        Then return success and the userID
        """
        userID = "test123"
        password = "123"

        url = "/api/loginUser/"+userID+"/"+ password
        response = test_client.get(url)

        assert response.status_code == 200
        assert response.json["success"]
        assert response.json["userID"] == userID

        """
        Given a userID and password in the database
        When user login with that userID but incorrect password
        Then return not success and the error message "Incorrect password"
        """
        userID = "test123"
        incorrect_password = "1234"

        url = "/api/loginUser/" + userID + "/" + incorrect_password
        response = test_client.get(url)

        assert response.status_code == 200
        assert not response.json["success"]
        assert response.json["errorMessage"] == "Incorrect password"

        """
        Given a userID not in the database
        When user login with that userID
        Then return not success and the error message "UserID does not exist"
        """
        notExist_userID = "test1234"
        password = "1234"

        url = "/api/loginUser/" + notExist_userID + "/" + password
        response = test_client.get(url)

        assert response.status_code == 200
        assert not response.json["success"]
        assert response.json["errorMessage"] == "UserID does not exist"




if __name__ == '__main__':
    create_project()

