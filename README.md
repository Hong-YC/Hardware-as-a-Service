# Hardware-as-a-Services application
This is a hardware rental web application built with React, Flask, and MongoDB. It allows users to:

1. Register and manage an account
2. Create or join projects
3. Check hardware in and out

See the [User Documentation](https://github.com/Hong-YC/Hardware-as-a-Service/wiki/User-Documentation) for more details.


This project is based on the starter repo: https://github.com/evmaki/ee461-react-flask-heroku


## React/Flask Starter App on Heroku
The following steps demonstrate the setup and deployment of this React/Flask app hosted on Heroku.

(Note: As Heroku no longer support free server hosting, this app is not hosting on any server currently.)

### app.py
This contains the Flask backend. The ``/`` route serves up the built React app that is placed in ``/ui/build/`` each time you build the React frontend. You can run the backend by running the following on your command line in the top-level directory:

``flask run``

### /ui
This contains the React frontend. Run ``npm install`` after cloning this repo to install the ``node_modules``. 

Each time you make changes to it, **you need to _manually build it_** by running the following on the command line in the ``/ui`` directory:

``npm run build``

### requirements.txt
This is a list of Python libraries used by your Flask backend. Heroku uses it to install all of the dependencies used by your Flask app.

### Suggested Workflow
Follow this suggested workflow as you make changes to increase your chances of success:

1. **Fork this repo**, then clone it using ``git clone https://github.com/yourgithubusername/ee461-react-flask-heroku.git``
2. Open two terminals: one for working on React and another for Flask. We'll call these "React terminal" and "Flask terminal".
3. Install React dependencies. In your React terminal, ``cd ui`` then ``npm install``.
4. Build the React app. Run ``npm run build`` in your React terminal, in the ``ui`` directory.
5. Start the Flask app. Run ``flask run`` in your Flask terminal, in the same directory as ``app.py``.
6. Go to ``localhost:5000`` in your browser. The starter React app page should show up.
7. When you make changes to your React app, **repeat step 4**.
8. When you make changes to your Flask app, **repeat step 5**.
9. When you are ready to deploy:
    - Create a new app on Heroku
    - Connect Heroku to your GitHub account (if you haven't already)
    - Search for this repository under your new Heroku app > Deploy > Connect to GitHub (bottom of the page) and connect to it
    - At the bottom of the Deploy page under Manual deploy, select the main branch and click Deploy Branch
    - If/when deployment fails, view the build log to learn why

### FAQ
Q: Why isn't it working when I try to deploy to Heroku?

A: If you try to deploy this repository _with no changes_ it _should_ work. The first place to look is the _build logs_ that are generated when you try to deploy.
- If your error appears under "Installing requirements with pip" in the build logs, you are probably missing a Python dependency in ``requirements.txt``. Make sure any additional libraries you are using for your Flask app are included in ``requirements.txt``.
