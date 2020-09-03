# iMacros-libraries
Javascript libraries for making working with iMacros a breeze!  
This repository is created with the aim of helping iMacros development easier using JavaScript.

# Adding a library to your project
To use a library in your project, copy and paste the following code.  

```javascript
function addLibrary(library)
{
var libraryURL="https://cdn.jsdelivr.net/gh/access2content/iMacros-libraries/"+library+"/"+library+".js";
const XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1");
var getLibrary= XMLHttpRequest();
getLibrary.open('GET',libraryURL,false);
getLibrary.send();
eval.apply(window,[getLibrary.response]);
}
```
Copy and paste the above function in the iMacros js file and specify the library to include in your script. Eg:-

```javascript
addLibrary("iElement");
```
