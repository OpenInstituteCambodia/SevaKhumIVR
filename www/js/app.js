angular.module('selfivr', ['ionic', 'directives', 'player', 'ngCordova', 'datetime'])

.config(
['$ionicConfigProvider',
function($ionicConfigProvider) {
	$ionicConfigProvider.views.maxCache(0);
	$ionicConfigProvider.views.transition('none');
}])

.run(
['$ionicPlatform', '$player', '$cordovaToast', '$ionicHistory', '$state',
function($ionicPlatform, $player, $cordovaToast, $ionicHistory, $state) {
	$ionicPlatform.ready(function() {
		/**
		 * Hide the accessory bar by default (remove this to show the accessory
		 * bar above the keyboard for form inputs
		 */
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}

//		if(AlarmInterface.getURL() !== undefined && AlarmInterface.getURL() !== null) {
//			$ionicHistory.nextViewOptions({
//				historyRoot: true
//			});

//			$state.go('alarm');
//		}

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
			$player.stop();
		}

	}, false);
}])

.value('$global', {
	// { red | pink | purple | deep-purple | indigo | blue | teal | green | orange }
	backColor: "red",
	textColor: "white",
	// { small-big | big-small | image-text | text-image | image | large }
	style: "large",
	// { rectangle | square | round }
	shape: "rectangle",
	background: ""
})

/**
* =====================
* Startup configuration
* =====================
* 1. Check/get preference.
* 2. Set next view to be the history root in ionic view history.
* 3. Let's go to first page. \m/
*/
.controller('StartupCtrl',
['$scope', '$timeout', '$state', '$ionicHistory', '$ionicNavBarDelegate', '$datetime', '$ionicPopup',
function($scope, $timeout, $state, $ionicHistory, $ionicNavBarDelegate, $datetime, $ionicPopup) {

    // Set next page view as the history root.
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });

    var timer = $timeout(function() {
        $state.go('page');
    }, 6000);

		document.addEventListener('pause', function() {

			$timeout.cancel(timer);

		}, false);

		document.addEventListener('resume', function() {

			$state.go('page');

		}, false);

//	var timeout = 5000, pref, ddate, dtime, ndays=3, json, i, list;

//	var confirm = function() {
//		var popup = $ionicPopup.show({
//			template: 'នៅ​ពេល​អ្នក​បើក​កម្មវិធី​នេះ​ដំបូង អ្នក​នឹង​ឃើញ​សារ​មួយ​នេះ ដើម្បី​សួរនាំ​អំពី​ការ​រំឭក។ តើ​អ្នក​ចង់​បើក​កំណត់​ការ​រំឭក​ដែរ​ឬ​ទេ? អ្នក​អាច​បិទ​ឬ​បើក​វា​ពេល​ក្រោយ​បាន​នៅ​ក្នុង​ការ​កំណត់។',
//		    title: 'កំណត់​ការ​រំឭក​ជា​លើក​ដំបូង',
//		    subTitle: 'នេះ​បង្ហាញ​តែ​លើក​ដំបូង​ប៉ុណ្ណោះ',
//		    scope: $scope,
//		    buttons: [
//		    {
//				text: 'មិន​បើក​ទេ',
//			  	type: 'button-assertive'
//			},
//		    {
//		        text: '<b>សូម​បើក​វា</b>',
//		        type: 'button-positive',
//		        onTap: function(e) {
//		        	return true;
//		        }
//		    }
//		    ]
//		});

//		return popup;
//	};

//	// This function checks if it is the first launch.
//	// It is used as a callbackf function in 'deviceready' event below.
//	function fetchError(error) {
//		console.log("Preference is not set.");

//		if($datetime.date.type === 'absolute') {
//			var d = new Date();
//			ddate = (d.getMonth() + 1).toString() + '/' + d.getDate().toString() + '/' + d.getFullYear().toString();
//		} else if($datetime.date.type === 'relative') {
//			list = $datetime.date.valuelist;
//			for(i = 0; i < list.length; i++) {
//				if(list[i].default === true) {
//					ddate = list[i].value;
//					break;
//				}
//			}
//		} else {
//			ddate = $datetime.date.start;
//			ndays = $datetime.date.ndays;
//		}

//		switch($datetime.time.type) {
//			case 'absolute':
//				dtime = "16:00:00";
//				break;
//			case 'relative':
//				list = $datetime.time.valuelist;
//				for(i = 0; i < list.length; i++) {
//					if(list[i].default === true) {
//						dtime = list[i].value;
//						break;
//					}
//				}
//				break;
//			case 'fixed':
//				dtime = $datetime.time.start;
//		}

//		if($datetime.type !== "relative") {
//			confirm().then(function(res) {
//				if(res) {
//					json = '{"time": "' + dtime + '", "date": "' + ddate + '", "ndays":'+ ndays +', "link":"/page/", "datetype": "' + $datetime.date.type + '", "timetype": "' + $datetime.time.type + '"}';
//					pref.store(function success(){}, function error(){}, "selfivr-pref", json);
//				} else {
//					pref.store(function success(){}, function error(){}, "selfivr-pref", "no-reminder");
//				}

//				$timeout(function() {
//					$state.go('page');
//				}, 2000);
//			});
//		} else {
//			json = '{"time": "' + dtime + '", "date": "' + ddate + '", "ndays":'+ ndays +', "link":"/page/", "datetype": "' + $datetime.date.type + '", "timetype": "' + $datetime.time.type + '"}';
//			pref.store(function success(){}, function error(){}, "selfivr-pref", json);

//			$timeout(function() {
//				$state.go('page');
//			}, 2000);
//		}
//	}

//	function fetchSuccess(value) {
//		console.log("Preference is already set: " + value);

//		if(AlarmInterface.getURL() === undefined || AlarmInterface.getURL() === null) {
//			$timeout(function() {
//				$state.go('page');
//			}, 2000);
//		}
//	}

//	// Make sure Cordova engine has loaded all things.
//	document.addEventListener('deviceready', function() {
//		try {
//			pref = plugins.appPreferences;
//			pref.fetch(fetchSuccess, fetchError, 'selfivr-pref');
//		} catch(e) {
//			console.error("Application preferences does not work in this environment. You should open this page in native mobile application.");
//		}

//    });

}])

