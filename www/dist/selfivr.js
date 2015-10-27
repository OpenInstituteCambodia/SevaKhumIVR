/*! selfivr2 - v0.1.0 - 2015-05-04
* http://open.org.kh
* Copyright (c) 2015 Open Institute */
angular.module('selfivr', ['ionic', 'directives', 'player', 'ngCordova', 'datetime'])

.config(
['$ionicConfigProvider',
function($ionicConfigProvider) {
	$ionicConfigProvider.views.maxCache(0);
	$ionicConfigProvider.views.transition('none');
}])

.run(
['$ionicPlatform', '$player',
function($ionicPlatform, $player) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});

	var toresume = null;

	document.addEventListener('pause', function() {
		if($player.current !== null) {
			toresume = $player.current;
			$player.stop();
		}
	}, false);

	document.addEventListener('resume', function() {
		if(toresume !== null) {
			$player.current = toresume;
			toresume = null;
			$player.play();
		}
	}, false);
}])

.value('$global', {
	// { red | pink | purple | deep-purple | indigo | blue | teal | green | orange }
	backColor: "red",
	textColor: "white",
	// { small-big | big-small | image-text | text-image | image | large }
	style: "small-big",
	// { rectangle | square | round }
	shape: "rectangle"
})

.controller('StartupCtrl',
['$scope', '$timeout', '$state', '$ionicHistory', '$ionicNavBarDelegate', '$datetime', '$ionicPopup',
function($scope, $timeout, $state, $ionicHistory, $ionicNavBarDelegate, $datetime, $ionicPopup) {
	var timeout = 5000, pref, ddate, dtime, ndays=3, json, i, list;

	/**
	 * =====================
	 * Startup configuration
	 * =====================
	 * 1. Check/get preference.
	 * 2. Set next view to be the history root in ionic view history.
	 * 3. Let's go to first page. \m/
	 */

	var confirm = function() {
		var popup = $ionicPopup.show({
			template: 'នៅ​ពេល​អ្នក​បើក​កម្មវិធី​នេះ​ដំបូង អ្នក​នឹង​ឃើញ​សារ​មួយ​នេះ ដើម្បី​សួរនាំ​អំពី​ការ​រំឭក។ តើ​អ្នក​ចង់​បើក​កំណត់​ការ​រំឭក​ដែរ​ឬ​ទេ? អ្នក​អាច​បិទ​ឬ​បើក​វា​ពេល​ក្រោយ​បាន​នៅ​ក្នុង​ការ​កំណត់។',
		    title: 'កំណត់​ការ​រំឭក​ជា​លើក​ដំបូង',
		    subTitle: 'នេះ​បង្ហាញ​តែ​លើក​ដំបូង​ប៉ុណ្ណោះ',
		    scope: $scope,
		    buttons: [
		    {
				text: 'មិន​បើក​ទេ',
			  	type: 'button-assertive'
			},
		    {
		        text: '<b>សូម​បើក​វា</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		        	return true;
		        }
		    }
		    ]
		});

		return popup;
	};

	// This function checks if it is the first launch.
	// It is used as a callbackf function in 'deviceready' event below.
	function fetchError(error) {
		console.log("Preference is not set.");

		if($datetime.date.type === 'absolute') {
			var d = new Date();
			ddate = (d.getMonth() + 1).toString() + '/' + d.getDate().toString() + '/' + d.getFullYear().toString();
		} else if($datetime.date.type === 'relative') {
			list = $datetime.date.valuelist;
			for(i = 0; i < list.length; i++) {
				if(list[i].default === true) {
					ddate = list[i].value;
					break;
				}
			}
		} else {
			ddate = $datetime.date.start;
			ndays = $datetime.date.ndays;
		}

		switch($datetime.time.type) {
			case 'absolute':
				dtime = "16:00:00";
				break;
			case 'relative':
				list = $datetime.time.valuelist;
				for(i = 0; i < list.length; i++) {
					if(list[i].default === true) {
						dtime = list[i].value;
						break;
					}
				}
				break;
			case 'fixed':
				dtime = $datetime.time.start;
		}

		if($datetime.date.type === 'absolute' || $datetime.date.type === 'relative') {
			confirm().then(function(res) {
				if(res) {
					json = '{"time": "' + dtime + '", "date": "' + ddate + '", "ndays":'+ ndays +', "link":"/page/", "datetype": "' + $datetime.date.type + '", "timetype": "' + $datetime.time.type + '"}';
					pref.store(function success(){}, function error(){}, "selfivr-pref", json);
				} else {
					pref.store(function success(){}, function error(){}, "selfivr-pref", "no-reminder");
				}

				$timeout(function() {
					$state.go('page');
				}, 2000);
			});
		} else {
			json = '{"time": "' + dtime + '", "date": "' + ddate + '", "ndays":'+ ndays +', "link":"/page/", "datetype": "' + $datetime.date.type + '", "timetype": "' + $datetime.time.type + '"}';
			pref.store(function success(){}, function error(){}, "selfivr-pref", json);

			$timeout(function() {
				$state.go('page');
			}, 2000);
		}
	}

	function fetchSuccess(value) {
		console.log("Preference is already set: " + value);

		$timeout(function() {
			$state.go('page');
		}, 2000);
	}

	// Make sure Cordova engine has loaded all things.
	document.addEventListener('deviceready', function() {
		try {
			pref = plugins.appPreferences;
			pref.fetch(fetchSuccess, fetchError, 'selfivr-pref');
		} catch(e) {
			console.error("Application preferences does not work in this environment. You should open this page in native mobile application.");
		}

		// Set next page view as the history root.
		$ionicHistory.nextViewOptions({
			historyRoot: true
		});
	});

}])

