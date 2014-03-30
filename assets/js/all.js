window.app = angular.module('miApp', []);

(function(w) {
  app.service("clientService", function($http) {
    var protocol = "http://",
        // hostName = "localhost:3000",
        hostName = "mini-game-api.herokuapp.com",
        basePath = "",
        defaultParams = {
          per_page: 20
        };
    this.defaultParams = defaultParams;

    var listApiUrl = function(path) {
      return protocol + hostName + basePath + path;
    };
    var paramsWithDefaults = function(params) {
      var p = {};
      angular.extend(p, defaultParams);
      if (angular.isObject(params)) {
        angular.extend(p, params);
      }
      return p;
    };
    this.parties = function(params) {
      var url = listApiUrl("/parties.json");
      return $http({
        url: url,
        method: "GET",
        params: paramsWithDefaults(params)
      });
    };
    this.people = function(params) {
      var url = listApiUrl("/candidates.json");
      return $http({
        url: url,
        method: "GET",
        params: paramsWithDefaults(params)
      });
    };
    this.districts = function(params) {
      var url = listApiUrl("/districts.json");
      return $http({
        url: url,
        method: "GET",
        params: paramsWithDefaults(params)
      });
    };
  });


  app.controller("PeopleController", ['$scope', 'clientService', '$filter',
    function($scope, clientService, $filter) {
      $scope.districts = [
        { label: "Jakarta 1", value: 1 },
        { label: "Jakarta 2", value: 2 },
        { label: "Jakarta 3", value: 3 },
      ];
      $scope.filters = [
        {
          headingName: "Umur",
          inputPrefix: "age_range_",
          inputName: "age_range_ids",
          choices: [
            { label: '21-30', value: '1' },
            { label: '31-40', value: '2' },
            { label: '41-50', value: '3' },
            { label: '51-60', value: '4' },
            { label: '> 60', value: '5' }
          ]
        },
        {
          headingName: "Partai",
          inputPrefix: "party_",
          inputName: "party_ids[]",
          choices: [
            {label: 'Memuat...', value: '-'}
          ]
        },
        {
          headingName: "Pendidikan Terakhir",
          inputPrefix: "education_kind_",
          inputName: "education_kind_ids[]",
          choices: [
            {label: 'S1', value: '1'},
            {label: 'S2', value: '2'},
            {label: 'S3', value: '3'},
            {label: '< S1', value: '4'},
            {label: 'N/A', value: '5'}
          ]
        },
        {
          headingName: "Tempat pend. terakhir",
          inputPrefix: "education_place_",
          inputName: "education_place_ids[]",
          choices: [
            {label: 'Dalam negeri', value: '1'},
            {label: 'Luar negeri', value: '2'}
          ]
        },
        {
          headingName: "Anggota legislatif 09-14",
          inputPrefix: "is_member_",
          inputName: "is_member[]",
          choices: [
            {label: 'Ya', value: '1'},
            {label: 'Tidak', value: '2'}
          ]
        }
      ];

      var fetchPeople = function(params) {
        $scope.fetchPeopleState = "loading";
        clientService.people(params).success(function(data) {
          $scope.peopleCount = data.total;
          if ($scope.peopleCount == 0) {
            $scope.fetchPeopleState = "success-empty";
          } else {
            $scope.fetchPeopleState = "success";
          }
          $scope.page = data.page;
          $scope.people = data.data;
        }).error(function() {
          $scope.fetchPeopleState = "error";
        });
      };

      $scope.fetchPeopleState = "loading";
      $scope.filterParams = {
        district_id: 1
      };
      $scope.page = {
        current: 1,
        total: 0,
        per_page: 20
      };

      $scope.goToCurrentPage = function() {
        var params = { page: $scope.page.current };
        angular.extend(params, $scope.filterParams);
        fetchPeople(params);
      };

      $scope.refetchPeople = function() {
        $scope.page.current = 1;
        $scope.goToCurrentPage();
      };
      $scope.refetchPeople();

      $scope.peopleCount = 0;
      $scope.people = [];
      $scope.pages = function(n) {
        var arr = [];
        for (var i = 1; i <= n; i++) {
          arr.push(i);
        }
        return arr;
      };

      var partyAsFilterItem = function(party) {
        return {
          label: party.name,
          value: party.id
        };
      };
      var partyIndex = 1;
      clientService.parties().success(function(data) {
        var choices = [];
        var list = data.data, listN = list.length;
        for (var i = 0; i < listN; i++) {
          choices.push(partyAsFilterItem(list[i]));
        };
        $scope.filters[partyIndex].choices = choices;
      });
    }
  ]);
})(window);
