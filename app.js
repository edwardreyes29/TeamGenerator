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


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
// array of questions for user
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
        name: "email"
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
        name: "email"
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
        name: "email"
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
    // After the user has input all employees desired, call the `render` function (required
    // above) and pass in an array containing all employee objects; the `render` function will
    // generate and return a block of HTML including templated divs for each employee!
    const renderedHTML = render(employees)
    if (fs.existsSync(OUTPUT_DIR)) {
        console.log('The path exists.');
        writeHTML(renderedHTML)
    }else {
        console.log("File does not exist")
        fs.mkdir(OUTPUT_DIR, { recursive: true }, (err) => {
            if (err) throw err;
            writeHTML(renderedHTML)
        });
    }
    
}
// function call to initialize program
getEmployees();

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.
function writeHTML(renderedHTML) {
    fs.writeFile(outputPath, renderedHTML, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Success!");
    })
}





// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
