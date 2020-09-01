const inquirer = require('inquirer');
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');

const gitAPI = 'https://api.github.com/';
const user = 'moonstripe11';

const questions = [
    {
        type: 'input',
        name: 'username',
        message: 'github user:'
    },

    {
        type: 'input',
        name: 'repository',
        message: 'github repo name:'

    },

    {
        type: 'input',
        name: 'projectName',
        message: 'project title:'

    },

    {
        type: 'input',
        name: 'description',
        message: 'project description:'

    },

    {
        type: 'input',
        name: 'installation',
        message: 'installation instructions:'

    },

    {
        type: 'input',
        name: 'usage',
        message: 'usage guide:'

    },

    {
        type: 'input',
        name: 'license',
        message: 'license:'

    },

    {
        type: 'input',
        name: 'contributing',
        message: 'how to contribute:'

    },

    {
        type: 'input',
        name: 'tests',
        message: 'test (optional):'

    },

    {
        type: 'input',
        name: 'questions',
        message: 'frequently asked questions (optional):'

    },


];

let email = '';
let login = '';
let avImg = '';
let promptElements = [];


function init() {
//prompt
    inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: 'moonstripe11'
        },
        {
            type: 'input',
            name: 'repository',
            message: 'proj1'
        }
    ]).then( async answers => {

        email = await getGitEmail(answers);
        userInfo = await getGitAvatar(answers);

        console.log(email);

        promptElements.push(mdEle('title', answers.repository));
        promptElements.push(mdEle('paragraph', answers.username));

        promptElements.push(mdEle('subtitle', 'Table of Contents'));
        promptElements.push(mdEle('content', 'Installation'));
        promptElements.push(mdEle('content', 'Usage'));
        promptElements.push(mdEle('content', 'License'));

        promptElements.push(mdEle('subtitle', 'Installation'));
        promptElements.push(mdEle('paragraph', 'Clone this repository, and run "index.html."'));


        promptElements.push(mdEle('subtitle', 'Usage'));
        promptElements.push(mdEle('paragraph', 'Mouseover points on the graph to see the Coin price and relevant news articles.'));


        promptElements.push(mdEle('subtitle', 'License'));
        promptElements.push(mdEle('paragraph', 'MIT License'));

        promptElements.push(mdEle('badge', `https://img.shields.io/github/contributors/${answers.username}/${answers.repository}`))

        promptElements.push(mdEle('image', userInfo[1]));

        fs.writeFile('README.md', promptElements.join(''), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });


    })

}


const mdEle = (type, content) => {
    switch (type) {
        case 'title':
            return `# ${content}\n`
        case 'subtitle':
            return `## ${content}\n`
        case 'paragraph':
            return `${content}\n`
        case 'image':
            return `<img src="${content}" alt="drawing" width="150"/>\n`
        case 'content':
            let lC = content.toLowerCase()
            return `* [${content}](#${lC})\n`
        case 'badge':
            return `![](${content})\n`
    }
}

// git API functions
const getGitEmail = async (answers) => {
    let email;

    const response = await axios.get(`https://api.github.com/users/${answers.username}/events`)
        .catch(error => console.log(error));



    let src = response.data.filter(item => item.payload.commits ? true : false)

    // console.log(email[0]);
    // email address
    email = src[0].payload.commits[0].author.email;

    return email;

}

const getGitAvatar = async (answers) => {
    const response = await axios.get(`${gitAPI}repos/${answers.username}/${answers.repository}`)
        .catch(error => console.log(error));


        login = response.data.owner.login;
        avImg = response.data.owner.avatar_url;
        return [login, avImg];


}

//
// function writeToFile(fileName, data) {
// }
//

init();