.controller('MainCtrl',
['$scope', '$player', '$ionicHistory',
function($scope, $player, $ionicHistory) {
	$scope.exit = function() {
		// navigator.app.exitApp();
		navigator.notification.confirm(
			'តើ​អ្នក​ពិត​ជា​ចង់​ចាកចេញ​មែន​ទេ?', // message
			function(button) {
				if (buttonIndex==2){
					navigator.app.exitApp();
				}
			}, // callback function
			'ចាកចេញ', // title
			['បោះបង់','មែន'] // buttonLabels
			);
	};
}])

.controller('ReminderCtrl',
['$scope', '$player', '$cordovaDatePicker', '$datetime', '$ionicHistory', '$cordovaToast',
function($scope, $player, $datepicker, $datetime, $ionicHistory, $cordovaToast) {
	$scope.out = $datetime;
	var pref, datetimeFromPref, ddate = "" ,dtime = "", url, json, title;
	url = ($ionicHistory.backView()) ? $ionicHistory.backView().url : "";
	console.log($ionicHistory.backView());

	$scope.dt = {
		day: "01",
		month: "01",
		year: "2015",
		hour: "16",
		minute: "00"
	};

	/*
		$scope.dd (object) is used to avoid scope inheritance problem.
		This controller is a parent for <ion-view> in reminder template,
		so <ion-view> will be a child of ReminderCtrl.

		By defining this as object is to let <ion-view> knows that ndays
		is parent's, and it should be working with parent, not its own
		scope.
	 */
	$scope.dd = {};
	$scope.dd.toggle = false;
	$scope.dd.ndays = 3;

	if($datetime.date.type === 'fixed') $scope.dd.toggle = true;
	if($datetime.date.type === 'relative') {
		$scope.dt.day = $datetime.date.valuelist[1];
		$scope.dd.ndays = 0;
	}
	if($datetime.time.type === 'relative') $scope.dt.hour = $datetime.time.valuelist[0];

	function success() {}
	function failed() {}

	/**
	 * A helper function for converting number to string,
	 * and add a zero to front if it is less than ten.
	 * @param {number} source
	 */
	function addZero(source) {
		var result = source;
		if(typeof source === 'number') {
			result = (source<10) ? "0"+source.toString() : source.toString();
		}
		return result;
	}

	/**
	 * A helper function to get an appropriate element from a list.
	 * @param {object} source
	 */
	function getObject(source, search) {
		var i = 0;
		var result;
		for(i; i<source.length; i++) {
			if(source[i].value == search) {
				result = source[i];
				break;
			}
		}

		return result;
	}

	/**
	 * Stop music from playing.
	 */
	if($player.current !== null) {
		$player.stop();
	}

	/**
	 * Exception: Try to assign appPreferences to pref.
	 * Then fetch reminder preferences if exist.
	 */
	try {
		pref = plugins.appPreferences;
		pref.fetch(function success(value) {
			console.log('Preference fetched: ' + value);

			if(value !== 'no-reminder') {
				var result = JSON.parse(value);

				switch(result.datetype) {
					case 'absolute': case 'fixed':
						$scope.dd.toggle = true;
						var date = new Date(result.date);
						$scope.dt.day = addZero(date.getDate());
						$scope.dt.month = addZero(date.getMonth()+1);
						$scope.dt.year = date.getFullYear();
						$scope.dd.ndays = result.ndays;
						break;
					default:
						$scope.dt.day = getObject($datetime.date.valuelist, result.date);
				}

				switch(result.timetype) {
					case 'absolute': case 'fixed':
						var time = new Date(result.time);
						$scope.dt.hour = addZero(time.getHours());
						$scope.dt.minute = addZero(time.getMinutes());
						break;
					default:
						$scope.dt.hour = getObject($datetime.time.valuelist, result.time);
				}
			}
		}, function error() {
			console.log("Datetime Preference is empty.");
		}, 'selfivr-pref');
	} catch(e) {
		console.error("Application preferences does not work in this environment. You should open this page in native mobile application.");
	}

	/**
	 * setDate() is used in view for define starting date.
	 */
	$scope.setDate = function() {
		$datepicker.show({
			date: new Date(),
			mode: 'date'
		}).then(function(value) {
			$scope.dt.day = addZero(value.getDate());
			$scope.dt.month = addZero(value.getMonth() + 1);
			$scope.dt.year = value.getFullYear().toString();
		});
	};

	/**
	 * setTime() is used in view for define reminder time.
	 */
	$scope.setTime = function() {
		$datepicker.show({
			date: new Date(),
			mode: 'time'
		}).then(function(value) {
			$scope.dt.hour = addZero(value.getHours());
			$scope.dt.minute = addZero(value.getMinutes());
		});
	};

	/**
	 * setReminder() is used in view to set date and time, and number of day
	 * to preference.
	 */
	$scope.setReminder = function() {
			if($scope.dd.toggle === true) {
				var title;
				if($ionicHistory.backView()) {
					title = ($ionicHistory.backView().title) ? $ionicHistory.backView().title : $ionicHistory.backView().viewId;
				}
				ddate = ($datetime.date.type !== 'relative') ? $scope.dt.month + "/" + $scope.dt.day + "/" + $scope.dt.year : $scope.dt.day.value;
				dtime = ($datetime.time.type !== 'relative') ? $scope.dt.hour + ":" + $scope.dt.minute + ":00" : $scope.dt.hour.value;

				json = '{"time": "' + dtime + '", "date": "' + ddate + '", "ndays":'+$scope.dd.ndays+', "link":"' + url + '", "datetype": "' + $datetime.date.type + '", "timetype": "' + $datetime.time.type + '"}';

				console.log(json);

				// $cordovaToast.showLongBottom("អ្នក​បាន​កំណត់​ការ​រំឭក​ទៅ​ឲ្យ​ទំព័រ " + title + ", កាល​បរិច្ឆេទ៖ " + ddate + ", ម៉ោង៖ " + dtime);
			} else {
				json = "no-reminder";
				$cordovaToast.showLongBottom("អ្នក​បាន​បិទ​ការ​រំឭក​ដោយ​ជោគជ័យ។");
			}

		pref.store(success, failed, "selfivr-pref", json);
	};
}]);

