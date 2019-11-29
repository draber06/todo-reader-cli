const path = require('path');

function parse(files) {
    const todoList = files
        .map(({ filepath, file }) => {
            const fileName = path.basename(filepath);

            return file
                .split('\n')
                .filter((line) => /\/\/\s*todo/i.test(line))
                .map((line) => line.replace(/(.*)\/\/\s*todo\s?:?\s+/i, ''))
                .map(parseTodo(fileName));
        })
        .flat();

    return todoList;
}

function parseTodo(fileName) {
    return (todo) => {
        const patterns = {
            user: /(^[^;]*)(?=;)/g,
            date: /(\d{4}-\d{2}-\d{2})/g,
            comment: /([^;]+$)/g,
            importance: /!+/
        };

        const matches = Object.keys(patterns).map((key) => {
            const match = todo.match(patterns[key]);
            return match ? match[0].trim() : '';
        });
        const [user, date, comment, importance] = matches;

        return { importance, user, date, comment, fileName };
    };
}

module.exports = parse;
