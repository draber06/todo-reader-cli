function sortToDos(collection, order) {
    const mapOrderToSort = {
        importance: sortByImportance,
        user: sortByUser,
        date: sortByDate
    };

    return mapOrderToSort[order](collection);
}

function sortByImportance(collection) {
    return [...collection].sort(
        (a, b) =>
            countRepeatedChars(b.comment, '!') -
            countRepeatedChars(a.comment, '!')
    );
}

function sortByUser(collection) {
    return [...collection].sort((a, b) => {
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

function sortByDate(collection) {
    return [...collection].sort((a, b) => {
        const dataA = Date.parse(a.date) || 0;
        const dataB = Date.parse(b.date) || 0;

        return dataB - dataA;
    });
}

function countRepeatedChars(string, char) {
    const pattern = new RegExp(`[^${char}]`, 'g');
    return string.replace(pattern, '').length;
}

module.exports = {
    sortToDos
};
