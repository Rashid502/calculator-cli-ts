#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { evaluate } from "mathjs";
import fs from "fs";
import figlet from "figlet";
let history = [];
try {
    const content = fs
        .readFileSync("./last_10_calculations.txt")
        .toLocaleString();
    history = content.split("\n").filter((c) => c && c != "");
}
catch (err) { }
console.log(chalk.greenBright(figlet.textSync("Calculator", { horizontalLayout: "full" })));
const askQuestion = async () => {
    inquirer
        .prompt([
        {
            name: "choice",
            type: "list",
            choices: [
                "Calculator",
                "History (Last 10 calculations with result)",
                "Exit",
            ],
        },
    ])
        .then(async (answer) => {
        try {
            if (answer.choice == "History (Last 10 calculations with result)") {
                try {
                    const content = fs
                        .readFileSync("./last_10_calculations.txt")
                        .toLocaleString();
                    let allCalculations = content
                        .split("\n")
                        .filter((c) => c && c != "")
                        .join("\n");
                    console.log(chalk.greenBright(allCalculations));
                }
                catch (err) { }
            }
            else if (answer.choice === "Exit") {
                console.log(chalk.bold.greenBright("Application closed successfully."));
                process.exit(0);
            }
            else {
                await inquirer
                    .prompt([
                    {
                        name: "expression",
                        type: "string",
                        message: "Enter Your mathmatical expression (example = 8 + 9 * 5):",
                    },
                ])
                    .then((answer) => {
                    try {
                        let result = evaluate(answer.expression);
                        console.log(chalk.bold.blueBright("Answer: " + JSON.stringify(result)));
                        if (history.length > 10) {
                            history.length = 0;
                            history.push(answer.expression + " = " + result);
                            fs.writeFile("last_10_calculations.txt", `${answer.expression} =  ${result}\n`, (err) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                            });
                        }
                        else {
                            history.push(answer.expression + " = " + result);
                            fs.appendFile("last_10_calculations.txt", `${answer.expression} =  ${result} \n`, (err) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                            });
                        }
                    }
                    catch (err) {
                        history.push(answer.expression + " = ERROR");
                        fs.appendFile("last_10_calculations.txt", `${answer.expression} =  ERROR \n`, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                        console.log(chalk.bold.red("Please correct your expression."));
                    }
                });
            }
            askQuestion();
        }
        catch (e) {
            console.log(chalk.bold.red("Please select correct choice."));
            askQuestion();
        }
    });
};
askQuestion();
