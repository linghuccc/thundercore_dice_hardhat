const fs = require('fs');

exports.readAddressList = function () {
    return JSON.parse(fs.readFileSync('address.json', 'utf-8'));
};

exports.storeAddressList = function (addressList) {
    fs.writeFileSync('address.json', JSON.stringify(addressList, null, '\t'));
};
