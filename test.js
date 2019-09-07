const inquirer = require('inquirer');

function initialPrompt() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: "choices",
                message: "Select from the following options:",
                choices: ["display goods", "buy item"]
            }
        ])
        .then(input => {
            if (input.choices === 'display goods') {
                console.log('...');
            } else if (input.choices === 'buy item') {
                buyPrompt();
            }
        });

}

function buyPrompt() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'enter the id of the item you would like to buy',
            name: 'itemId',
        },
        {
            type: 'input',
            message: 'enter the quantity you would like to purchase',
            name: 'howMany'
        }
    ]).then( input => {
        console.log(input);
    });
}

initialPrompt();