var fs = require('fs'), jade = require('pug');
exports.getAdopteeHtml = function(adoptee, templatedata) {

	var fn = jade.compile(templatedata);
	var html = fn(adoptee);
	//console.log(html);
	return html;

};
