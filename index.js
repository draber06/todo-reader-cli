const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const path = require('path');

const store = [];
app();

function app() {
    const files = getFiles();

    console.log('Please, write your command!');

    const toDos = extractToDos(files);
    store.push(...toDos);

    readLine(processCommand);
}

function extractToDos(files) {
    // \/\/\s*TODO\s?\:?\s*([^\\n]+)
    // \/\/\s*todo\s?\:?\s*([^\;]*);\s?([^\;]*);\s?([^\\n]*)
    // user, date, comment, filename
    // const pattern = new RegExp(/\/\/\s*todo\s?\:?\s*([^\n]*)/, 'gi');
    const pattern = new RegExp(/(?<=\/\/\s*todo\s?\:?\s+)([^\n]+)/, 'gi');

    const toDos = files.reduce((acc, { filepath, data }) => {
        const filename = path.basename(filepath);
        const fileToDos = data.match(pattern).map((todo) => {
            const todoProps = todo.split(';').map((prop) => prop.trim());
            if (todoProps.length === 1) {
                const [comment] = todoProps;
                return { comment, filename, user: null, date: null };
            }
            const [user, date, comment] = todoProps;
            return { user: user.toLowerCase(), date, comment, filename };
        });
        return [...acc, ...fileToDos];
    }, []);

    return toDos;
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
            console.log(store);
            break;
        case 'important':
            const importantToDos = store.filter(({ comment }) =>
                comment.includes('!')
            );
            console.log(importantToDos);
            break;
        case 'user':
            const userToDos = store.filter(
                ({ user }) => user === option.toLowerCase()
            );
            console.log(userToDos);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
