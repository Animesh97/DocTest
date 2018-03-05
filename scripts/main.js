function getData()
{
	var xhttp = new XMLHttpRequest();
	var url = "http://localhost:3000/db";
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onreadystatechange = function() 
	{
	    if (this.readyState == 4 && this.status == 200) 
	    {
	       var myArr = JSON.parse(this.responseText);
	       let res = 1 , rem = " ";

	       /*DOM elements which displays the result on the index page*/

	       document.getElementById("perlength").innerHTML = "Perfect Document's Length: "+myArr.output.perfect_length;
	       document.getElementById("ylength").innerHTML = "Your Document's Length: "+myArr.output.provided_length;
	       document.getElementById("lenper").innerHTML = "Length Percentage: "+myArr.output.length_ratio+"%";
	       document.getElementById("perkey").innerHTML = "Perfect Document's Noun: "+myArr.output.perfect_nouns;
	       document.getElementById("ykey").innerHTML = "Your Document's Noun: "+myArr.output.provided_nouns;
	       document.getElementById("keyper").innerHTML = "Noun Count Percentage: "+myArr.output.nouns_ratio+"%";
	       document.getElementById("perverb").innerHTML = "Perfect Document's Verb Count: "+myArr.output.perfect_verbs;
	       document.getElementById("yverb").innerHTML = "Your Document's Verb Count: "+myArr.output.provided_verbs;
	       document.getElementById("verbper").innerHTML = "Verb Count Percentage: "+myArr.output.verb_ratio+"%";
	       document.getElementById("peradverb").innerHTML = "Perfect Document's Adverb Count: "+myArr.output.perfect_adverbs;
	       document.getElementById("yadverb").innerHTML = "Your Document's Adverb Count: "+myArr.output.provided_adverbs;
	       document.getElementById("adverbper").innerHTML = "Adverb Count Percentage: "+myArr.output.adverb_ratio+"%";
	       document.getElementById("spell").innerHTML = "Spelling Mistakes: "+myArr.output.spelling_mistakes+"%";
	       
	       /*Generating result on the basis of parametres generated*/

	       if(myArr.output.provided_length < 1500 || myArr.output.spelling_mistakes>30 || myArr.output.nouns_ratio < 50)
	       	res=0;
	       if(res == 1)
	       	document.getElementById("result").innerHTML = "Result: Document Accepted";
	       else
	       	document.getElementById("result").innerHTML = "Result: Document Rejected";

	       /*Generating the remarks on the basis of the threshold values decided*/

	       if(myArr.output.provided_length < 2500 || myArr.output.provided_length > 3500)
	       {
	       	res=2;
	       	rem = "<br>Word Length shoul be optimised. "
	       }
	       if(myArr.output.nouns_ratio < 50)
	       {
	       	res=2;
	       	rem += "<br>Keywords count is not optimum. "
	       }
	       if(myArr.output.verb_ratio < 50)
	       {
	       	res=2;
	       	rem += "<br>Verb count is not optimum. "
	       }
	       if(myArr.output.adverb_ratio < 50)
	       {
	       	res=2;
	       	rem += "<br>Adverb count is not optimum. "
	       }	       	
	       if(myArr.output.spelling_mistakes>15)
	       {
	       	res=2;
	       	rem += "<br>Spelling mistakes are prominent"
	       }

	       /*Displaying Remarks on DOM*/

	       if(res!=2)
	       	document.getElementById("remarks").innerHTML = "Remarks: Good Documentation.Fulfills all the criterias.Job Well done.";
	       else
	       	document.getElementById("remarks").innerHTML = "Remarks:<br> "+rem+"<br>Kindly improve.";
	    }
	};
}