angular.module('datetime', [])
.value('$datetime', {
    date: {
        type      : 'absolute', // fixed | absolute | relative
        start     : '', // format: mm/dd/yyyy, this will be used if type is fixed
        ndays     : 0,
        valuelist : [
            {name: 'ថ្ងៃ​ស្អែក', value: -1},
            {name: 'ថ្ងៃ​នេះ', value: 0, default: true},
            {name: 'ម្សិល​មិញ', value: 1}
        ]
    },
    time: {
        type      : 'relative', // fixed | absolute | relative
        start     : '', // format: hh:mm:ss (24 hours), this will be used if type is fixed
        valuelist : [
            {name: '30 នាទី​បន្ទាប់', value: 30},
            {name: '60 នាទី​បន្ទាប់', value: 60, default: true}
        ]
    }
});

angular.module('directives', [])
.directive('siMedia', function() {
    return {
        restrict: 'E',
        templateUrl: 'player.html',
        compile: function(tElement, tAttrs) {
            tElement.addClass("player-wrapper");

            return function(scope, iElement, iAttrs) {
                scope.image = iAttrs.image;
                scope.hasImage = (scope.image) ? true : false;
            };
        },
        controller: ["$scope", "$element", "$attrs", "$player", function($scope, $element, $attrs, $player) {
            $scope.isPlaying = false;

            // auto play
            if($player.current === null) {
                if($attrs.sound) {
                    $player.new($attrs.sound);
                    $player.play();
                    $scope.isPlaying = true;
                }
            } else {
                $player.stop();

                if($attrs.sound) {
                    $player.new($attrs.sound);
                    $player.play();
                    $scope.isPlaying = true;
                }
            }

            $scope.play = function() {
                if(($attrs.sound !== null && $player.current === null)) {
                    $player.new($attrs.sound);
                    $player.play();
                    $scope.isPlaying = true;
                } else if(!$scope.isPlaying) {
                    $player.play();
                    $scope.isPlaying = true;
                }
            };

            $scope.pause = function() {
                $player.pause();
                $scope.isPlaying = false;
            };

            $scope.stop = function() {
                $player.stop();
                $scope.isPlaying = false;
            };
        }]
    };
})
.directive('siPage', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            var dom = element[0];
            var numberOfChoice = dom.children.length;
            dom.className = "page one-col center";

            if(numberOfChoice === 5) {
                dom.className = "page two-cols center";
                dom.children[2].style.flexBasis = "100%";
            } else if(numberOfChoice > 6) {
                dom.className = "page two-cols";
            } else if(numberOfChoice > 3) {
                dom.className = "page two-cols center";
            } else if(numberOfChoice === 1) {
                dom.className += " one";
            } else if(numberOfChoice === 2) {
                dom.className += " two";
            } else if(numberOfChoice === 3) {
                dom.className += " three";
            }

        },
        controller: ["$scope", "$element", "$attrs", "$ionicHistory", "$player", function($scope, $element, $attrs, $ionicHistory, $player) {

            this.backColor = $attrs.backColor;
            this.textColor = $attrs.textColor;
            this.shape     = $attrs.shape;

            if($player.current === null) {
                if($attrs.sound) {
                    $player.new($attrs.sound);
                    $player.play();
                }
            } else {
                $player.stop();

                if($attrs.sound) {
                    $player.new($attrs.sound);
                    $player.play();
                }
            }

        }]
    };
})
.directive('siChoice', ["$global", "$rootScope", "$compile", function($global, $rootScope, $compile) {
    return {
        require  : '^siPage',
        restrict : 'E',
        scope: {},
        template: "<div ui-sref='page({pageId: url})' class='choice-content'></div>",
        link: function(scope, element, attrs, sipage) {
            scope.bigtext   = attrs.bigtext;
            scope.smalltext = attrs.smalltext;
            scope.url       = attrs.url;
            scope.image     = attrs.image;
            var shape       = attrs.shape || sipage.shape || $global.shape;
            var color       = attrs.textColor || sipage.textColor || $global.textColor;
            var backColor   = attrs.backColor || sipage.backColor || $global.backColor;
            var style       = attrs.style || sipage.style || $global.style;
            var children    = element.children();

            element.addClass('choice-item');
            children.addClass(style);
            children.addClass(shape);
            children.addClass(backColor);
            children.html(getTemplate(style, shape));
            $compile(children.contents())(scope);
        }
    };
}]);

