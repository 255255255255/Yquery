function myAddEvent(obj, sEv, fn) {
	//IE浏览器
	if(obj.attachEvent) {
		obj.attachEvent("on" + sEv, function() {

			if(false == fn.call(obj)) {
				//阻止冒泡
				event.cancelBubble = true;
				//阻止默认事件
				return false;
			}
		});
		//标准浏览器
	} else {
		obj.addEventListener(sEv, function(ev) {
			//false表示冒泡，true表示捕获，大多数情况下用冒泡不用捕获
			if(false == fn.call(obj)) {
				//阻止冒泡
				event.cancelBubble = true;
				//阻止默认事件
				ev.preventDefault();
			}
		}, false);
	}
}
//通过JavaScript操作DOM方式获取类选择器
function getByClass(oParent, sClass) {
	var aEle = oParent.getElementsByTagName('*');
	var aResult = [];
	var i = 0;
	for(i = 0; i < aEle.length; i++) {
		if(aEle[i].className == sClass) {
			aResult.push(aEle[i]);
		}
	}
	return aResult;
}
//getStyle()：用来获取CSS样式属性值。
function getStyle(obj, attr) {
	if(obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
		//参数中的false并没有什么实际的意义，只要随便传一个值就行，
		//你也可以写true,或者随便的一个数字、字符。
	}
}
//函数appendArray():实现连接两个或两个以上HTML集合的功能
function addendArr(arr1, arr2) {
	var i = 0;
	//把arr2数组的值都push到arr1中。
	for(i = 0; i < arr2.length; i++) {
		arr1.push(arr2[i]);
	}
}
//获取指定元素在同辈元素处的索引值。
function getIndex(obj) {
	//获取obj的父节点(body)的孩子节点(4个<input>标签)
	var aBrother = obj.parentNode.children;
	var i = 0;
	//obj的节点肯定和aBrother的某个节点相等，可以循环遍历判断一下
	for(i = 0; i < aBrother.length; i++) {
		if(aBrother[i] == obj) {
			return i;
		}
	}
}

