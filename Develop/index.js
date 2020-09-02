const inquirer = require('inquirer');
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');

const gitAPI = 'https://api.github.com/';

const questions = [
    {
        type: 'input',
        name: 'username',
        message: 'What is your GitHub username? (required)'
    },

    {
        type: 'input',
        name: 'repository',
        message: 'What is the name of the Github repository? (required)'

    },

    {
        type: 'input',
        name: 'projectName',
        message: 'What is the project title? (required)'

    },

    {
        type: 'input',
        name: 'description',
        message: 'Describe the project: (required)'

    },

    {
        type: 'input',
        name: 'installation',
        message: 'How do you install this project? (required)'

    },

    {
        type: 'input',
        name: 'usage',
        message: 'How do you use this project? (required)'

    },

    {
        type: 'input',
        name: 'license',
        message: 'License: (required)'

    },

    {
        type: 'input',
        name: 'contributing',
        message: 'How can people contribute? (optional)'

    },

    {
        type: 'input',
        name: 'tests',
        message: 'What are some tests for your project? (optional)'

    }


];

let email = '';
let login = '';
let avImg = '';
let promptElements = [];


function init() {
//prompt
    inquirer.prompt(questions).then( async answers => {

        //pull from git
        email = await getGitEmail(answers);
        userInfo = await getGitAvatar(answers);

        // project title and description
        promptElements.push(mdEle('title', answers.projectName));
        promptElements.push(mdEle('paragraph', answers.description));

        // table of contents
        promptElements.push(mdEle('subtitle', 'Table of Contents'));
        promptElements.push(mdEle('content', 'Installation'));
        promptElements.push(mdEle('content', 'Usage'));
        promptElements.push(mdEle('content', 'License'));
        if (answers.contributing) {
            promptElements.push(mdEle('content', 'Contributing'));
        };
        if (answers.tests) {
            promptElements.push(mdEle('content', 'Tests'));
        };

        // installation
        promptElements.push(mdEle('subtitle', 'Installation'));
        promptElements.push(mdEle('paragraph', answers.installation));

        // usage
        promptElements.push(mdEle('subtitle', 'Usage'));
        promptElements.push(mdEle('paragraph', answers.usage));

        // license
        promptElements.push(mdEle('subtitle', 'License'));
        promptElements.push(mdEle('paragraph', answers.license));

        // contributors
        if (answers.contributing) {
            promptElements.push(mdEle('subtitle', 'Contributing'));
            promptElements.push(mdEle('paragraph', answers.contributing));
        };

        // tests
        if (answers.tests) {
            promptElements.push(mdEle('subtitle', 'Tests'));
            promptElements.push(mdEle('paragraph', answers.tests));
        };

        // questions
        promptElements.push(mdEle('subtitle', 'Questions'));
        promptElements.push(mdEle('paragraph', `If you have any questions, please refer them to [${email}](mailto:${email}).\n`));
        promptElements.push(mdEle('image', userInfo[1]));

        // badges
        promptElements.push(mdEle('badge', `https://img.shields.io/github/contributors/${answers.username}/${answers.repository}`));
        promptElements.push(mdEle('badge', `https://img.shields.io/github/followers/${answers.username}?label=Follow&style=social`));
        promptElements.push(mdEle('badge', `https://img.shields.io/static/v1?label=${userInfo[0]}&message=approved&color=success`));

        // final write
        fs.writeFile('README.md', promptElements.join(''), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });


    })

}


const mdEle = (type, content) => {
    switch (type) {
        case 'title':
            return `# ${content}\n`;
        case 'subtitle':
            return `## ${content}\n`;
        case 'paragraph':
            return `${content}\n`;
        case 'image':
            return `<img src="${content}" alt="drawing" width="150"/><br><br>`;
        case 'content':
            let lC = content.toLowerCase()
            return `* [${content}](#${lC})\n`;
        case 'badge':
            return `![](${content})\n`;
    }
}

// git API functions
const getGitEmail = async (answers) => {

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
