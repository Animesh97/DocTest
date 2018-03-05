var fs=require("fs");
var natural=require("natural");
var path=require("path");

var tokenizer = new natural.WordTokenizer();

var token,index=0,spellMist;
var length=[],noun=[],verb=[],adverb=[],dictionary=[];

let calcParametre=function(url){
	return new Promise(function(resolve,reject){
		var data=fs.readFileSync(url,"utf8");		//Read file using node fs
		token=tokenizer.tokenize(data);				//Tokenize file data
		length[index]=token.length;					//Calculating word length
		var nn=0,vb=0,adv=0;
		//Starting POS Tagger Area
		var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
		var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
		var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
		var defaultCategory = 'N';		
		var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
		var rules = new natural.RuleSet(rulesFilename);
		var tagger = new natural.BrillPOSTagger(lexicon, rules);
		var pos=tagger.tag(token);
		for(i=0;i<pos.length;i++)
		{
			let word=pos[i];
			//Checking For Nouns
			if(word[1]=="NN" || word[1]=="NNS" || word[1]=="NNP" || word[1]=="NNPS")		
				nn++;
			//Checking for Verbs
			else if(word[1]=="VB" || word[1]=="VBD" || word[1]=="VBG" || word[1]=="VBN" || word[1]=="VBP" || word[1]=="VBZ")
				vb++;
			//Checking for Adverbs
			else if(word[1]=="RB" || word[1]=="RBR" || word[1]=="RBS")
				adv+=1;
		}
		noun[index]=nn;
		verb[index]=vb;
		adverb[index]=adv;
		console.log("Nouns: "+noun[index]);
		resolve();
	});
};
var dictionaryToken = function(url,file){
	return new Promise(function(resolve,reject){
		var data=fs.readFileSync(url,"utf8");
		var dict=tokenizer.tokenize(data);		//Tokenized Dictionary for spell checking
		var fdata=fs.readFileSync(file,"utf8");
		var arr=tokenizer.tokenize(fdata);
		dictionary=dict.concat(arr);			//Concatinating dictionary and perfect document tokens
		resolve();
	});
};
var spellCheck = function(){					//Function for performing spell check
	var wrong=0;
	var spellcheck = new natural.Spellcheck(dictionary);
	token.map(function(word){
		if(!spellcheck.isCorrect(word))
		{
			wrong += 1;
		}
	});
	spellMist = (wrong/token.length)*100;
};
var objectCreate = function(){				//Creating JSON Object
	obj={
			output : {
			perfect_length : length[0],
			provided_length : length[1],
			length_ratio : length[1]/length[0]*100,
			perfect_nouns : noun[0],
			provided_nouns : noun[1],
			nouns_ratio : noun[1]/noun[0]*100,
			perfect_verbs : verb[0],
			provided_verbs : verb[1],
			verb_ratio : verb[1]/verb[0]*100,
			perfect_adverbs : adverb[0],
			provided_adverbs : adverb[1],
			adverb_ratio : adverb[1]/adverb[0]*100,
			spelling_mistakes : spellMist
		}
	}
	let json = JSON.stringify(obj,null,2);		//Writing it to file
	console.log(json);
	fs.writeFile("JSONobject.json",json,"utf8",(err)=>{
		if(err)
			console.log(err);
		else
		{
			console.log("Success in writing JSON");
		}

	})
};


calcParametre("perfectDocument.txt").then(function(){		//Function Call for reading Perfect Document
	index++;									//Index is 0 for perfect document and 1 for our document
	return calcParametre("sampleDocument.txt");			//Reading the document to be tested
}).then(function(){
	index++;
	return dictionaryToken("../dictionary.txt","perfectDocument.txt");
}).then(function(){
	console.log("Calling Spellcheck");
	return spellCheck();
}).then(function(){
	return objectCreate();
}).catch(function(error){
	console.log(error);
})