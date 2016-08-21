---
author: geofrizz
comments: true
date: 2016-02-03 19:49:49+00:00
layout: post
link: https://maplesotho.wordpress.com/2016/02/03/how-to-check-the-data/
slug: how-to-check-the-data
title: How to check the data
wordpress_id: 1114
---

This is an important step for establishing if all the editing and tagging is orthodox, and also if these data are standard, or variations are occurring with tagging in particular.

There are more tools on-line that can enable various types of checks. However, I like the use of tools directly on my computer and also in local is possible to use different methods; the more simple is the use of the compress file with extension ".pbf" that contains all the data of OSM with the extract tool "osmosis".

Every object in the map present one or more tags consisting of two parts one "key" with the corresponding "value" example "building=yes", "building" is the key and "yes" is the value.
From the data file is possible extract  a group of objects with the same tag, for example all the objects tagged as "building", or indeed it is also possible to extract all the object with a specific kind of building ex. "building=house". The output will be a file that can be read directly by the JOSM editor.

The first question is: "Where is possible to find the file with data ??". GeoFabrik's site in the folder download/africa [Lesotho](http://download.geofabrik.de/africa/lesotho.html) makes it possible to find every day an updated file with all the data of #MapLesotho. ![GeoFabrik_-_2016-02-02_22.42.23](https://maplesotho.files.wordpress.com/2016/02/geofabrik_-_2016-02-02_22-42-23.png)
About osmosis it's possible to find information on [OSM wiki](http://wiki.openstreetmap.org/wiki/Osmosis) and also the link for the download; it's written in java and can work in different operating systems. The command can be executed in a "terminal" windows.

The syntax is simple:

    
    /path/where/is/command/osmosis-latest/bin/osmosis \
    --read-pbf file=/path/where/is/data/lesotho-latest.osm.pbf \
    --tag-filter accept-ways building=house \
    --used-node \
    --write-xml file="/path/where/put/output/osmosis_buildings_house_pbf.osm"
    


This command export all the data with the tag "building=house" in the bounding box that contains the country of Lesotho; it's possible to limit the area with a different extension of a bounding box or with a polygon. For a bounding box the command must change to:

    
    /path/where/is/command/osmosis-latest/bin/osmosis \
    --read-pbf file=/path/where/is/data/lesotho-latest.osm.pbf \
    --bounding-box left="28.00000" right="29.0000" top="-29.00000" bottom="-30.0000" \
    --tag-filter accept-ways building=house \
    --used-node \
    --write-xml file="/path/where/put/output/osmosis_buildings_house_bbox_pbf.osm"
    


Where left, right, top and bottom are the coordinates of edges of the bounding box.
For the polygon it's possible, for example, to find and download the border of each district on-line [osm.wno-edv-service.de](https://osm.wno-edv-service.de/boundaries/) ![OSM_Boundaries_3.7_-_2016-02-02_23.54.05](https://maplesotho.files.wordpress.com/2016/02/osm_boundaries_3-7_-_2016-02-02_23-54-05.png)The command change in:

    
    /path/where/is/command/osmosis-latest/bin/osmosis \
    --read-pbf file=/path/where/is/data/lesotho-latest.osm.pbf \
    --bounding-polygon file="/path/where/is/polygon/Mafeteng District.poly" \
    --tag-filter accept-ways building=house \
    --used-node \
    --write-xml file="/path/where/put/output/osmosis_buildings_house_Mafeteng_pbf.osm"
    


Now it's possible to open the output file with JOSM and correct/modify/add tags and/or object.

This method allow to quickly correct any systematic errors that one or more mapper have entered but not any blunder such as for example a misspelling for the key (ex. bulding and not building) for which, I think, the best choice is the use of a database that allows more flexibility for search not only values but also the keys.****

This is a useful tool that fits well with the strategy we are following to #MapLesotho. As many standard building tags as possible allow us to set local tagging protocols and further define the buildings using field papers and mapillary for example.
