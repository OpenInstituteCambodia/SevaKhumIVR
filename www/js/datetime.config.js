angular.module('datetime', [])
.value('$datetime', {
    date: {
        type      : 'absolute', // fixed | absolute | relative
        start     : '', // format: mm/dd/yyyy, this will be used if type is fixed
        ndays     : 1,
        valuelist : [
            {name: '១​ថ្ងៃ​ម្ដង', value: 1},
            {name: '៣ថ្ងៃ​ម្ដង', value: 3, default: true},
            {name: '៥ថ្ងៃ​ម្ដង', value: 5}
        ]
    },
    time: {
        type      : 'relative', // fixed | absolute | relative
        start     : '', // format: hh:mm:ss (24 hours), this will be used if type is fixed
        valuelist : [
            {name: "ម៉ោង ១០:៣០ ព្រឹក", value: -90},
            {name: 'ម៉ោង ១:០០ រសៀល', value: 60, default: true}
        ]
    }
});
