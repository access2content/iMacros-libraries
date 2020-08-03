var File = function(folder,file)
{
        this.folder=folder;
        this.file=file;
        this.currentRow=null;
        this.headers=[];
        this.values=[];
        this.totalColumns=null;
        this.temp;
        var code;

        this.install = function()
        {
          var aFile = Components.classes["@mozilla.org/file/local;1"]
          .createInstance(Components.interfaces.nsILocalFile);
          aFile.initWithPath(this.folder+"\\"+this.file);
          iimPlayCode("SET !EXTRACT {{!FOLDER_DATASOURCE}}");
          var folder=iimGetLastExtract().replace("\\iMacros\\Datasources","\\iMacros\\Macros");
          var aDir = Components.classes["@mozilla.org/file/local;1"]
            .createInstance(Components.interfaces.nsILocalFile);  
          aDir.initWithPath(folder);
          aFile.moveTo(aDir,null);
        };
        
        this.upload = function(message,hasHeaders)
        {
                var upload=imns.Dialogs.browseForFileOpen(message);
                if(upload)
                {
                var breakpoint=upload.path.lastIndexOf("\\");
                this.currentRow=0;
                this.folder=upload.path.substring(0,breakpoint).replace(/ /g,"<SP>");
                this.file=upload.path.substring(breakpoint+1,upload.path.length).replace(/ /g,"<SP>");
                this.readTotalColumns();
                
                if(hasHeaders)
                {
                        this.read();
                        this.headers=this.values;
                        this.values=[];
                }
                
                return true;
                }
        return false;
        };
        
        this.selectFolder = function(message)
        {
                        var upload=imns.Dialogs.browseForFolder(message);
                        this.folder=upload.path.replace(/ /g,"<SP>");
          
                        if(upload)
                                return true;
                        return false;
        };
  
        this.readTotalColumns = function()
        {
                var start=1;
                var end=100;
                var mid=0;
                
                while(start!=end)
                {
                        mid = Math.ceil((start+end)/2);
                        code="CODE:";
                        code+="SET !DATASOURCE "+this.folder+"\\"+this.file+"\n";
                        code+="SET !DATASOURCE_LINE 1\n";
                        code+="SET !EXTRACT {{!COL"+mid+"}}\n";
                        
                        if(iimPlay(code)==-953)
                                end=mid-1;
                        else
                                start=mid;
                }

                iimPlayCode("WAIT SECONDS=0");
                
                code=null;
                this.totalColumns=start;
        };
        
        this.read = function(rowNumber)
        {
                if(this.totalColumns==null)
                        this.readTotalColumns();
                        
                if(!rowNumber)
                        this.currentRow++,rowNumber=this.currentRow;
                
                code="CODE:SET !DATASOURCE "+this.folder+"\\"+this.file+"\n";
                code+="SET !DATASOURCE_LINE "+rowNumber+"\n";
        
                for(var loop=1;loop<=this.totalColumns;loop++)
                        code+="ADD !EXTRACT {{!COL"+(loop)+"}}\n";
                
                if(iimPlay(code)<0)
                {
                        iimPlayCode("WAIT SECONDS=0");
                                  this.totalColumns=null;
                        return false;
                }
                
                for(loop=1;loop<=this.totalColumns;loop++)
                this.values[loop-1]=iimGetLastExtract(loop);
                
                return this.values.slice(0);
        };
        
        this.getContents = function()
        {
                var message="";
                for(var row=1;1;row++)
                {
                        for(var col=1;1;col++)
                        {
                                var read=iimPlayCode("SET !DATASOURCE "+this.folder+"\\"+this.file+"\nSET !DATASOURCE_LINE "+row+"\nSET !EXTRACT {{!COL"+col+"}}");
                                if(read==-953)
                                {
                                        iimPlayCode("WAIT SECONDS=0");
                                        message=message.slice(0,-2);
                                        message+="<BR>";
                                        break;
                                }
                                if(read==-951)
                                {
                                        iimPlayCode("WAIT SECONDS=0");
                                        return message;
                                }
                                message+=iimGetLastExtract()+", ";
                        }
                }
        };
        
        this.readFull = function()
        {
          iimPlayCode("TAB OPEN\nTAB T=2\nURL GOTO=file://"+this.folder.replace(/ /g,"<SP>")+"\\"+this.file.replace(/ /g,"<SP>")+"\nTAG POS=1 TYPE=PRE ATTR=* EXTRACT=TXT\nTAB CLOSE");
          this.values=iimGetLastExtract();
          return iimGetLastExtract();
        };
        
        this.write = function(data)
        {
                code="CODE:";
                for(fileWriteloop=0;fileWriteloop<data.length;fileWriteloop++)
                        code+="ADD !EXTRACT \""+data[fileWriteloop]+"\"\n";
                code+="SAVEAS TYPE=EXTRACT FOLDER="+this.folder.replace(/ /g,"<SP>")+" FILE="+this.file+"\n";

                if(iimPlay(code)<0)
                        return false;
                return true;
        };
        
		this.writeRaw = function(data)
		{
			if(this.folder=="{{!FOLDER_DATASOURCE}}")
			{
				iimPlayCode("SET !EXTRACT {{!FOLDER_DATASOURCE}}");
				code = iimGetLastExtract();
			}
			else
				code=this.folder;
			try
			{
				var outputFile = imns.FIO.openNode(code+"\\"+this.file);
                imns.FIO.appendTextFile(outputFile, data);
				return true;
			}
			catch(e)
			{
				return false;
			}
		};        
        
        this.remove = function()
        {
                if(iimPlayCode("SET !DATASOURCE "+this.folder+"\\"+this.file)<0)
                return false;
                if(iimPlayCode("FILEDELETE NAME="+this.folder+"\\"+this.file)<0)
                return false;
                
                return true;
        };
        
        this.set = function(folder,file)
        {
                if(folder)
                this.folder=folder.replace(/ /g,"<SP>");
                if(file)
                this.file=file.replace(/ /g,"<SP>");
        };
        
        this.screenshot = function()
        {
                iimPlayCode("SAVEAS TYPE=JPEG FOLDER="+this.folder+" FILE="+this.file);
        };
  
        this.getPreferences = function()
        {
          iimPlayCode("TAB OPEN\n TAB T=2\nURL GOTO=file://"+this.folder+"\\"+this.file+"\nTAG POS=1 TYPE=PRE ATTR=* EXTRACT=TXT\nTAB CLOSE");
          return JSON.parse(iimGetLastExtract());
        };
                                                                                 
         this.save = function()
         {
                 this.write(this.values);
                 this.values=[];
         };
                
         this.push= function(val)
         {
                 this.values.push(val);
         };                                                                                 
                  
        this.loadPreferences = function()
        {
                const XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1");
                        var fetchData= XMLHttpRequest();
                        fetchData.open('GET',"file://"+this.folder+"/"+this.file,false);
                        fetchData.send();
                        this.values = JSON.parse(fetchData.response);
        };
        
        this.loadList = function()
        {
          const XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1");
          var fetchData= XMLHttpRequest();
          fetchData.open('GET',"file://"+this.folder.replace(/<SP>/g," ")+"\\"+this.file.replace(/<SP>/g," "),false);
          fetchData.send();
          this.values=fetchData.response.replace(/"/g,"").split("\r\n");          
        };
                  
        this.screenshotElement = function(type,attr,pos)
        {
           if(!pos)
              pos=1;
           iimPlayCode("ONDOWNLOAD FOLDER="+this.folder.replace(/ /g,"<SP>")+" FILE="+this.file.replace(/ /g,"<SP>")+"\nTAG POS="+pos+" TYPE="+type+" ATTR="+attr+" CONTENT=EVENT:SAVE_ELEMENT_SCREENSHOT");
        };
        
		this.run = function()
		{
			this.temp = Components.classes["@mozilla.org/file/local;1"]
								 .createInstance(Components.interfaces.nsILocalFile);
								 
			if(this.folder=="{{!FOLDER_DATASOURCE}}")
			{
				iimPlayCode("SET !EXTRACT {{!FOLDER_DATASOURCE}}");
				code = iimGetLastExtract();
			}
			else
				code=this.folder;								 
			
			this.temp.initWithPath(code+"\\"+this.file);
			this.temp.launch();			
         };
}
