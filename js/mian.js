var app = angular.module('test', []);
var val = $('#clickadd').find('input').val()
app.directive('ngX', [function() {
	return {
		restrict: 'A',
		template: '<ul id="list"><div ng-transclude></div></ul>',
		replace: true,
		transclude: true,
		link: function($scope, el) {
			$(el).on('keyup', false)
			$(el).on('click', 'li', function() {
				$(el).find('li').removeClass('nowclick')
				$(this).addClass('nowclick')
			})
			$(el).on('dblclick', 'li', function() {
				$(el).find('input').show()
			})
			$(document).on('keyup', function(e) {
				if(e.keyCode === 8) {
					var index = $('.nowclick').index();
					if(index == -1) {
						return
					}
					$scope.$apply(function() { //监测
						$scope.list.splice(index, 1);
						$(el).find('li').removeClass('nowclick')
						$(el).find('li').eq(index).addClass('nowclick')
					})
					$scope.savedate();
				}
			})
			$(document).on('keyup', ':input', false)
		}
	}
}]);
app.directive('ngA', [function() {
	return {
		restrict: 'A',
		template: '<span>选项</span>',
		replace: true,
		link: function($scope, el) {
			$(el).on('click', function() {
				$('.xunxian').fadeIn()
				$('.x-c-in').removeClass('backurl')
				$('.x-c-in').eq($scope.bycol()).addClass('backurl')
				return false
			})
			$('.xunxian').on('click', false)
			$(document).on('click', function() {
				$('.xunxian').fadeOut()
				$('.replace').hide()
				$scope.savedate()
				$('#clickadd').hide()
				$('#clickadd').find('input').val('')
				$('#done a').hide()
				$('#done2 a').hide()
			})
			$('.xun-circle').on('click', '.x-c-in', function() {
				$('.x-c-in').removeClass('backurl')
				$('.x-c-in').eq($scope.bycol()).addClass('backurl')
				return false;
			})
		}
	}
}]);
app.directive('ngB', [function() {
	return {
		restrict: 'A',
		template: '<a href="javascript:;">完成</a>',
		replace: true,
		link: function($scope, el) {
			$(el).on('click', function() {
				$scope.savedate()
				$('.xunxian').fadeOut()
			})
		}
	}
}])
app.directive('ngC', [function() {
	return {
		restrict: 'A',
		template: '<a href="javascript:;">取消</a>',
		replace: true,
		link: function($scope, el) {
			$(el).on('click', function() {
				$('.xunxian').fadeOut()
			})
			$('#click a').first().on('click', function() {
				$scope.$apply(function() { //监测
					$scope.dele()
					$scope.cu = 0
				})
				$('.xunxian').fadeOut()
			})
			$('#done2').on('click', 'li', function() {
				$('.replace').hide()
				$(this).find('.replace').show()
				$(this).find('input').focus()
				$(this).find('a').show()
				$('.xunxian').fadeOut()

				return false
			})
			$('#done').on('click', 'li', function() {
				$('.replace').hide()
				$(this).find('.replace').show()
				$(this).find('input').focus()
				$(this).find('a').show()
				$('.xunxian').fadeOut()
				return false
			})
			$('.con-1').on('click', function() {
				$('#done').toggle()
				$(this).find('.wan-img').toggleClass('wan-im')
			})
			$('.con-2').on('click', function() {
				$('#done2').toggle()
				$(this).find('.wan-img').toggleClass('wan-im')
			})

			$('#newwork').on('click', function() {
				$('.xunxian').fadeOut()

				$('#clickadd').show()
				$('.replace').hide()
				$('#clickadd').find('input').focus()
				return false
			})
			$('#clickadd').find('input').on('click', false)
			$('#clickadd').find('input').focusout(function() {
				$('#clickadd').hide()
				$scope.$apply(function() {
					val = $('#clickadd').find('input').val()
					if(val != '') {
						$scope.newadd()
					}
				})
			})
		}
	}
}])
app.controller('testCtrl', ['$scope', function($scope) {
	$scope.colors = ['gurgle', 'green', 'blue', 'yellow', 'brown', 'red', 'orange']
	$scope.list = [];
	if(localStorage.remuber) {
		$scope.list = JSON.parse(localStorage.remuber)
	} else {
		$scope.list = [{
			id: 1000,
			name: '新建表 ',
			theme: 'gurgle',
			todos: [{
				name: '新建项目',
				state: 0
			}]
		}]
	}
	$scope.savedate = function() {
		localStorage.remuber = JSON.stringify($scope.list)
	}
	$scope.cu = 0
	$scope.cuadd = function(index) {
		$scope.cu = index
	}

	function maxId() {
		var max = -Infinity
		for(var i = 0; i < $scope.list.length; i++) {
			if(max <= $scope.list[i].id) {
				max = $scope.list[i].id
			}
		}
		return(max === -Infinity) ? 1000 : max;
	}
	$scope.addlist = function() {
		var len = $scope.list.length
		var index = len % 7
		var v = {
			id: maxId() + 1,
			name: '新建表 ' + (maxId() + 1 - 1000),
			theme: $scope.colors[index],
			todos: []
		}
		$scope.list.push(v)
	}
	$scope.bycol = function() {
		for(var i = 0; i < $scope.colors.length; i++) {
			if($scope.list[$scope.cu].theme == $scope.colors[i]) {
				return i
			}
		}
	}
	$scope.dele = function() {
		$scope.list.splice($scope.cu, 1)
	}
	$scope.newadd = function() {
		var v = {
			name: val,
			state: 0
		}
		$scope.list[$scope.cu].todos.push(v)
	}
	$scope.delelist = function(index) {
		$scope.list[$scope.cu].todos.splice(index, 1)
	}
	$scope.donum = function() {
		var r = 0;
		$scope.list[$scope.cu].todos.forEach(function(v, i) {
			if(v.state == 1) {
				r += 1
			}
		})
		return r
	}
	$scope.notnum = function() {
		var r = 0;
		$scope.list[$scope.cu].todos.forEach(function(v, i) {
			if(v.state == 0) {
				r += 1
			}
		})
		return r
	}
	$scope.clear = function() {
		var newarr = []
		$scope.list[$scope.cu].todos.forEach(function(v, i) {
			if(v.state == 0) {
				newarr.push($scope.list[$scope.cu].todos[i])
			}
		})
		$scope.list[$scope.cu].todos = newarr
	}
}])