.controller('MainCtrl',
['$scope', '$player', '$ionicHistory', '$interval',
function($scope, $player, $ionicHistory, $interval) {

	$scope.content_descs = null;

	$scope.exit = function() {
		// navigator.app.exitApp();
		navigator.notification.confirm(
			'តើ​អ្នក​ពិត​ជា​ចង់​ចាកចេញ​មែន​ទេ?', // message
			function(buttonIndex) {
				if (buttonIndex==2){
					$player.stop();
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
	$scope.dd = {
		toggle: false,
		ndays: 1
	};

	if ( $datetime.date.type === 'fixed' ) {
		$scope.dd.toggle = true;
	}

	if ( $datetime.date.type === 'relative' ) {
		$scope.dt.day = getDefaultItem( $datetime.date.valuelist );
	}

	if ( $datetime.time.type === 'relative' ) {
		$scope.dt.hour = getDefaultItem( $datetime.time.valuelist );
	}

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

	function getDefaultItem(list) {
		for(var item in list) {
			if(list[item].default === true) {
				return list[item];
			}
		}
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
						var time = new Date("01/01/2015 " + result.time);
						$scope.dt.hour = addZero(time.getHours());
						$scope.dt.minute = addZero(time.getMinutes());
						console.log("OnlyTime: " + $scope.dt.hour + " " + $scope.dt.minute);
						break;
					default:
						$scope.dt.hour = getObject($datetime.time.valuelist, result.time);
				}

				$scope.dd.toggle = true;
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
		} else {
			json = "no-reminder";
		}

		pref.store(success, failed, "selfivr-pref", json);
	};
}])

.controller('AlarmCtrl', ['$scope', '$location', '$ionicHistory', function($scope, $location, $ionicHistory) {
	$scope.delay = function(minutes) {
		AlarmInterface.delayReminder(minutes);
	};

	$scope.openPage = function() {
		// Set next page view as the history root.
		$ionicHistory.nextViewOptions({
			historyRoot: true
		});
		$location.path(AlarmInterface.getURL());
		AlarmInterface.setURL(null);
	};
}]);
