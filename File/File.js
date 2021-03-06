/**
 * Working with files in iMacros
 * @constructor
 * @param {string} folder  - The complete path of the file
 */

var IFile = function(path)
{
	/**New String Prototype function to add <SP> to strings */
	String.prototype.addSP = new Function('return this.replace(/ /g,"<SP>");');

	/**@type {string} Path separator. \ for windows and / for other OS*/
	this.separator = window.navigator.oscpu.indexOf('Window')>=0?'\\':'/';

	/**@type {string} Complete Path of a folder. Set the {{!DATASOURCE}} by default*/
	this.folder=path?path.substring(0,path.lastIndexOf(this.separator)).addSP():"{{!DATASOURCE}}";

	/**@type {string} Name of the file with extension*/
	this.file=path?path.substring(path.lastIndexOf(this.separator)+1).addSP():"";

	/**@type {number} Variable that indicates the row number to be read in the file*/
	this.currentRow=1;

	/**@type {string} Variable that stores the code string for execution*/
	this.code="";

	/**@type {number} Variable that indicates the total rows in a file (Auto)*/
	this.totalColumns=0;

	/**@type {Array} An array to store all values read from a file*/
	this.values=[]

	/**Sets the path of the folder replacing spaces with <SP>
	 * @param {string} folder - Full path of the folder 
	 */
	this.setFolder = (folder)=>{this.folder=folder.addSP();};


	/**Sets the name of the file replacing spaces with <SP>
	 * @param {string} file - Name of the file with extension 
	 */
	this.setFile = (file)=>{this.file=file.addSP();};


	/**Sets the folder and file variables replacing spaces with <SP> 
	 * @param {string} path - Full path of the file including file name and extension
	 */
	this.setPath = (path)=>{
		var breakpoint=path.lastIndexOf(this.separator);
		this.folder = path.substring(0,breakpoint).addSP();
		this.file = path.substring(breakpoint+1).addSP();        
	};


	/**Select a folder from a folder browser 
	 * @param {string} message - (Optional) The message to display to the user
	 * @returns {string|boolean} The path of the folder if uploaded. If not, returns false
	 */
	this.selectFolder = (message)=>{
		message = message?message:"Please select a folder";

		var upload=imns.Dialogs.browseForFolder(message);
		if(upload)
		{
			this.folder=upload.path.addSP();
			return upload.path;
		}
		return false;
	};


	/**Select a file from a file browser 
	 * @param {string} message - (Optional) The message to display to the user
	 * @param {boolean} hasHeaders - (Optional) If a file has headers or not. Used to auto increment the currentRow variable.
	 * @returns {string|boolean} The path of the file if uploaded. If not, returns false
	 */
	this.selectFile = (message,hasHeaders)=>{
		if(!message)
			message = "Please select a file";

		var upload=imns.Dialogs.browseForFileOpen(message);
		if(upload)
		{
			var breakpoint=upload.path.lastIndexOf(this.separator);
			this.folder = upload.path.substring(0,breakpoint).addSP();
			this.file = upload.path.substring(breakpoint+1).addSP();

			if(hasHeaders)
				this.currentRow=2;

			return upload.path;
		}
		return false;
	};

	this.getColSize = ()=>
	{
		let start=1;
		let end=100;
		let mid=0;

		while(start!=end)
		{
			mid = Math.ceil((start+end)/2);
			this.code="CODE:";
			this.code+="SET !DATASOURCE "+this.folder+"\\"+this.file+"\n";
			this.code+="SET !DATASOURCE_LINE 1\n";
			this.code+="SET !EXTRACT {{!COL"+mid+"}}\n";

			if(iimPlay(this.code)==-953)
				end=mid-1;
			else
				start=mid;
		}

		iimPlayCode("WAIT SECONDS=0");
		this.code=null;
		this.totalColumns=start;
	};


	this.read = (rowNumber)=>{
		if(this.totalColumns==0)
			this.getColSize();	
		if(!rowNumber)
			this.currentRow++,rowNumber=this.currentRow; 

		this.code="CODE:SET !DATASOURCE "+this.folder+"\\"+this.file+"\n";
		this.code+="SET !DATASOURCE_LINE "+rowNumber+"\n";

		for(var loop=1;loop<=this.totalColumns;loop++)
			this.code+="ADD !EXTRACT {{!COL"+(loop)+"}}\n";

		if(iimPlay(this.code)<0)
		{
			iimPlayCode("WAIT SECONDS=0");
			this.totalColumns=null;
			return false;
		}

		for(loop=1;loop<=this.totalColumns;loop++)
			this.values[loop-1]=iimGetLastExtract(loop);

		return this.values.slice(0);
	};

	this.write = function(data)
	{
		code="CODE:";
		for(let fileWriteloop=0;fileWriteloop<data.length;fileWriteloop++)
			code+="ADD !EXTRACT \""+data[fileWriteloop]+"\"\n";
		code+="SAVEAS TYPE=EXTRACT FOLDER="+this.folder+" FILE="+this.file+"\n";
		iimPlay(code);
	};
};
