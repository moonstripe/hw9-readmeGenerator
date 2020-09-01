const inquirer = require('inquirer');
const axios = require('axios');
const dotenv = require('dotenv');

const gitAPI = 'https://api.github.com/users/';
const user = 'moonstripe11';

//prompt
// inquirer.prompt([
//     {
//         type: 'input',
//         name: 'username',
//         message: 'github user',
//     },
//     {
//         type: 'input',
//         name: 'repository',
//         messages: 'repository',
//
//     },
// ]).then()

    //git api
    axios
        .get(`${gitAPI}hoffstadt/events`)
        .then(response => {
            //repo info
            let email = response.data.filter(item => item.payload.commits ? true : false)

            console.log(email[0]);
            // email address
            console.log(email[0].payload.commits[0].author.email);

            // let evObj = response.data.filter(item => item.payload.commits[0].author.email ? true : false)[0];
            // console.log(evObj);
        })
        .catch(error => console.log(error))



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
