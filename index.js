const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const { sortToDos } = require('./sort');
const { extractToDos } = require('./extractToDos');

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
    switch (cmd) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(toDosStore);
            break;
        case 'important':
            const importantToDos = toDosStore.filter(({ comment }) =>
                comment.includes('!')
            );
            console.log(importantToDos);
            break;
        case 'user':
            if (!option) {
                console.log('wrong command');
                return;
            }
            const userToDos = toDosStore.filter(
                ({ user }) => user === option.toLowerCase()
            );
            console.log(userToDos);
            break;
        case 'sort':
            if (!option) {
                console.log('wrong command');
                return;
            }
            const sortedToDos = sortToDos(toDosStore, option);
            console.log(sortedToDos);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
