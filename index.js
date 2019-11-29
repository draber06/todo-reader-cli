const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const sort = require('./sort');
const parse = require('./parse');
const format = require('./format');

const toDosStore = [];

app();

function app() {
    const files = getFiles();

    console.log('Please, write your command!');

    const toDos = parse(files);
    // console.log(toDos);
    toDosStore.push(...toDos);

    readLine(processCommand);
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map((path) => ({ filepath: path, file: readFile(path) }));
}

function processCommand(command) {
    const [cmd, option] = command.split(' ');
    const commandsWithOption = ['user', 'sort', 'date'];

    if (commandsWithOption.includes(cmd) && !option) {
        console.log('wrong command');
        return;
    }

    switch (cmd) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(format(toDosStore));
            break;
        case 'important':
            const importantToDos = toDosStore.filter(
                ({ importance }) => importance.length
            );
            console.log(format(importantToDos));
            break;
        case 'user':
            const userToDos = toDosStore.filter(
                ({ user }) => user.toLowerCase() === option.toLowerCase()
            );
            console.log(format(userToDos));
            break;
        case 'sort':
            const sortedToDos = sort(toDosStore, option);
            console.log(format(sortedToDos));
            break;
        case 'date':
            const toDosFilteredByDate = toDosStore.filter(
                ({ date }) => date >= option
            );
            console.log(format(toDosFilteredByDate));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
