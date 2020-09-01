const inquirer = require('inquirer');
const axios = require('axios');
const dotenv = require('dotenv');

const gitAPI = 'https://api.github.com/users/';
const user = 'moonstripe11';

//prompt
inquirer.prompt([
    {
        type: 'input',
        name: 'username',
        message: 'github user',
    },
    {
        type: 'input',
        name: 'repository',
        messages: 'repository',

    },
]).then(answers => {
    //git api
    axios
        .get(`${gitAPI}${answers.username}/repos`)
        .then(response => {
            //repo info
            let repObj = response.data.filter(item => item.name === answers.repository ? true : false)[0];
            console.log(repObj);
        })
        .catch(error => console.log(error))
})



// const questions = [
//
// ];
//
// function writeToFile(fileName, data) {
// }
//
// function init() {
//
// }
//
// init();
