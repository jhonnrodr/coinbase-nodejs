var https = require('https'),
	url = require('url'),
	crypto = require('crypto');

var key, secret;	

var coinbase = {};

coinbase.connection = function(APIkey, APIsecret){
	key = APIkey;
	secret = APIsecret;
}

coinbase.createButtons = function(data, callback){

			ops = {
				name: data.name,
				type: data.type,
				price_string: data.price_string,
				price_currency_iso: data.price_currency_iso,
				custom: data.custom,
				description: data.description

			};	

				Post(ops, function(data){
					callback(data);
				});

}



function Post(ops, callback) {

	var uri = url.parse(ops.url);
	var bodyString = '';
	if (ops.json) {
		bodyString = JSON.stringify(ops.json);
	}
	var no = nonce();
	var signature = no + ops.url + bodyString;
	signature = crypto.createHmac('sha256', secret).update(signature).digest('hex');

	var options = {
		hostname: uri.hostname,
		port: 443,
		path: uri.pathname,
		method: 'POST',
		headers: {
			'ACCESS_KEY': key,
			'ACCESS_SIGNATURE': signature,
			'ACCESS_NONCE': no,
			'Content-Type': 'application/json',
			'Connection': 'close'
		}
	};

	var req = https.request(options, function (res) {
		if (res.headers.status == '200 OK') {
			var result = '';
			res.on('data', function (d) {
				result += d;
			});
			res.on('end', function () {
				result = JSON.parse(result);
				callback(null, result);
			});
		} else {
			var err = 'Coinbase error: received header ' + res.headers.status;
			callback(err, null);
		}
	});

	req.write(bodyString);
	req.end();

	req.on('error', function (e) {
		console.error(e);
	});

}

function nonce(){

	var now = String(Date.now() * 1e6);

	return now;
}

module.exports = coinbase;