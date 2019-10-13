let commands = {};

Object.assign(commands,
        require("./Configure.js"),
        require("./Generate.js"),
        require("./General.js"),
        require("./Build.js"),
    );

module.exports = commands;