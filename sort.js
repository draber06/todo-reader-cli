function sort(collection, order) {
    const mapOrderToSort = {
        importance: sortByImportance,
        user: sortByUser,
        date: sortByDate
    };

    return mapOrderToSort[order](collection);
}

function sortByImportance(collection) {
    return [...collection].sort(
        (a, b) => b.importance.length - a.importance.length
    );
}

function sortByUser(collection) {
    return [...collection].sort((a, b) => {
        let firstLetterA = a.user.slice(0, 1).toLowerCase() || 'z';
        let firstLetterB = b.user.slice(0, 1).toLowerCase() || 'z';

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

module.exports = sort;
