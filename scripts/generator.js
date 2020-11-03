var fs = require('fs-extra');
var param = process.argv[2];
// Check if required parameter is provided
if (!param) {
    console.error('You must specify new component name!');
    process.exit(1);
}
var dir = "./src/components/" + param;
var files = [
    param + ".ts",
    param + ".scss"
];
var templates = [
    "./scripts/templates/index.ts",
    "./scripts/templates/style.scss"
];
var findAll = function (search) { return new RegExp(search, 'g'); };
// Create folder for component code
fs.ensureDir(dir)
    .then(function () {
    console.log("1. Created folder " + dir + "...");
})["catch"](function (err) {
    console.error(err);
});
// Create files for component code
Promise.all(templates.map(function (e) { return fs.readFile(e, 'utf8'); }))
    .then(function (data) {
    return data.map(function (e) { return e.replace(findAll('%%%'), param); });
})
    .then(function (data) {
    return data.map(function (e, i) {
        return fs.outputFile(dir + "/" + files[i], data[i]);
    });
})
    .then(function (data) {
    return console.log("2. Created starter files...");
});
