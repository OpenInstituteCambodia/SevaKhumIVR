function getPath() {
    var path = window.location.pathname;
    path = "file://"+path.substr(path, path.length-10)+'sounds/';
    return path;
}

angular.module('player', [])
.factory('$player', ['$cordovaMedia', function($cordovaMedia) {
    var sound = [];

    return {
        current: null,
        new: function(filename) {
            try {
                this.current = new Media(getPath() + filename);
            } catch(e) {
                console.error("Can't create new media object. No Media object available.");
            }
        },
        play: function() {
            if(this.current !== null) {
                this.current.play({playAudioWhenScreenIsLocked: true});
            }
        },
        pause: function() {
            this.current.pause();
        },
        stop: function() {
            if(this.current !== null) {
                this.current.stop();
                this.current.release();
                this.current = null;
            }
        }
    };
}]);
