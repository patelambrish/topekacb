var mongoose = require('mongoose'),
    PrintEmail = mongoose.model('PrintEmail'),
    fs = require('fs'),
    jade = require('pug'),
    htmlUtil = require('../utilities/adopteeHtml'),
    Adopter = mongoose.model('Adopter');

var pdf = require('html-pdf');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../config/config')[env];
console.log("=====================================");
//console.log("Sendgrid User" + config.sendGridUser);
//console.log("Sendgrid Password" + config.sendGridPassword);
//console.log("Sendgrid APIKey" + config.sendGridAPIKey);
var sendgrid = require('@sendgrid/mail');//(config.sendGridUser, config.sendGridPassword);

sendgrid.setApiKey(config.sendGridAPIKey);

function getAdopterHtml(adopter, templateData) {
	var completeHtml = '',
	    html;
	if (adopter.adoptees && adopter.adoptees.length > 0) {
		adopter.adoptees.forEach(function(adoptee) {
			adoptee.adopter = {
				name : adopter.name,
				email : adopter.email,
				address : adopter.address,
				phones : adopter.phones,
				notifyMethods : adopter.notifyMethods
			};
			html = htmlUtil.getAdopteeHtml(adoptee, templateData);
			completeHtml = completeHtml + html;
		});
	}
	return completeHtml;
}

exports.getPrintEmailRequests = function(req, res, next) {

	PrintEmail.find({}).populate('adopter', 'name org').populate('createdBy', 'firstName lastName').populate('updatedBy', 'firstName lastName').select('-html').then((collection) => {
		res.send(collection);
	});

};

exports.createPrintEmailRequest = function(req, res, next) {
	var data = req.body,
	    userId = req.user ? req.user._id : null;

	data.createDate = new Date();
	data.createdBy = userId;

	Adopter.findById(data.adopter).then((ad) => {
		if (!ad) {
			res.send({
				error : "Error: Adopter not found. Please try again."
			});
		} else {
			PrintEmail.create(data, function(err, peReq) {
				res.send(peReq);
			});
		}
	}).catch((err)=>{
		if (err) {
			console.log(err);
			return next(err);
		}
	});
};

exports.updatePrintEmailRequest = function(req, res, next) {
	var update = req.body,
	    id = update._id,
	    userId = req.user ? req.user._id : null;

	update.updateDate = new Date();
	update.updateUser = userId;

	PrintEmail.findByIdAndUpdate(id, update).then((printEmailReq) => {
		return res.send(printEmailReq);
	}).catch((err) => {
		if (err) {
			res.status(400);
			return res.send({
				error : err.toString()
			});
		}
	});
};

exports.print = function(req, res, next) {
	var requestId = req.params.id;
	console.log("requestId: " + requestId);
	fs.readFile('server/views/adopteePrint.pug', 'utf8', function(err, templateData) {
		PrintEmail.findById(requestId).then((printEmailRequest) => {
			var adopter = printEmailRequest.adopter;
			Adopter.findById(printEmailRequest.adopter).populate('adoptees', '-image').then((completeAdopter) => {
				if (completeAdopter) {

					var completeHtml = getAdopterHtml(completeAdopter, templateData);

					printEmailRequest.status = 'Complete';
					printEmailRequest.updateDate = new Date();
					printEmailRequest.updateUser = req.user._id;
					printEmailRequest.html = completeHtml;

					printEmailRequest.save().then(()=> {
						res.status(200);
						res.send(completeHtml);
					}).catch((err) => {
						if (err) {
							console.log(err);
							return next(err);
						}
					});
				} else {
					res.send("Error: Adopter not found. Please try again.");
				}
			}).catch((err) => {
				if (err) {
					console.log(err);
					return next(err);
				}
			});
		}).catch((err) => {
			if (err) {
				console.log(err);
				return next(err);
			}
		});
	});
};

