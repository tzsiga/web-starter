(function(app) {
  "use strict";

  app.factory('crud', crud);

  crud.$inject = [
    '$http',
    '$q'
  ];

  function crud ($http, $q) {
    function request (method) {
      return function (url, payload) {
        var defer = $q.defer();

        $http({
          'method': method,
          'url': url,
          'data': payload
        }).then(handleResponse(defer));

        return defer.promise;
      };
    }

    function handleResponse (retrieval) {
      return function (response) {
        if (response.data.success) {
          retrieval.resolve(response.data.result);
        } else {
          retrieval.reject(Records.ErrorMessage(response.data.errorMessage));
        }
      };
    }

    return {
      get: request('GET'),
      post: request('POST')
    };
  }

}(app));
