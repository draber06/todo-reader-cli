const path = require('path');

function extractToDos(files) {
    // \/\/\s*TODO\s?\:?\s*([^\\n]+)
    // \/\/\s*todo\s?\:?\s*([^\;]*);\s?([^\;]*);\s?([^\\n]*)
    // user, date, comment, filename
    // const pattern = new RegExp(/\/\/\s*todo\s?\:?\s*([^\n]*)/, 'gi');
    const pattern = new RegExp(/(?<=\/\/\s*todo\s?\:?\s+)([^\n]+)/, 'gi');

    const toDos = files.reduce((acc, { filepath, data }) => {
        const matches = data.match(pattern);
        if (!matches) {
            return acc;
        }

        const filename = path.basename(filepath);

        const fileToDos = matches.map((todo) => {
            const todoItem = todo.split(';').map((item) => item.trim());

            if (todoItem.length === 1) {
                const [comment] = todoItem;
                return { user: '', date: '', comment, filename };
            }
            const [user, date, comment] = todoItem;

            return { user: user.toLowerCase(), date, comment, filename };
        });
        return [...acc, ...fileToDos];
    }, []);

    return toDos;
}

module.exports = { extractToDos };
