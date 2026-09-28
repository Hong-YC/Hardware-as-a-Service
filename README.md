# Hardware-as-a-Services application
This is a hardware rental web application built with React, Flask, and MongoDB. It allows users to:

1. Register and manage an account
2. Create or join projects
3. Check hardware in and out

See the [User Documentation](https://github.com/Hong-YC/Hardware-as-a-Service/wiki/User-Documentation) for more details.


This project is based on the starter repo: https://github.com/evmaki/ee461-react-flask-heroku

A: If you try to deploy this repository _with no changes_ it _should_ work. The first place to look is the _build logs_ that are generated when you try to deploy.
- If your error appears under "Installing requirements with pip" in the build logs, you are probably missing a Python dependency in ``requirements.txt``. Make sure any additional libraries you are using for your Flask app are included in ``requirements.txt``.
- If your error happens AFTER deployment when you try to access the app in the browser, then you might have a bug in your Flask app that is causing it to crash. Access your app on the Heroku web panel, go to "More" on the top-ish right-hand side, and go to "View logs". These logs are equivalent to the terminal output you see when running a Python program on your computer. There is useful information there that will help you debug your app.
