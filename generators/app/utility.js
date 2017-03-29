function getTargets() {
    return [{
        name: '.net 4.6.1',
        value: 'v4.6.1'
    }, {
        name: '.net 4.6',
        value: 'v4.6'
    }, {
        name: '.net 4.5.2',
        value: 'v4.5.2'
    }];
}

module.exports = {
    getTargets: getTargets
}