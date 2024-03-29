# UiPath Refactor: IsNullOrEmpty

## Goal
If you migrated from older version to  2018.2.2 or newer, chances to face an issue with the following function "IsNullOrEmpty"

Some projects use <variable_name>.IsNullOrEmpty instead of using String static: String.IsNullOrEmpty(<variable_name>)

see: https://docs.uipath.com/releasenotes/docs/2018-2-2#section-studio

## Example

Wrong usage, doesn't work starting in 2018.2.2

```myvariable.IsNullOrEmpty```

Correct usage, work in any case:

```String.IsNullOrEmpty(myvariable)```


## Concept
A simple nodejs script:
 * going recursively through a root folder (configurable) 
 * ignoring some folders (configurable)
 * searching for .xaml files (configurable)
 * searching all occurences of bad IsNullOrEmpty usage (configurable)
 * replace by a correct syntax for 2018.2.2 and newer (configurable)


## Getting Started

Install latest nodejs 

Edit index.js to enter your root folder and options.

```
//root folder, where all project to refactor are
var rootFolder="C:\\Users\\Anthony\\Documents\\UiPath\\";
//folder names to ignore
var ignoreFolders=["ignored"];
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