function getTemplate(style, shape) {
    var templates   = {}; // template list
    var template    = ""; // to be returned

    var bigtext     = "<div class='bigtext'>{{bigtext}}</div>";
    var smalltext   = "<div class='smalltext'>{{smalltext}}</div>";
    var image       = "<div class='choice-image'><img ng-src='img/{{image}}' /></div>";

    templates.onlyImage      = "<div class='only-image'><img ng-src='img/{{image}}' /></div>";
    templates.onlyText       = "<div class='only-text'>{{bigtext}}</div>";
    templates.smalltextImage = smalltext + image;
    templates.imageSmalltext = image + smalltext;
    templates.bigSmall       = bigtext + smalltext;
    templates.smallBig       = smalltext + bigtext;

    if(shape === "round" && style !== "large" && style !== "image") {
        style = "large";
    }

    switch(style) {
        case "small-big":
            template = templates.smallBig;
            break;
        case "big-small":
            template = templates.bigSmall;
            break;
        case "text-image":
            template = templates.smalltextImage;
            break;
        case "image-text":
            template = templates.imageSmalltext;
            break;
        case "image":
            template = templates.onlyImage;
            break;
        case "large":
            template = templates.onlyText;
            break;
    }

    return template;
}

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
                this.current.play();
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

angular.module('selfivr')
.config(
['$stateProvider', '$urlRouterProvider', '$locationProvider',
function($stateProvider, $urlRouterProvider, $locationProvider) {
	// $urlRouterProvider.otherwise('/page/');
	$urlRouterProvider.when('', '/');
	$urlRouterProvider.when('/page', '/page/');

	$stateProvider
	.state('start', {
		url: '/',
		templateUrl: 'startup.html',
		controller: 'StartupCtrl'
	})
	.state('page', {
		url: '/page/{pageId}',
		templateProvider: ["$templateCache", "$stateParams", function($templateCache, $stateParams) {
			var param = $stateParams.pageId;
			var html = "";
			if(param === "") {
				html = $templateCache.get('main.html');
			} else {
				html = $templateCache.get($stateParams.pageId);
			}
			return html;
		}]
	})
	.state('reminder', {
		url: '/reminder',
		templateUrl: 'reminder.html',
		controller: 'ReminderCtrl'
	});
}]);
