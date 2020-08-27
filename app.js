const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
console.log(OUTPUT_DIR)
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Gather information about the development team members,
const questions = [
    {
        type: "input",
        message: "What is your manager's name?",
        name: "name"
    },
    {
        type: "input",
        message: "What is your manager's id?",
        name: "id"
    },
    {
        type: "input",
        message: "What is your manager's email?",
        name: "email",
        validate: function(name) {
            return  emailIsValid(name) || 'Please enter a number (hit up first then delete to try again).';
        }
    },
    {
        type: "input",
        message: "What is your manager's office number?",
        name: "office_number"
    },
    {
        type: "list",
        message: "What type of team member would you like to add?",
        name: "member_choice",
        choices: [
            'Engineer',
            'Intern',
            'I don\'t want any more team members'
        ]
    }
];

const internQuestions = [
    {
        type: "input",
        message: "What is your intern's name?",
        name: "name"
    },
    {
        type: "input",
        message: "What is your intern's id?",
        name: "id"
    },
    {
        type: "input",
        message: "What is your intern's email?",
        name: "email",
        validate: function(name) {
            return  emailIsValid(name) || 'Please enter a number (hit up first then delete to try again).';
        }
    },
    {
        type: "input",
        message: "What is your intern's school?",
        name: "school"
    },
    {
        type: "list",
        message: "What type of team member would you like to add?",
        name: "member_choice",
        choices: [
            'Engineer',
            'Intern',
            'I don\'t want any more team members'
        ]
    }
];

const engineerQuestions = [
    {
        type: "input",
        message: "What is your engineer's name?",
        name: "name"
    },
    {
        type: "input",
        message: "What is your engineer's id?",
        name: "id"
    },
    {
        type: "input",
        message: "What is your engineer's email?",
        name: "email",
        validate: function(name) {
            return  emailIsValid(name) || 'Please enter a number (hit up first then delete to try again).';
        }
    },
    {
        type: "input",
        message: "What is your engineer's GitHub username?",
        name: "github"
    },
    {
        type: "list",
        message: "What type of team member would you like to add?",
        name: "member_choice",
        choices: [
            'Engineer',
            'Intern',
            'I don\'t want any more team members'
        ]
    }
];

var employees = [];

async function getEmployees() {
    let memberChoice = await inquirer.prompt(questions)
        .then(function (response) {
            const manager = new Manager(response.name, response.id, response.email, response.office_number);
            employees.push(manager);
            return response.member_choice;
        })

    while (memberChoice !== 'I don\'t want any more team members') {
        if (memberChoice === 'Intern') {
            memberChoice = await inquirer.prompt(internQuestions)
                .then(function (response) {
                    const intern = new Intern(response.name, response.id, response.email, response.school);
                    employees.push(intern);
                    return response.member_choice;
                })
        } else {
            memberChoice = await inquirer.prompt(engineerQuestions)
                .then(function (response) {
                    const engineer = new Engineer(response.name, response.id, response.email, response.github);
                    employees.push(engineer);
                    return response.member_choice;
                })
        }
    }
    // Call the `render` function and pass in an array containing all employee objects
    const renderedHTML = render(employees)
    if (fs.existsSync(OUTPUT_DIR)) {
        console.log('The path exists.');
        writeHTML(renderedHTML)
    } else {
        console.log("File does not exist")
        fs.mkdir(OUTPUT_DIR, { recursive: true }, (err) => {
            if (err) throw err;
            writeHTML(renderedHTML)
        });
    }   
}
// function call to initialize program
getEmployees();

// Create an HTML file using the HTML returned from the `render` function.
function writeHTML(renderedHTML) {
    fs.writeFile(outputPath, renderedHTML, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Success!");
    })
}

function emailIsValid(email) {
    return /\S+@\S+\.\S+/.test(email)
}