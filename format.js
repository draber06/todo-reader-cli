function format(coll) {
    // !, user, date, commment, fileName
    // 1, 10, 10, 50, 15
    const config = {
        pad: 2,
        sep: '|',
        fields: 5
    };
    const { pad, sep, fields } = config;

    const columnsMaxWidth = {
        importance: 1,
        user: 10,
        date: 10,
        comment: 50,
        filename: 15
    };

    const colsWidth = Object.keys(columnsMaxWidth).reduce((acc, colName) => {
        const curW = Math.min(
            columnsMaxWidth[colName],
            getColumnWidth(coll, colName)
        );
        return { ...acc, [colName]: curW };
    }, {});

    const header = Object.keys(columnsMaxWidth)
        .reduce((acc, key) => {
            if (key === 'importance') {
                return [...acc, '  !  '];
            }
            const nField = normaliseFieldWidth(key, colsWidth[key]);
            return [...acc, `  ${nField}  `];
        }, [])
        .join(sep);

    const dividerLength = Object.values(columnsMaxWidth).reduce(
        (a, b) => a + b
    );
    const divider = '-'.repeat(dividerLength + fields * pad * 2);

    const body = coll
        .map((todo) => {
            const entries = Object.entries(todo);
            return entries
                .reduce((acc, [key, value]) => {
                    const nField = normaliseFieldWidth(value, colsWidth[key]);
                    return [...acc, `  ${nField}  `];
                }, [])
                .join(sep);
        })
        .join(`\n`);

    return `${header}\n${divider}\n${body}`;
}

function normaliseFieldWidth(field, maxW) {
    if (field.length > maxW) {
        return field.slice(0, maxW - 3).padEnd(maxW, '.');
    }

    return field.padEnd(maxW);
}

function getColumnWidth(coll, colName) {
    const colWs = coll.map((todo) => todo[colName].length);
    return Math.max(...colWs);
}

module.exports = {
    format
};
