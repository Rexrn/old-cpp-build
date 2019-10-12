let commands = {};

Object.assign(commands,
        require("./General.js"),
        require("./Build.js")
    );

module.exports = commands;