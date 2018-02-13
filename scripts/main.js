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
	     //  var dataObj = JSON.stringify(myArr,null,2);
	     //  document.getElementById("heading").innerHTML = dataObj;
	     /*var len = myArr.output.perfect_length;
	     console.log(len);*/
	       document.getElementById("perlength").innerHTML = "Perfect Document's Length: "+myArr.output.perfect_length;
	       document.getElementById("ylength").innerHTML = "Your Document's Length: "+myArr.output.provided_length;
	       document.getElementById("lenper").innerHTML = "Length Percentage: "+myArr.output.length_ratio+"%";
	       document.getElementById("perkey").innerHTML = "Perfect Document's Keyword: "+myArr.output.perfect_keywords;
	       document.getElementById("ykey").innerHTML = "Your Document's Keyword: "+myArr.output.provided_keywords;
	       document.getElementById("keyper").innerHTML = "Keyword Count Percentage: "+myArr.output.nouns_ratio+"%";
	       document.getElementById("spell").innerHTML = "Spelling Mistakes: "+myArr.output.spelling_mistakes+"%";
	       if(myArr.output.provided_length < 1500 || myArr.output.spelling_mistakes>30 || myArr.output.nouns_ratio < 50)
	       	res=0;
	       if(res == 1)
	       	document.getElementById("result").innerHTML = "Result: Document Accepted";
	       else
	       	document.getElementById("result").innerHTML = "Result: Document Rejected";
	       if(myArr.output.provided_length < 2500 || myArr.output.provided_length > 3500)
	       {
	       	res=2;
	       	rem = "Word Length shoul be optimised. "
	       }	       	
	       if(myArr.output.spelling_mistakes>15)
	       {
	       	res=2;
	       	rem += "Spelling mistakes are prominent"
	       }
	       if(res!=2)
	       	document.getElementById("remarks").innerHTML = "Remarks: Good Documentation.Fulfills all the criterias.Job Well done.";
	       else
	       	document.getElementById("remarks").innerHTML = "Remarks: "+rem+".Kindly improve.";
	    }
	};
}