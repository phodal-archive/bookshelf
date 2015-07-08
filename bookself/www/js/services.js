angular.module('starter.services', [])
	.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
		var self = this;

		self.query = function (query, parameters) {
			parameters = parameters || [];
			var q = $q.defer();

			$ionicPlatform.ready(function () {
				$cordovaSQLite.execute(db, query, parameters)
					.then(function (result) {
						q.resolve(result);
					}, function (error) {
						console.warn(error);
						q.reject(error);
					});
			});
			return q.promise;
		};

		self.getAll = function(result) {
			var output = [];

			for (var i = 0; i < result.rows.length; i++) {
				output.push(result.rows.item(i));
			}
			return output;
		};

		self.getById = function(result) {
			var output = angular.copy(result.rows.item(0));
			return output;
		};

		return self;
	})

	.factory('bookshelfDB', function($cordovaSQLite, DBA) {
		var self = this;

		self.all = function() {
			return DBA.query("SELECT id, title FROM bookshelf")
				.then(function(result){
					return DBA.getAll(result);
				});
		};

		self.get = function(memberId) {
			var parameters = [memberId];
			return DBA.query("SELECT id, title FROM bookshelf WHERE id = (?)", parameters)
				.then(function(result) {
					return DBA.getById(result);
				});
		};

		self.add = function(member) {
			var parameters = [member.id, member.title];
			return DBA.query("INSERT INTO bookshelf (id, title) VALUES (?,?)", parameters);
		};

		self.remove = function(member) {
			var parameters = [member.id];
			return DBA.query("DELETE FROM bookshelf WHERE id = (?)", parameters);
		};

		self.update = function(origMember, editMember) {
			var parameters = [editMember.id, editMember.title, origMember.id];
			return DBA.query("UPDATE bookshelf SET id = (?), title = (?) WHERE id = (?)", parameters);
		};

		return self;
	});