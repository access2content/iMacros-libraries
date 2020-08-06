# Basic Info

The variables used by the function are: -  

1. folder - Complete Path of a folder. Set the {{!DATASOURCE}} by default*/
2. file - Name of the file with extension
3. currentRow - Variable that indicates the row number to be read in the file

# Methods

## Setting a file path
The following methods allow you to set/edit the folder and file path. You can set and edit them individually or at once.
You can use the default constructor to set the folder as well as file variables by giving the path to the file.

### setFolder(folder)
Sets the path of the folder replacing spaces with <SP>. Takes the path of the folder as input.

### setFile(file)
Sets the name of the file replacing spaces with <SP>. Takes the name of the file with extension as input.
  
### setPath(path)
Sets the folder and file variables replacing spaces with <SP>. Takes the full path of the file as input.
  
### selectFolder(message)
Allows the user to manually select a folder from a folder browser. Takes an optional message argument to display to the user.

### selectFile(message,hasHeaders)
Allows the user to manually select a file from a file browser . Takes an optional message and hasHeader as argument.
If hasHeader is set to true, the file will be read from the 2nd row.
