angular.module('starter.controllers', [])

// Constantes de produção
// Tive problemas de CORS Cross Origin Resource Sharing com ionic server_response
// Instalado plugin no Chrome
// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
.constant('production', {
  url: 'http://localhost:8080'
})

.controller('DashCtrl', function($scope, $http, production) {

  // Testador de GET no Servidor, envia HTTP request e traz resposta em formato JSON
  $scope.server_response = null;
  $http.get(production.url + '/testGET').then(function(resp) {
    $scope.server_response = resp.data;
  }, function(err) {
    $scope.server_response = err;
    console.error('ERR', err);
    // err.status will contain the status code
  });
  // Pegar array com métodos REST vindos do Servidor e mostrar com ng-repeat
  $http.get(production.url + '/getREST').then(function(resp) {
    $scope.methods= resp.data;
  }, function(err) {
    $scope.methods = err;
    console.error('ERR', err);
    // err.status will contain the status code
  });

})

/*
 * Calendário
 */
.controller('CalendarCtrl', function($scope) {

  $scope.day = moment();

})

  // Diretiva para calendário

  .directive("calendar", ['$http', 'production', function($http, production) {
      return {
          restrict: "E",
          templateUrl: "templates/tpl-calendar.html",
          scope: {
              selected: "="
          },
          link: function(scope) {
              scope.selected = _removeTime(scope.selected || moment());
              scope.month = scope.selected.clone();

              var start = scope.selected.clone();
              start.date(1);
              _removeTime(start.day(0));

              _buildMonth(scope, start, scope.month, _getEventsData(scope.month));

              scope.select = function(day) {
                  scope.selected = day.date;
              };

              scope.next = function() {
                  var next = scope.month.clone();
                  _removeTime(next.month(next.month()+1).date(1));
                  scope.month.month(scope.month.month()+1);
                  _buildMonth(scope, next, scope.month, _getEventsData(scope.month));
              };

              scope.previous = function() {
                  var previous = scope.month.clone();
                  _removeTime(previous.month(previous.month()-1).date(1));
                  scope.month.month(scope.month.month()-1);
                  _buildMonth(scope, previous, scope.month, _getEventsData(scope.month));
              };
          }
      };

      function _removeTime(date) {
          return date.day(0).hour(0).minute(0).second(0).millisecond(0);
      }

      function _buildMonth(scope, start, month, eventsData) {
          scope.weeks = [];
          var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
          while (!done) {
              scope.weeks.push({ days: _buildWeek(date.clone(), month, eventsData) });
              date.add(1, "w");
              done = count++ > 2 && monthIndex !== date.month();
              monthIndex = date.month();
          }
      }

      function _getEventsData(month){

          //alert(month.month());
          $http.get(production.url + '/getCalendarEvents/' + month.month()).then(function(resp) {
            //alert(resp.data);
            return resp.data;
          }, function(err) {
            return err;
            console.error('ERR', err);
            // err.status will contain the status code
          });

      }

      function _buildWeek(date, month, eventsData) {
          var days = [];
          //alert(eventsData);
          for (var i = 0; i < 7; i++) {
              days.push({
                  name: date.format("dd").substring(0, 1),
                  number: date.date(),
                  isCurrentMonth: date.month() === month.month(),
                  isToday: date.isSame(new Date(), "day"),
                  date: date,
                  //'event': _findEvents(date, eventsData),
                  //hasEvent : true
              });
              date = date.clone();
              date.add(1, "d");
          }
          return days;
      }

      /*function _findEvents(actual_date, eventsData){

        alert(eventsData);
        for (var i = 0; i < eventsData.length; i++){

          alert(eventsData[i].data);

        }
        return true;

      }*/

  }])

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

  // Montar Calendário
.controller('CalendarCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
