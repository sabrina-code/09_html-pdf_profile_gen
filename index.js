const fs = require('fs');
const inquirer = require("inquirer");
const axios = require("axios");
const util = require("util");
const generateHTML = require("./generateHTML.js");
const pdf = require('html-pdf');
const open = require('open');

const writeFileAsync = util.promisify(fs.writeFile);

inquirer.prompt([
        {
          type: "input",
          name: "username",
          message: "Please enter your GitHub user name."
        },
        {
          type: "list",
          name: "favcolor",
          choices: [
              "beige",
              "blue",
              "pink",
              "ceramic"
          ],
          message: "Please select a favorite color."    
        }
    ]).then(({ username, favcolor}) => {
      const queryUrl = `https://api.github.com/users/${username}`;
  
      axios.get(queryUrl)
        .then(response => {
          const data = {
              profilePic: response.data.avatar_url,
              name: response.data.name,
              company: response.data.company,
              location: response.data.location,
              html_url: response.data.html_url,
              blog: response.data.blog,
              bio: response.data.bio,
              repos: response.data.public_repos,
              followers: response.data.followers,
              following: response.data.following,
              star: response.data.public_gists             
          };

      const profile = generateHTML({favcolor, ...data});
      
      return writeFileAsync("index.html", profile);  

      }).then(function () {

        var html = fs.readFileSync('index.html', 'utf8');
        var options = {  height: "1100px",
        width: "1000px"};
        pdf.create(html, options).toFile(`${username}.pdf`, function(err, res) {
          if (err) return console.log(err);
          open(`${username}.pdf`);
        });
      });
    });  
