# iMacros-libraries
Javascript libraries for making working with iMacros a breeze!  
This repository is created with the aim of helping iMacros development easier using JavaScript.

# Adding a library to your project
To use a library in your project, copy and paste the following code.  

```javascript
var libraryURL="https://cdn.jsdelivr.net/gh/access2content/iMacros-libraries/File/File.js";

const XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1");
var getLibrary= XMLHttpRequest();
getLibrary.open('GET',libraryURL,false);
getLibrary.send();
eval.apply(window,[getLibrary.response]);
```
Be sure to replace the "libraryURL" variable to the correct URL given below in the list.  

# CDN for libraries

## [File.js](File)
https://cdn.jsdelivr.net/gh/access2content/iMacros-libraries/File/File.js