exports.email = function(req, res, next) {
	var adopterId = req.params.id;
	fs.readFile('server/views/adopteePrint.pug', 'utf8', function(err, templateData) {
		Adopter.findById(adopterId).populate('adoptees').then((adopter) => {
			if (adopter && (adopter.email || adopter.email2)) {

				var completeHtml = getAdopterHtml(adopter, templateData),
				    printEmailRequest = {};
				printEmailRequest.createDate = new Date();
				printEmailRequest.createdBy = req.user._id;
				printEmailRequest.jobType = 'Email';
				printEmailRequest.emailTo = [];
				if(adopter.email) {
					printEmailRequest.emailTo.push(adopter.email);
				}
				if(adopter.email2) {
					printEmailRequest.emailTo.push(adopter.email2);
				}
				adopter.email;
				printEmailRequest.adopter = adopter._id;
				printEmailRequest.status = 'Complete';
				printEmailRequest.html = completeHtml;
				//console.log(completeHtml);
				var emailTo =[];
				if (config.emailTo) {
					emailTo.push(config.emailTo);
				} else {
					emailTo = printEmailRequest.emailTo;
				}
				/*pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
					if (err) return console.log(err);
					console.log(res); // { filename: '/app/businesscard.pdf' }
				  });*/
				var filepath = './'+adopter._id+'.pdf';
				pdf.create(completeHtml, {childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}}).toBuffer(function(err, response) {
					console.log(response);
					console.log(err);
					//attachment = fs.readFileSync(response.filename).toString("base64");
					attachment = response.toString("base64");
					//attachment = Buffer.from(completeHtml).toString("base64");
					var faq = fs.readFileSync("server/content/Adopter FAQ 2022.pdf").toString("base64");
					var costTable = fs.readFileSync("server/content/2022 Family Cost Table.pdf").toString("base64");
					var email = {
						to : emailTo.filter((x, i) => i === emailTo.indexOf(x)),
						from : config.emailFrom,
						subject : config.emailSubject,
						html : 'Dear Adopter, <br/><br/> Thank you for adopting a family or individual this holiday season! We appreciate your willingness to help a neighbor in need. <br/><br/> Attached are important documents for your review. The Adoptee List will have your individual or family information including contact information and their wish lists items. The Adopters FAQ and Family Cost Table are some general guidelines and expectations that should answer most of your questions about participating in Christmas Bureau. <br/>If you have any questions or comments please do not hesitate to contact the Christmas Bureau staff at (785) 273-4804 or cb@uwkawvalley.org.<br/><br/> Christmas Bureau<br/>United Way of Kaw Valley.',
						attachments : [{
									filename : 'Adoptee List.pdf',
									content : attachment
								},
								{
									filename: 'Adopters FAQ.pdf',
									content: faq
								},
								{
									filename: 'Family Cost Table.pdf',
									content: costTable
								}
							]						
					};
//					email.setHeaders({'Read-Receipt-To': emailTo[0]});   
//					email.setHeaders({'X-Confirm-reading-to': emailTo[0]}); 
//					email.setHeaders({'Disposition-Notification-To': emailTo[0]});

					//ES6
					sendgrid
					.send(email)
					.then(() => {
						//fs.unlinkSync(filepath);
						PrintEmail.create(printEmailRequest, function(err, newRequest) {
							if (err) {
								console.log(err);
								return next(err);
							}
							res.status(200);
							res.send(newRequest);
						});							
					}, error => {
						console.error(error);
						fs.unlinkSync(filepath);
						if (error.response) {
						console.error(error.response.body)
						}
					});
/*					sendgrid.send(email, function(err, json) {
						if (err) {
							console.error(err);
							return next(err);
						}
						console.log(json);
						PrintEmail.create(printEmailRequest, function(err, newRequest) {
							if (err) {
								console.log(err);
								return next(err);
							}
							res.status(200);
							res.send(newRequest);
						});
					}); */
				});

			} else {
				res.send({
					error : "Error: Adopter not found or Adopter email address not available. Please try again."
				});
			}

		}).catch((err) => {
			if (err) {
				console.log(err);
				return next(err);
			}
		});
	});
};

exports.preview = function(req, res, next) {

	var reqId = req.params.id;
	PrintEmail.findById(reqId).then((req) => {
		res.status(200);
		res.send(req.html);
	}).catch((err)=>{
		if (err) {
			console.log(err);
			return next(err);
		}
	});
};