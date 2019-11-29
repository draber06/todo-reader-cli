const path = require('path');

function extract(files) {
    const pattern = new RegExp(/(?<=\/\/\s*todo\s?\:?\s+)([^\n]+)/, 'gi');

    const toDos = files.reduce((acc, { filepath, data }) => {
        const matches = data.match(pattern);
        if (!matches) {
            return acc;
        }

        const fileName = path.basename(filepath);

        const fileToDos = matches.map((todo) => {
            const todoItem = todo.split(';').map((item) => item.trim());

            if (todoItem.length === 1) {
                const [comment] = todoItem;
                let importance = '';
                if (comment.includes('!')) {
                    importance = '!';
                }
                return {
                    importance,
                    user: '',
                    date: '',
                    comment,
                    fileName
                };
            }
            const [user, date, comment] = todoItem;

            let importance = '';
            if (comment.includes('!')) {
                importance = '!';
            }

            return { importance, user, date, comment, fileName };
        });
        return [...acc, ...fileToDos];
    }, []);

    return toDos;
}

module.exports = extract;
