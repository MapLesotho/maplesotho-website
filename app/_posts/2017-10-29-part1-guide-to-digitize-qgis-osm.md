---
layout: post
type: post
published: 'true'
title: 'Part 1: A guide on how to digitize using QGIS and OSM data'
categories: Training
tags:
  - '#MapLesotho'
  - QGIS
  - Planning
  - OSM
author: fifiqn
banner: https://user-images.githubusercontent.com/17254752/29718803-a5ebb7d6-894f-11e7-8d05-813829a7c8da.png
banner_upload: /assets/graphics/uploads/IMG-20170907-WA0002.jpg
---

Welcome to the first part in my short series on how to digitize using both QGIS and data from OSM. This guide is aimed at spatial planners based in Lesotho, don't be afraid though no matter your background you'll be able to follow along.

**In this first part we're going to get everything we need installed and ready to go.**

## Here is what you will need

*   PgAdmin3 Application
*   Qgis Application
*   osm2ogsql
*   osm data file
*   The style File

## PgAdmin3

![PgAdmin logo](https://user-images.githubusercontent.com/17254752/29927679-c609f17e-8e02-11e7-9f86-2586c5abc4e7.jpg)

### How to install PostgreSQL

Here, you are going to learn how to install PostgreSQL in windows.  

Here are 3 steps to complete the PostgreSQL installation:  

1.  Download PostgreSQL installer for Windows
2.  Install PostgreSQL
3.  Verify the installation

Download the PostgreSQL Installer for Windows  

You need to download the installer [here](http://www.postgresql.org/download/windows/).  

Click on the download installer from EnterpriseDB Choose the latest version to download. It takes few minutes to complete the download.

### How to Install PostgreSQL step by step

Double click on the installer file, an installation wizard will appear and guide you through multiple steps where you can choose different options that you would like to have in PostgreSQL.  

The following illustrates each step and its options for installation. If you have a different version, you may get additional steps.

#### Install PostgreSQL Step 1

![a picture of PgAdmin installation wizard](https://user-images.githubusercontent.com/17254752/29718659-395a695a-894f-11e7-9549-7b47c3db61d9.png)

click next

Specify installation folder, choose your own or keep the default folder suggested by PostgreSQL installer.

#### Install PostgreSQL step 2

![a picture of PgAdmin installation wizard](https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/how-to-guide/Install-PostgreSQL-Step-3-1.png)

<figcaption>Enter the password of your own choice and make sure to remember it.</figcaption>

#### Install PostgreSQL Step 3

![a picture of PgAdmin installation wizard](https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/how-to-guide/Install-PostgreSQL-Step-4-1.png)

<figcaption>Enter the port for PostgreSQL. For some people it may P5433.</figcaption>

#### Install PostgreSQL Step 5

![a picture of PgAdmin installation wizard](https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/how-to-guide/Install-PostgreSQL-Step-5-1.png)

<figcaption>Choose the default locale and Click the Next button to install PostgreSQL</figcaption>



#### Install PostgreSQL Step 7

![a picture of PgAdmin installation wizard](https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/how-to-guide/Install-PostgreSQL-Step-7-1.png)

now you can wait for the installation to run  

#### Install PostgreSQL Step 8

![a picture of PgAdmin installation wizard](https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/how-to-guide/Install-PostgreSQL-Step-8.png)

<figcaption>Click Finish to complete the PostgreSQL installation.</figcaption>



### How to Verify the Installation

This can be done through the pgAdmin application. First, go to your Local Disk C:. Now go to Program FilesX86, navigate the list to find postgresql and doubleclick on it. Open the 9.3 folder. Do the same thing for bin. Now, if you scroll down the list, you will find pgadmin3\. Right click on it, go to create shortcut and click yes to create a desktop shortcut. now go to the desktop and doubleclick on the shortcut you have just created and pgadmin will be launched.

Second,Connect to PostgreSQL Server  

This is done by simply doubleclicking on the server marked with the red x

![a picture of a launched PgAdmin application](https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/how-to-guide/Connect-to-PostgreSQL-Server.jpg)

<figcaption>now it is time to use the password you entered in step2 and check the store password box</figcaption>



Third, if everything is fine, the pgAdmin will display all the objects that belong to the server.

![a picture of a launched PgAdmin application](https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/how-to-guide/PostgreSQL-Objects.jpg)

---

## Quantum GIS (Qgis)

![Qgis logo](https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/how-to-guide/th.jpg)

### How to install Qgis

Here, you learn a step by step the installation of the actual version (2.18) of QGIS.  

First, you need to download the software from [here](http://www.qgis.org/). Double click on the downloaded .exe file to install. Accept the install defaults to complete the process and launch

Congratulation! you’ve successfully installed PostgreSQL database server in your and QGIS PC.

* * *

## osm2pgsql

In the previous article we saw how to set up Postgresql with PostGIS in Windows and how to set up a database and load it with shapefile data. In order to get OpenStreetMap data into a database, you could get the data in shapefile format and use the shapefile loader, but this may leave you without all the data that you want. 

In this chapter we will learn how to use osm2pgsql, a command-line program for loading raw OSM data into a PostGIS database. We will go through the steps to set up osm2pgsql on Windows, though the steps should be roughly the same on another operating system, assuming you have set up your PostGIS database(s) correctly.

### How to get OSM2PGSQL

Osm2pgsql in my opinion is short or Open Street Map to(2) Post GIS Structured Querybased Language. Which means that you are getting raw osm data and loading it into postgis using sql.

Click here to download the windows version of osm2pgsql  

[osm2pgsql](http://wiki.openstreetmap.org/wiki/Osm2pgsql#Windows)  

*   Download the file named osm2pgsql.zip
*   Right click on it and unzip the file on your system
*   You should move the unzipped folder to the osm folder you have created in local disk C
*   In local disk C will be the unzipped file called osm2pgsql.exe

This is a program that we will run to import the data, but in order for Windows to find it, we need to add its location to the system path.

## System Path

### How to Create a System Path

*   Go to the control panel and there, search system path

![A picture showing how to find a system path](https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/how-to-guide/www.pic-ttp1.png)

*   Click on an option called “Edit the system environment variables. That looks like this:

![This picture shows what the edit system environment variables button looks like](https://user-images.githubusercontent.com/17254752/29718729-6f33e6a0-894f-11e7-9327-149df869362f.png)

*   Click on the “Environment Variables” button

![This picture shows the environment variables tab](https://user-images.githubusercontent.com/17254752/29718734-6fd3c27e-894f-11e7-8902-413828d9a0f4.png)

*   Scroll to the bottom and find the variable named “Path”, highlight it and click “Edit…”

![This picture shows where to find the variable path](https://user-images.githubusercontent.com/17254752/29718734-6fd3c27e-894f-11e7-8902-413828d9a0f4.png)

*   This is how you must add the directory where osm2pgsql.exe is located to the end of the Path variable.

Be careful not to erase anything as this will be highlighted

![A picture displaying an edit system variable window](https://user-images.githubusercontent.com/17254752/29718721-6ef26bf8-894f-11e7-8d71-563c3774e1d4.png)

Add a semicolon to the end of the previous directory and then type in the full directory path of osm2pgsql.exe. In our case, since our osm2pgsql extract is in local disk C inside the osm folder, the directory path would be: `;C:\osm\osm2pgsql\x64;` if you are using a 62bit operating system or `;C:\osm\osm2pgsql\x32;` if you are using 32bit operating system
*   Click OK several times to save the new settings

### How to test if osm2pgsql functions

*   Run the Windows Command Prompt as an administrator. You can do this by clicking on the Start Menu and searching “cmd”. The Command Prompt application will come up. You can rightclick on it and run as an administrator

![A picture showing how to find a command prompt application](https://user-images.githubusercontent.com/17254752/29718724-6f0ae75a-894f-11e7-8b3e-d61362bed6a5.png)

In the black command window that opens, type:

`osm2pgsql.exe`

If everything is working right, you should get a message like this:

![A picture of a message expected to be returned by a command](https://user-images.githubusercontent.com/17254752/29718726-6f1bf90a-894f-11e7-98f3-8d3fe1ecbc17.png)

*   If you don’t see an error message like this, and it says that it **cannot** find the application osm2pgsql, then you may have entered the Path variable incorrectly.

---

**That's is we've now got everything setup that we need to start digitizing, see you in Part 2**

You might also like to read my previous article [**Bye Bye Arcgis**](https://www.maplesotho.com/blog/2017/03/16/bye-bye-arcgis/)

*Article by [Refiloe Semethe](http://www.openstreetmap.org/user/fifiQn)*