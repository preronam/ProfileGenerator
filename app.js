const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const responses = []
const questions = [
    {
        type: "list",
        name: "role",
        message: "What is the employee's role on the team?",
        choices: ["Manager", "Intern", "Engineer"]
    },
    {
        type: "input",
        name: "name",
        message: "Please enter the employee's full name: "
    },
    {
        type: "input",
        name: "email",
        message: "What is the employee's email address?"
    },
    {
        type: "input",
        name: "id",
        message: "What is the employee's ID number?"
    },
    {
        type: "input",
        name: "school",
        message: "What school does the intern attend?",
        when: function(answers) {
            return answers.role === "Intern";
          }
    },
    {
        type: "input",
        name: "github",
        message: "What is the engineer's GitHub username?",
        when: function(answers) {
            return answers.role === "Engineer";
          }
    },
    {
        type: "input",
        name: "office",
        message: "What is the manager's office number?",
        when: function(answers) {
            return answers.role === "Manager";
          }
    },
    {
        type: "confirm",
        name: "addEmployee",
        message: "Would you like to add another employee to the team?"
    },
]
function askUser(){
    inquirer.prompt(questions)
    .then(answers => {
        responses.push(answers)
        if(answers.addEmployee){
            askUser();
        }
        else {
            const team = responses.map(worker =>{
                switch(worker.role){
                    case "Manager":
                        return new Manager(worker.name, worker.id, worker.email, worker.office)
                    case "Engineer":
                        return new Engineer(worker.name, worker.id, worker.email, worker.github)
                    case "Intern":
                        return new Intern(worker.name, worker.id, worker.email, worker.school)
                    default:
                        throw "Employee Type Not Known"
                }
            });
            fs.writeFile(outputPath, render(team), err =>{
                if(err){
                    throw err
                }
                console.log("You have successfully created a team!")
            });
            
        }
    })
    .catch(err => {
        if(err){
            console.log("Error: ", err);
        }
    })
}

askUser();