function Yquery(yArg) {
	//yArg这 里表示任何类型的参数，命名要规范。 
	//我们需要根据传进来的不同参数做不同的事情
	//首先判断传进来的参数的类型
	this.elements = []; //用来保存选择器选择的元素
	switch(typeof yArg) {
		//如果传进来的参数是函数类型,就直接让window.onload执行
		case 'function':
			//使用绑定的方式，
			myAddEvent(window, "load", yArg);
			break;
			//如果传进来的参数是字符串类型，又分为三种情况
		case 'string':
			switch(yArg.charAt(0)) {
				case '#': //ID
					//如果选择器是ID选择器，那么yArg的值可能是"#div",我们需要把#去掉，剩下的才是我们想要的
					var obj = document.getElementById(yArg.substring(1));
					//这时，elements数组就存了被ID选择器选中的字符串 	   
					this.elements.push(obj);
					break;
				case '.': //class
					//从哪个父元素选择元素？从整个文档选取类选择器。
					//用substring(1)去掉类选择器的". "
					//用返回的数组aResult，替换elements数组
					this.elements = getByClass(document, yArg.substring(1));
					break;
				default: //tagName
					this.elements = document.getElementsByTagName(yArg);
			}
			break;
		case 'object':
			//如果传进来的参数是字符串对象类型，就直接放到elemens数组
			this.elements.push(yArg);
	}
}
//给Yquery函数绑定click事件
Yquery.prototype.click = function(fn) {
	//不同的选择器可能选择多个元素，给每个选中的元素都需要添加单击事件
	var i = 0;
	//elements数组里面放的就是被选中的元素
	for(i = 0; i < this.elements.length; i++) {
		myAddEvent(this.elements[i], "click", fn);
	}
	return this;
};
//声明一个$符号函数，函数内部返回我们的构造函数，以代替每次的的入口函数都要写new Yquery
function $(yArg) {
	return new Yquery(yArg);
};
//封装类似jQuery中的show()函数
Yquery.prototype.show = function() {
	//不同的选择器可能选择多个元素，给每个选中的元素都需要添加show事件
	var i = 0;
	//elements数组里面放的就是被选中的元素,让被选中的每一个元素都在展示出来
	for(i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = "block";
	}
	return this;
};
//封装类似jQuery中的hide()函数
Yquery.prototype.hide = function() {
	//不同的选择器可能选择多个元素，给每个选中的元素都需要添加hide()方法
	var i = 0;
	//elements数组里面放的就是被选中的元素,让被选中的每一个元素都隐藏
	for(i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display = "none";
	}
	return this;
};
//封装类似jQuery中的hover()函数
//hover()方法需要两个参数，一个是mouseenter(),一个是mouseleave()
Yquery.prototype.hover = function(fnEnter, fnLeave) {
	//不同的选择器可能选择多个元素，给每个选中的元素都需要添加hover方法
	var i = 0;
	//elements数组里面放的就是被选中的元素
	for(i = 0; i < this.elements.length; i++) {
		myAddEvent(this.elements[i], "mouseenter", fnEnter);
		myAddEvent(this.elements[i], "mouseleave", fnLeave);
	}
	return this;
};
//封装css(方法)
//CSS()方法主要有两个功能：设置样式(两个参数)和获取样式(一个参数),也就是说参数个数不固定
Yquery.prototype.css = function(attr, value) {
	if(arguments.length == 2) //设置样式
	{
		//不同的选择器可能选择多个元素，给每个选中的元素都需要添加css方法
		var i = 0;
		//elements数组里面放的就是被选中的元素
		for(i = 0; i < this.elements.length; i++) {
			this.elements[i].style[attr] = value;
		}
	} else { //可能是设置多个样式也可能是获取样式

		if(typeof attr == 'string') {
			//如果是字符串类型的话还是获取样式属性值。
			//获取第一个匹配元素的样式属性值。
			return getStyle(this.elements[0], attr);
		} else { //表示是一个json形式的字符串，设置多个样式属性值

			//elements数组里面放的就是被选中的元素
			for(i = 0; i < this.elements.length; i++) { //现在开始循环attr,JSON字符串
				var k = ''; //空字符串
				for(k in attr) {
					this.elements[i].style[k] = attr[k];
				}
			}
		}
	}
	return this;
};
//封装attr(方法)
//attr()方法主要有两个功能：设置属性(两个参数)和获取属性(一个参数),也就是说参数个数不固定
Yquery.prototype.attr = function(attr, value) {
	if(arguments.length == 2) //设置属性值
	{
		//不同的选择器可能选择多个元素，给每个选中的元素都需要添加attr方法
		var i = 0;
		//elements数组里面放的就是被选中的元素
		for(i = 0; i < this.elements.length; i++) {
			this.elements[i][attr] = value;
		}
	} else { //获取属性值 
		//获取第一个匹配元素的属性值。
		return this.elements[0][attr];
	}
	return this;
}
//封装toggle()函数
//toggle()函数可以有无数多个参数
Yquery.prototype.toggle = function() {
	//不同的选择器可能选择多个元素，给每个选中的元素都需要添加toggle方法
	var i = 0;
	//我们需要提前将arguments的值保存下来，以免被后面的函数的arguments所覆盖。
	var _arguments = arguments;
	//elements数组里面放的就是被选中的元素
	for(i = 0; i < this.elements.length; i++) {
		//计数函数的封装
		addToggle(this.elements[i]);
	}
	function addToggle(obj) {
		var count = 0;
		myAddEvent(obj, 'click', function() {
			//arguments()函数获取一个函数形参的个数
			//这里面的函数指的是就是封装的toggle()函数，
			//也就是说，arguments()函数获取的是toggle()函数的形参的个数。	
			_arguments[count % _arguments.length].call(obj);
			count++;
		})
	}
	return this;
}
//封装eq()函数
//eq()函数有一个参数，获取第几个元素，索引值从1开始。
Yquery.prototype.eq = function(n) {
	//所有能选择到的元素都存在elements数组中
	return $(this.elements[n]);
}
//封装find()函数
//find()函数只有一个参数，但是参数分为两种形式
//一种直接是标签名的形式、一种是类名的形式。
Yquery.prototype.find = function(str) {
	//不同的选择器可能选择多个元素，给每个选中的元素都需要添加find()
	var i = 0;
	var aResult = []; //用来存放临时数据的数组
	//elements数组里面放的就是被选中的元素
	for(i = 0; i < this.elements.length; i++) {
		switch(str.charAt(0)) {
			case '.': //参数是类名的形式
				var aEle = getByClass(this.elements[i], str.substring(1));

				aResult = aResult.concat(aEle);
				break;
			default: //参数是标签名的形式
				var aEle = this.elements[i].getElementsByTagName(str);

				addendArr(aResult, aEle);
		}
	}
	var newYquery = $(); //我们需要创建一个空的Yquery对象，
	newYquery.elements = aResult;
	return newYquery;

};
//封装index()方法
Yquery.prototype.index = function() {

	return getIndex(this.elements[0]);

}
//封装on()函数
Yquery.prototype.on = function(sEv, fn) {
	//不同的选择器可能选择多个元素，给每个选中的元素都需要添加on()方法
	var i = 0;
	//循环的给每个元素都绑定事件
	for(i = 0; i < this.elements.length; i++) {
		//给每个元素绑定sEv事件，执行fn函数
		myAddEvent(this.elements[i], sEv, fn);
	}
}
//插件机制
Yquery.prototype.extend = function(name, fn) 

{
	Yquery.prototype[name] = fn;
};

