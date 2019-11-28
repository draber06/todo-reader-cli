const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const path = require('path');

const toDosStore = [];
app();

function app() {
    const files = getFiles();

    console.log('Please, write your command!');

    const toDos = extractToDos(files);
    toDosStore.push(...toDos);

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
                return { user: '', date: '', comment, filename };
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
            console.log(toDosStore);
            break;
        case 'important':
            const importantToDos = toDosStore.filter(({ comment }) =>
                comment.includes('!')
            );
            console.log(importantToDos);
            break;
        case 'user':
            const userToDos = toDosStore.filter(
                ({ user }) => user === option.toLowerCase()
            );
            console.log(userToDos);
            break;
        case 'sort':
            const sortedToDos = sortToDos(option);
            console.log(sortedToDos);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function sortToDos(order) {
    const mapOrderToSort = {
        importance: sortByImportance,
        user: sortByUser,
        date: sortByDate
    };

    return mapOrderToSort[order](toDosStore);
}

function sortByImportance(coll) {
    return [...coll].sort(
        (a, b) =>
            countRepeatedChars(b.comment, '!') -
            countRepeatedChars(a.comment, '!')
    );
}

function sortByUser(coll) {
    return [...coll].sort((a, b) => {
        let firstLetterA = a.user[0] || 'z';
        let firstLetterB = b.user[0] || 'z';

        if (firstLetterA > firstLetterB) {
            return 1;
        }
        if (firstLetterA < firstLetterB) {
            return -1;
        }

        return 0;
    });
}

function sortByDate(coll) {
    return [...coll].sort((a, b) => {
        const dataA = Date.parse(a.date) || Infinity;
        const dataB = Date.parse(b.date) || Infinity;

        return dataA - dataB;
    });
}

function countRepeatedChars(string, char) {
    const pattern = new RegExp(`[^${char}]`, 'g');
    return string.replace(pattern, '').length;
}

// TODO you can do it!
