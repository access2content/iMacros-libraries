const DIV="DIV";
const H1="H1";
const BUTTON="BUTTON";
const SPAN="SPAN";
const A="A";
const SELECT="SELECT";
const INPUT="INPUT";
const IMG="IMG";

let iElement = function(element)
{
    String.prototype.addSP = new Function('return this.replace(/ /g,"<SP>");');
	this.pos=element.pos?element.pos:1;
	this.type=element.type?element.type:DIV;
	this.attr=element.attr?element.attr.addSP().replace("=",":"):"*";
	this.anchor=null;

	this.setAttr = (attr) =>{
		this.attr=attr.addSP().replace("=",":");
	};

	this.setAnchor = (obj) =>{
		this.anchor= obj;
		this.pos="R"+this.pos;
	};

	this.removeAnchor = () =>{
		this.anchor=null;
		this.pos=this.pos.replace("R","");
	};

	this.getAnchors = () =>{
		if(this.anchor)
			return this.anchor.getAnchors()+"TAG POS="+this.pos+" TYPE="+this.type+" ATTR="+this.attr+" EXTRACT=TXT\n";
		else
			return "TAG POS="+this.pos+" TYPE="+this.type+" ATTR="+this.attr+" EXTRACT=TXT\n";
	};

	this.getElement = () =>{
		let element = this.getAnchors();
		element = element.substring(0,element.length-13);
		return element;
	};

	this.click = () =>{
		iimPlayCode(this.getElement());
	};

	this.clickEvent = () =>{
		iimPlayCode("EVENT TYPE=CLICK SELECTOR=\""+this.type+"["+this.attr.replace(":","='").replace(/<SP>/g," ")+"']\" BUTTON=0");
	}	

	this.getText = () =>{
		let element = this.getAnchors();
		iimPlayCode("SET !TIMEOUT_STEP 0\n"+element);
		return iimGetLastExtract((element.match(/EXTRACT/g)||[]).length);
	};

	this.getLink = () =>{
		let element = this.getElement()+" EXTRACT=HREF";
		iimPlayCode("SET !TIMEOUT_STEP 0\n"+element);
		return iimGetLastExtract((element.match(/EXTRACT/g)||[]).length);
	};

	this.getHtml = () =>{
		let element = this.getElement()+" EXTRACT=HTM";
		iimPlayCode("SET !TIMEOUT_STEP 0\n"+element);
		return iimGetLastExtract((element.match(/EXTRACT/g)||[]).length);
	};

	this.getId = () =>{
		let html = this.getHtml();
		let start = html.indexOf(" id=")+5;
		return html.substring(start,html.indexOf("\"",start));
	};

	this.exists = () =>{
		return this.getHtml()!="#EANF#";
	};

	this.found = (maxTime) =>{
		for(i=0;i<maxTime*4;i++)
			if(this.exists())
				return true;
			else
				iimPlayCode("WAIT SECONDS=0.25");
		return false;
	};

	this.put= (value) =>{
		value=value.addSP().replace(/\n/g,"<LF>");
		if(this.type==SELECT)
			value="%"+value.replace(/;/g,":%");
		iimPlayCode(this.getElement()+" CONTENT="+value);
	};

	this.paste = (value) =>{
		value = value.addSP().replace(/\n/g,"<BR>");
		iimPlayCode("SET !CLIPBOARD "+value+"\nEVENT TYPE=KEYPRESS SELECTOR=\""+this.type+"["+this.attr.replace(/<SP>/g," ")+"']\" CHAR=v MODIFIERS=\"ctrl\"");
	};

	this.type = (value) =>{
		value = value.replace(/\n/g,"\\n");
iimPlayCode("EVENTS TYPE=KEYPRESS SELECTOR=\""+this.type+"["+this.attr.replace(":","='").replace(/<SP>/g," ")+"']\" CHARS=\""+value+"\"");
	};

};
