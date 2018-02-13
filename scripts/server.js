var textract = require("textract");
var Wordpos = require("wordpos");
var natural = require("natural");
var fs = require("fs");

var tokenizer = new natural.WordTokenizer();
wordpos = new Wordpos();

var noun = [];
var length = [];
var spell = [];
var index = 0 , lengthPer , nounPer,token,obj, spellMist;

let readFile = function(url)
{
	return new Promise(function(resolve,reject){
		textract.fromFileWithPath(url,{preserveLineBreaks : true}, function(error,text){
			if(error)
				reject(error);
			else
			{
				//console.log("Inside Promise");
				
				if(index == 2)
				{
					spell = tokenizer.tokenize(text);;
					//console.log(spell);
					resolve();
				}
				else
				{
					token = tokenizer.tokenize(text);
					length[index] = token.length;
					wordpos.getNouns(text,function(res)
					{
						noun[index] = new Set(res);
						console.log("Totla nouns: "+noun[index].size);							
						resolve();
					});
				}				
			}
		});
	});
}

let ratioCalculation = function()
{
	lengthPer = (length[1]/length[0])*100;
	nounPer = (noun[1].size/noun[0].size)*100;
}

let spellCheck = function()
{
	let wrong = 0;
	var spellcheck = new natural.Spellcheck(spell);
	token.map(function(word){
		if(!spellcheck.isCorrect(word))
			wrong += 1;
	});
	spellMist = (wrong/token.length)*100;
}

var objectCreate = function()
{
	obj={
			output : {
			perfect_length : length[0],
			provided_length : length[1],
			length_ratio : lengthPer,
			perfect_keywords : noun[0].size,
			provided_keywords : noun[1].size,
			nouns_ratio : nounPer,
			spelling_mistakes : spellMist
		}
	}
	let json = JSON.stringify(obj,null,2);
	fs.writeFile("object.json",json,"utf8",(err)=>{
		if(err)
			console.log(err);
		else
		{
			console.log("Success in writing JSON");
		}

	})
}


readFile("WebDev.docx").then(function(result){
	console.log("Testing Asynchronous");
	console.log(length[index]);
	index = 1;
	return readFile("Bootstrap.docx");
}).then(function(result){
	console.log("New File");
	console.log(length[index]);
	index = 2;
	return readFile("dictionary.txt");
}).then(function(result){
	ratioCalculation();
	return spellCheck();
}).then(function(){
	console.log("Wrong Words: "+spellMist);
	return objectCreate();
}).then(function(){
	console.log(obj);
}).catch(function(error){
	console.log(error);
});
