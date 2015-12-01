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
    controller: ["$scope", "$element", "$attrs", "$player", "$ionicScrollDelegate", "$timeout",
    function($scope, $element, $attrs, $player, $ionicScrollDelegate, $timeout) {
      $scope.isPlaying = false;
      $ionicScrollDelegate.freezeScroll(true);

      document.addEventListener("deviceready", function() {
        $timeout(function() {
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
        });
      }, false);

      $scope.hello = function() {
          alert("Hello");
      };

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

      $scope.replay = function() {
        $scope.stop();
        $scope.play();
      };
    }]
  };
})
.directive('siPage', function() {
  return {
    restrict: 'E',
    compile: function(tElement, tAttrs) {

      if(tAttrs.background) {
        var ionContent = angular.element(tElement[0].parentElement.parentElement);
        ionContent.css("background-image", "url('"+tAttrs.background+"')");
        ionContent.css("background-attachment", "fixed");
        ionContent.css("background-position", "center");
        ionContent.css("background-repeat", "no-repeat");
        ionContent.css("background-size", "cover");
      }


      return {
        post: function(scope, element, attrs) {
          var dom = element[0];
          var numberOfChoice = dom.children.length;

          if("true" == attrs.manual) return;

          dom.className = "page one-col center";

          if(numberOfChoice === 5) {
            dom.className = "page two-cols center";
            dom.children[2].style.width = "100%";
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
        }
      };
    },
    controller: ["$scope", "$element", "$attrs", "$ionicHistory", "$player", "$timeout", function($scope, $element, $attrs, $ionicHistory, $player, $timeout) {

      this.backColor = $attrs.backColor;
      this.textColor = $attrs.textColor;
      this.shape   = $attrs.shape;
      this.siStyle   = $attrs.siStyle;

      document.addEventListener("deviceready", function() {
        $timeout(function() {
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
        });
      }, false);
    }]
  };
})
.directive('siChoice', ["$global", "$rootScope", "$compile", "$state", function($global, $rootScope, $compile, $state) {
  return {
    require  : '^siPage',
    restrict : 'E',
    scope: {},
    template: "<div class='choice-content'></div>",
    link: function(scope, element, attrs, sipage) {

      element.on('click', function() {
        if(attrs.url) {
          $state.go('page', {pageId: attrs.url});
        }
      });

      scope.bigtext   = attrs.bigtext;
      scope.smalltext = attrs.smalltext;
      scope.image   = attrs.image;
      var shape     = attrs.shape || sipage.shape || $global.shape;
      var color     = attrs.textColor || sipage.textColor || $global.textColor;
      var backColor   = attrs.backColor || sipage.backColor || $global.backColor;
      var siStyle     = attrs.siStyle || sipage.siStyle || $global.style;
      var children  = element.children();

      element.addClass('choice-item');
      children.addClass(siStyle);
      children.addClass(shape);
      children.addClass(backColor);
      children.html(getTemplate(siStyle, shape));
      $compile(children.contents())(scope);
    }
  };
}])
.directive('siFooter', function() {
    return {
        restrict: 'E',
        templateUrl: 'footer.html',
        scope: {
            control: '@'
        },
        controller: ['$scope', '$player', '$state', '$ionicHistory', function($scope, $player, $state, $ionicHistory) {
            var current;

            $scope.isMute = false;

            $scope.home = function() {
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.go('page', { pageId: "" });
            };

            $scope.replay = function() {
                current = $player.current;
                $player.stop();
                current.seekTo(0);
                $player.current = current;
                $player.play();
            };

            $scope.mute = function() {
                $scope.isMute = true;
                $player.current.setVolume(0.0);
            };

            $scope.unmute = function() {
                $scope.isMute = false;
                $player.current.setVolume(1.0);
            };

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
        }]
    };
});

function getTemplate(style, shape) {
  var templates   = {}; // template list
  var template  = ""; // to be returned

  var bigtext   = "<div class='bigtext'>{{::bigtext}}</div>";
  var smalltext   = "<div class='smalltext'>{{::smalltext}}</div>";
  var image     = "<div class='choice-image'><img ng-src='img/{{::image}}' /></div>";

  templates.onlyImage    = "<div class='only-image'><img ng-src='img/{{::image}}' /></div>";
  templates.onlyText     = "<div class='only-text'>{{::bigtext}}</div>";
  templates.smalltextImage = smalltext + image;
  templates.imageSmalltext = image + smalltext;
  templates.bigSmall     = bigtext + smalltext;
  templates.smallBig     = smalltext + bigtext;

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
