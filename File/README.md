# Usage

var myFile = new File();
myFile.method()

The class contains a few useful variables:-

1. folder - A string with the current folder location
2. file - The name of the file along with the extension
3. currentRow - If you are iterating over a file using read, you can access the current Row using this variable
4. values - An array containing values of a row that can either be saved or are retrieved from a file.

# Methods

## Selecting a file

### 1. set(folder,file)
After created a file Object, you can programatically set the folder name as well as the file using this command.
Example: -
var myFile = new File();
myFile.set("D:/demo","data.csv");

### 2. upload(message,hasHeaders)
Open up the input file dialog box that allows the user to select a file.
message -> The message that you want to display to the user
hasHeaders -> set it to true or false. If the selected file has headers. the headers variable will be populated and the program will start reading from the 2nd line.

### 3. selectFolder(message)
If you want to take a user input for only the folder, you can use this method.
message -> The message that you want to display to the user.

Note: - You can even set the folder and file variables instead of using the functions as such: -
myFile.folder ="D:/demo";
myFile.file="data.csv";

## Reading a file

### 4. read(rowNumber)
To read a row from a file that has been set, use this method.
If you provide a row number, only that row number will be read.
If nothing is specified, the currentRow variable will be used as the current Row and updated automatically. This will allows you to loop through the file.

The read values are returned by the function and are also set in the values variable.

Example: -

var myFile = new File();
myFile.set("D:/demo","data.csv");

var temp = myFile.read(4)  // This will read the 4th row of the csv file and return those values as an array

//  Loop through all records of a csv
while(myFile.read())
  alert(myFile.values);

### 5. readFull()
This methods opens a new tab, loads the file and dumps the entire content in the values folder. This method is useful if you are reading a text file.


## Other Methods

1. install()
4. readTotalColumns()
6. getContents()
7. readFull()
8. write(data)
9. writeRaw(data)
10. remove()
12. screenshot()
13. getPreferences()
14. save()
15. push(value)
16. loadPreferences()
17. loadList()
18. screenshotElement(type,attr,pos)
19. run()
