# UiPath Refactor: IsNullOrEmpty

## Goal
If you migrated from 2018.2.x to a newer version, chances to face an issue with the following function "IsNullOrEmpty"

Some projects use <variable_name>.IsNullOrEmpty instead of using String static: String.IsNullOrEmpty(<variable_name>)

## Example

Wrong usage, doesn't work in >2018.2.X

myvariable.IsNullOrEmpty

Correct usage, work in any case:

String.IsNullOrEmpty(myvariable)


## Concept
A simple nodejs script:
 * going recursively through a root folder (configurable) 
 * ignoring some folders (configurable)
 * searching for .xaml file (configurable)
 * searching all occurences of bad IsNullOrEmpty usage (configurable)
 * replace by a correct syntax for > 2018.2.x (configurable)


## Getting Started

Install latest nodejs 

Edit index.js to enter your folder and options.

```
//root folder, where all project to refactor are
var rootFolder="C:\\Users\\Anthony\\Documents\\UiPath\\";
//folder names to ignore
var ignoreFolders=["ignored"];
//file extension to include
var includeFiles=[".xaml"];
//search all content in brackets
var searchContentBracket= /(?<=\[)(.*?)(.IsnullOrEmpty\s*\(\))(.*?)(?=\])|(?<=\[)(.*?)(.IsnullOrEmpty)(.*?)(?=\])/gi // 
```

SIMULATION Launch with console report
```
node index.js
```

SIMULATION Launch with excel report 
```
node index.js > log.xls
```

When ready to really run the replace
```
node index.js > log.xls -run
```

## Sample excel report

![](https://github.com/aalteirac/uipath_isnullorempty_fix/blob/master/Excel.png) 

## Caution
!!! ONLY USE IF PROPER BACKUP HAS BEEN DONE !!!
