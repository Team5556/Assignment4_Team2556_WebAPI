# Certification Provider System Web App

## Summary
A web app certification provider system with multiple roles.


## Installation
To run this project, complete the below steps:

**Step 1:** In order to set the security password as a local environment variable, run the below command in the command prompt as Administrator.
```
setx SECRET "SuperServerPassword" /M
```

**Step 2:** Restart your computer.

**Step 3:** Create and seed database locally,
open package manager and run below command.

```
Update-Database
```

**Step 4:** Start backend application.

**Step 5:** Manually register Admin, Marker, Quality Control and Candidate roles using Postman.
Import the necessary JSON files, included in the Register_Users.postman_collection.json.

**Step 6:** Install necessary React.js packages and run application

```
cd frontend/user-interface
npm install --legacy-peer-deps
npm start
```
## Roles Explanation

### Candidate:
- Access to Certificate EShop
- Purchase certificates with credit-based system
- Schedule exams at their discretion with issused voucher after purchase
- Take exam and receive instantly the preliminary results from the automated marking system
- After marking is finalized, candidates can access their acquired certificates

### Admin:
- Full CRUD ability for candidates, certificates, topics, exams and questions.
- Has full access to all data
- Delegate marking tasks to markers

### Marker:
- Approve or disqualify results given by automated marking system of assigned exams

### Quality Control:
- Read-only access to all data

## Usernames and Passwords
- Candidate --> username: candidate / password: candidate
- Admin --> username: admin / password: admin
- Marker --> username: marker / password: marker
- Quality Control --> username: qualitycontrol / password: qualitycontrol

## Technologies:
- .NET 6 / ASP.NET Core 6 Web API
- Identity Authentication / JWT Token
- EF Core 6
- React.js
- CKEditor
- Axios
- AutoMapper
- Task (Asynchronous Model)
- React-router-dom
- Bootstrap
- Bootswatch
- DualListBox
