(function ($) {
	var GETCLASSES = "http://imoocnote.calfnote.com/inter/getClasses.php";
	
	//ajax错误
	$.ajaxSetup({
		error: function () {
			alert('调用接口失败！');
			return false;
		}
	});
	
	//代码重构
	function renderTemplate (templateSelector, data, htmlSelector) {
		var t = $(templateSelector).html(),
			f = Handlebars.compile(t),     //compile编译模板
			h = f( data );
		$(htmlSelector).html(h);
	}
	
	//加载新页面数据
	function refreshClasses (curPage) {
		$.getJSON(GETCLASSES, {curPage: curPage}, function(data) {
			renderTemplate('#class-template', data.data, '#classes');
			renderTemplate('#paging-template', formatPaging(data), '#paging');
		});
	}
	
	//事件委托
	function bindPageEvent () {
		$('#paging').delegate('li.clickable', 'click', function () {
			$this = $(this);//将点击的当前封装成jq对象，并存给一个变量
			console.log($this);
			refreshClasses($this.data('id')); 
		});
	}
	bindPageEvent ();
	
	$.getJSON(GETCLASSES, {curPage: 1}, function(data) {
		renderTemplate('#class-template', data.data, '#classes');
		renderTemplate('#paging-template', formatPaging(data), '#paging');
	});
	
	//块helper 需要传参数options
	Handlebars.registerHelper("equal", function (val1, val2, options) {
		if (val1 == val2) {
			return options.fn(this);
		}else {
			return options.inverse(this);
			
		}
	});
	
	Handlebars.registerHelper("long", function (time, options) {
		if ( time.indexOf('小时') != -1 ) {
			return options.fn(this); 		//返回long 一小时以上的添加 .long(字橙色)
		}else {
			return options.inverse(this);   //返回 {{else}} 里的              .short(字紫色)
			
		}
	});
	
	function formatPaging (pagingData) {
		var arr = [];
		var total = parseInt(pagingData.totalCount);
		var cur = parseInt(pagingData.curPage);
		//处理到首页的逻辑
		var toLeft = {};
		toLeft.index = 1;
		toLeft.text = '&laquo;';
		if (cur != 1) {
			toLeft.clickable = true;
		}
		arr.push(toLeft);
		//处理到上一页的逻辑
		var pre = {};
		pre.index = cur - 1;
		pre.text = '&lsaquo;';
		if (cur != 1) {
			pre.clickable = true;
		}
		arr.push(pre);
		//处理到cur页前的逻辑
		if (cur <= 5) {
			for (var i=1; i<cur; i++) {
				var pag = {};
				pag.text = i;
				pag.index = i;
				pag.clickable = true;
				arr.push(pag);
			}
		}else {
			//如果cur>5,那么cur前的页面显示...
			var pag = {};
			pag.text = 1;
			pag.index = 1;
			pag.clickable = true;
			arr.push(pag);
			var pag = {};
			pag.text = '...';
			arr.push(pag);
			for (var i=cur-2; i<cur; i++) {
				var pag = {};
				pag.text = i;
				pag.index = i;
				pag.clickable = true;
				arr.push(pag);
			}
		}
		//处理到cur页的逻辑
		var pag = {};
		pag.text = cur;
		pag.index = cur;
		pag.cur = true;
		arr.push(pag);
		//处理到cur页后的逻辑
		if (cur >= total-4) {
			for (var i=cur+1; i<=total; i++) {
				var pag = {};
				pag.text = i;
				pag.index = i;
				pag.clickable = true;
				arr.push(pag);
			}
		}else {
			//如果cur < total-4，那么cur后的页要显示...
			for (var i=cur+1; i<=cur+2; i++) {
				var pag = {};
				pag.text = i;
				pag.index = i;
				pag.clickable = true;
				arr.push(pag);
			}
			var pag = {};
			pag.text = '...';
			arr.push(pag);
			var pag = {};
			pag.text = total;
			pag.index = total;
			pag.clickable = true;
			arr.push(pag);
		}
		//处理到下一页的逻辑
		var next = {};
		next.index = cur + 1;
		next.text = '&rsaquo;';
		if (cur != total) {
			next.clickable = true;
		}
		arr.push(next);
		//处理到尾页的逻辑
		var toRight = {};
		toRight.index = total;
		toRight.text = '&raquo;';
		if (cur != total) {
			toRight.clickable = true;
		}
		arr.push(toRight);
		console.log(arr);
		return arr;
	}
	
})(jQuery)



