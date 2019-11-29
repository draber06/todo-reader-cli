function format(coll) {
    // !, user, date, commment, fileName
    // 1, 10, 10, 50, 15
    const headerNames = ['importance', 'user', 'date', 'comment', 'fileName'];
    const config = {
        pad: 4,
        sep: '|',
        fields: 5,
        colsWidthConstraints: {
            importance: 1,
            user: 10,
            date: 10,
            comment: 50,
            fileName: 15
        }
    };
    const { pad, sep, fields, colsWidthConstraints } = config;

    const normalisedColWidths = Object.keys(colsWidthConstraints).reduce(
        (acc, colName) => {
            const normalisedWidth = Math.min(
                colsWidthConstraints[colName],
                getColumnWidth(coll, colName)
            );
            return { ...acc, [colName]: normalisedWidth };
        },
        {}
    );

    const header = headerNames
        .map((key) => formatLine(key, normalisedColWidths[key]))
        .join(sep);

    const body = coll
        .map((todo) => {
            return Object.entries(todo)
                .map(([key, value]) =>
                    formatLine(value, normalisedColWidths[key])
                )
                .join(sep);
        })
        .join(`\n`);

    const blockSeparatorLength = Object.values(normalisedColWidths).reduce(
        (a, b, i) => {
            const baseW = a + b + sep.length + pad;
            return i === 1 ? baseW + pad : baseW;
        }
    );
    const blockSeparator = '-'.repeat(blockSeparatorLength);

    return [header, blockSeparator, body, blockSeparator].join('\n');
}

function formatLine(value, maxWidth) {
    if (value === 'importance') {
        return '  !  ';
    }
    const field = formatField(value, maxWidth);
    return `  ${field}  `;
}

function formatField(field, maxW) {
    if (field.length > maxW) {
        return field.slice(0, maxW - 3).padEnd(maxW, '.');
    }

    return field.padEnd(maxW);
}

function getColumnWidth(coll, colName) {
    const colWs = coll.map((todo) => todo[colName].length);
    return Math.max(...colWs, colName.length);
}

module.exports = format;
