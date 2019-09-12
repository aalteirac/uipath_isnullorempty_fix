var fs = require('fs');
var path = require('path');


//root folder
var rootFolder="C:\\Users\\Anthony\\Documents\\UiPath\\";
//folder names to ignore
var ignoreFolders=["ignored"];
//file extension to include
var includeFiles=[".xaml"];
//search all content in brackets
var searchContentBracket= /(?<=\[)(.*?)(.IsnullOrEmpty\s*\(\))(.*?)(?=\])|(?<=\[)(.*?)(.IsnullOrEmpty)(.*?)(?=\])/gi // 
//search only IsnullOrEmpty.. expression
var searchIsNullExp=/[a-z\u00C0-\u00FF.]+(\.+IsnullOrEmpty\s*\(\))|[a-z\u00C0-\u00FF.]+(\.+IsnullOrEmpty)/gi
//find the variable name
var extractVarName=/[a-z\u00C0-\u00FF.]+(?=\.+IsnullOrEmpty)/gi
//ignore if variable is already "String"
var correctVar=/string/gi;

//global counter
var cpt=0,cptF=0;
//SIMULATION FLAG
var simulate=true;



function walk(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory() && !ignoreFolders.includes(path.basename(file))) {	
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
			if(includeFiles.includes(path.extname(file))) {
			  results.push(file);
			}
			if (!--pending) done(null, results);
		}
      });
    });
  });
};

function searchReplaceFile(regexpFind, fileName) {
    var file = fs.createReadStream(fileName,"utf8");
    var newContent = '';
	var found=false;
    file.on('data', function (chunk) {
		var ck=chunk.toString();
		newContent+=ck;
			
    });
    file.on('end', function () {
		var m=newContent.match(regexpFind);
		if(m){
			//do magic here
			var kF=false;
			m.map((el)=>{
				var exp=el.match(searchIsNullExp)[0];
				var myvar=exp.match(extractVarName)[0];
				if(!myvar.match(correctVar)){
					cpt++;
					kF=true;
					var replace="";
					newContent=newContent.replace(exp, `String.IsNullOrEmpty(${myvar})`);
					var dynReg = "(?<=\\[)(.*?)(String\\.IsnullOrEmpty\\s*\\("+myvar+"\\))(.*?)(?=\\])";
					var adhoc = new RegExp(dynReg,"gi");
					var test=newContent.match(adhoc)[0];
					console.log(fileName+'\t',simulate==true?"SIMULATION":"RUN",'\t'+el+"\t"+test);
					found=true;
				}		
			})
			if(kF==true) cptF++;
		}
		if(found==true && simulate==false)
			fs.writeFile(fileName, newContent, function(err) {
				if (err) {
					return console.log(err);
				}
			});
	});
};

walk(rootFolder,function (err,res){
	for (let j = 0; j < process.argv.length; j++) {
		if(process.argv[j]==="-run")
			simulate=false;
	}
	//now we have our files to potentially modify
	if(err){
		console.log(err);
		system.exit(0);
	}
	console.log("FILE NAME\tRUN TYPE\tFOUND\tREPLACED");
	if(res)
		res.map((path)=>{
			searchReplaceFile(searchContentBracket,path);
		})
		
	process.on('exit', function (){
		console.log(""+cpt, "occurence(s) found in",""+cptF, "file(s)")
	});	
})
