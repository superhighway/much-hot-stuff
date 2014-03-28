window.app = angular.module('miApp', []);

(function(w) {
  app.service("clientService", function($http) {
    var protocol = "http://",
        hostName = "api.pemiluapi.org",
        basePath = "/candidate/api",
        defaultParams = {
          apiKey: "fea6f7d9ec0b31e256a673114792cb17",
          limit: 24
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
      var url = listApiUrl("/partai");
      return $http({
        url: url,
        method: "GET",
        params: paramsWithDefaults(params)
      });
    };
    this.people = function(params) {
      var url = listApiUrl("/caleg");
      return $http({
        url: url,
        method: "GET",
        params: paramsWithDefaults(params)
      });
    };
    this.districts = function(params) {
      var url = listApiUrl("/dapil");
      return $http({
        url: url,
        method: "GET",
        params: paramsWithDefaults(params)
      });
    };

    var detailsApiUrl = function(path, id) {
      return protocol + hostName + basePath + path + "/" + new String(id);
    };
    this.party = function(partyId, params) {
      var url = detailsApiUrl("/partai", partyId);
      return $http({
        url: url,
        method: "GET",
        params: paramsWithDefaults(params)
      });
    };
    this.person = function(personId, params) {
      var url = detailsApiUrl("/caleg", personId);
      return $http({
        url: url,
        method: "GET",
        params: paramsWithDefaults(params)
      });
    };
    this.district = function(districtId, params) {
      var url = detailsApiUrl("/dapil", districtId);
      return $http({
        url: url,
        method: "GET",
        params: paramsWithDefaults(params)
      });
    };

  });


  app.controller("PeopleController", ['$scope', 'clientService', '$filter',
    function($scope, clientService, $filter) {
      $scope.filters = [
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
          inputPrefix: "last_edu_",
          inputName: "last_edu_ids[]",
          choices: [
            {label: 'S1', value: '1'},
            {label: 'S2', value: '2'},
            {label: '< S1', value: '3'},
            {label: 'N/A', value: '4'}
          ]
        },
        {
          headingName: "Tempat pend. terakhir",
          inputPrefix: "last_edu_place_",
          inputName: "last_edu_place_ids[]",
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
          $scope.peopleCount = data.data.results.total;
          if ($scope.peopleCount == 0) {
            $scope.fetchPeopleState = "success-empty";
          } else {
            $scope.fetchPeopleState = "success";
          }
          $scope.pageCount = Math.ceil($scope.peopleCount / parseFloat(clientService.defaultParams.limit));
          $scope.people = data.data.results.caleg;
        }).error(function() {
          $scope.fetchPeopleState = "error";
        });
      };

      $scope.goToPage = function(i) {
        var params = {
          offset: ($scope.currentPage-1) * clientService.defaultParams.limit
        };
        fetchPeople(params);
      };
      fetchPeople({});

      $scope.fetchPeopleState = "loading";
      $scope.peopleCount = 0;
      $scope.pageCount = 0;
      $scope.currentPage = 1;
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
          label: party.nama,
          value: party.id
        };
      };
      clientService.parties().success(function(data) {
        var choices = [];
        var list = data.data.results.partai, listN = list.length;
        for (var i = 0; i < listN; i++) {
          choices.push(partyAsFilterItem(list[i]));
        };
        $scope.filters[0].choices = choices;
      });

      var districtAsFilterItem = function(district) {
        return {
          label: district.nama,
          value: district.id
        };
      };

      /*
      clientService.districts().success(function(data) {
        $scope.districts = data.data.results.dapil;
      });
      */
    }
  ]);
})(window);
