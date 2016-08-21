---
author: rusty1052
comments: true
date: 2016-02-18 12:07:17+00:00
layout: post
link: https://maplesotho.wordpress.com/2016/02/18/analysing-osm-data-for-planning-purposes-not-so-easy/
slug: analysing-osm-data-for-planning-purposes-not-so-easy
title: Analysing OSM data for planning purposes - not so easy
wordpress_id: 1687
categories:
- Progress
tags:
- OSM
- osm2pgsql
- postgis
---

It’s just so easy to add new features and edit those existing on **openstreetmap** with it’s impressive number of tools including iD and JOSM. Little know though is the vast array of little tools which have been created for extracting and working with that wonderful open geo data.




This last week has been eye opening for me once again, I have been working with a small group of assistant physical planners on how we get hold of an extract of OSM for Lesotho, how do we load this into our chosen GIS tool (postGIS) and finally what sorts of exploratory analysis is possible.




Thanks to the lovely folks at **geofabrik** we have a daily Lesotho OSM extract. It takes the form of an osm.pbf file.




It was a week of new experiences for all the APPs, they had for one never touched the command line before. Something you really need to know if you want to use **osm2pgsql** to get your pbf file into your database.




Each day they will download the **lesotho-latest.osm.pbf** file from [geofabrik](http://download.geofabrik.de/africa/lesotho.html) and open up the command line to run the following:




    
    osm2pgsql -c -d lesotho0902 -U colinbroderick -H localhost --hstore  --slim --number-processes 10 --extra-attributes -C 10000 1602-lesotho-latest.osm.pbf




This creates at least 3 database tables one for each of the geometry types present in OSM:






	
  * planet_osm_point

	
  * planet_osm_line

	
  * planet_osm_polygon




![Screen Shot 2016-02-18 at 10.48.29](https://maplesotho.files.wordpress.com/2016/02/screen-shot-2016-02-18-at-10-48-29.png)




We are now able to easily perform some high level spatial analysis using the data in each of these tables.




Have you used the command line before? It’s not so easy to get started with right? After a rocky start all our guys are flying along with it now, it’s no longer scary! They are updating the database everyday!




![IMG_1259.JPG](https://maplesotho.files.wordpress.com/2016/02/img_1259.jpg)




We chose to take on the challenge of training the APP’s to use PostGIS for their analysis as it we felt it was the most performant for them to work between periods of online connectivity.




**Watch out for some details of the spatial analysis that will be falling out of these five newly trained spatial analysts!**




**Find out more on how you can get your own Lesotho database [on our analysis wiki](https://github.com/rustyb/lesotho_manual/wiki/Using-osm-with-postgis---importing-data)**
