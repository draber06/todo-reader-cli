const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const { sortToDos } = require('./sort');
const { extractToDos } = require('./extractToDos');
const { format } = require('./format');

const toDosStore = [];

app();

function app() {
    const files = getFiles();

    console.log('Please, write your command!');
    const toDos = extractToDos(files);
    toDosStore.push(...toDos);

    readLine(processCommand);
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map((path) => ({ filepath: path, data: readFile(path) }));
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
            const importantToDos = toDosStore.filter(({ comment }) =>
                comment.includes('!')
            );
            console.log(format(importantToDos));
            break;
        case 'user':
            const userToDos = toDosStore.filter(
                ({ user }) => user === option.toLowerCase()
            );
            console.log(format(userToDos));
            break;
        case 'sort':
            const sortedToDos = sortToDos(toDosStore, option);
            console.log(format(sortedToDos));
            break;
        case 'date':
            const inputDate = Date.parse(option) || 0;
            const toDosFilteredByDate = toDosStore.filter(
                ({ date }) => (Date.parse(date) || 0) >= inputDate
            );
            console.log(format(toDosFilteredByDate));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
