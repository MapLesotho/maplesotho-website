---
layout: post
type: post
published: 'true'
title: 'With > 750,000 of them, where all the buildings at?'
categories: 'osm, stats, #MapLesotho'
tags:
  - '#MapLesotho'
  - '#openstreetmap'
author: RustyB
banner: >-
  https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/hexgrid/ml-bulding-densityw.jpg
---

So in this post the first in a series of little real world use cases of MapLesotho data, we're going to be mapping building density in Lesotho.

For those not in the know that means we're going to split lesotho into little parcels of a fixed size and then count the number of buildings within each parcel.

## Assumptions

We will make the following assumptions if you're following along, that you've got:

- a postgres database with postgis loaded.
- an export of Lesotho loaded in with `osm2pgsql`

The first thing we're going to do is create a hexgon grid to cover the land area of Lesotho. Although we can do this in QGIS i'm going to show you how to easily create one in PostGIS.

Thankfully CartoDB has already made a super handy function for use to create on of these grid. You should run the code below in your osm database to add the `CDB_HexagonGrid()` function.

[Source](https://github.com/CartoDB/cartodb-postgresql/blob/master/scripts-available/CDB_Hexagon.sql) [Copy from this gist](https://gist.github.com/rustyb/a9e266f1c3e96d0812609b5874c26322#file-cartodb-hexagon-grid-function-sql)

Now we shall make our hexagon grid table and make one that matches the are of Lesotho.

{% highlight sql %}
-- create our hexgrid table
DROP TABLE IF EXISTS hexgrid;
CREATE TABLE hexgrid (
  gid             SERIAL PRIMARY KEY,
  cell           geometry NOT NULL
);

-- add the cells to the grid using lesotho admin boundary
insert into hexgrid(way)
  WITH
 geo as (select way from planet_osm_polygon where osm_id = -2093234),
 grid AS ( SELECT CDB_HexagonGrid(ST_Envelope(geo.way), 2000) AS cell from geo)
SELECT way from grid

{% endhighlight %}

And the result:

![](https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/hexgrid/hexgrid.jpg)

## Building Density per grid cell

So next we're going to do a little prepartory work to make our queries work a little faster when querying the buildings of Lesotho. There are > 750,000 building in case you didn't know.

First we will create a new table containing only buildings. You'll notice we're transforming our geomtetry, this is to allow us to take advantage of geography queries in later posts. We also get the centre point of the each polygon.

{% highlight sql %}

-- get all the buildings into one table
DROP TABLE IF EXISTS buildings;
CREATE TABLE buildings as (
SELECT osm_id, tags, way_area, ST_Transform(way,4326) as way, ST_Centroid(way) as centroid
FROM planet_osm_polygon where building IS NOT NULL
);
{% endhighlight %}

Now to help our queries run much faster, we will create some spatial indexs on the geometry and osm_id columns. This may take a few minutes to run through.

{% highlight sql %}

-- WE NEED TO MAKE THESE INDEXS SO THINGS RUN FASTER
CREATE INDEX buildings_index
  ON public.buildings
  USING gist
  (way);

CREATE INDEX buildings_centroid_index
  ON public.buildings
  USING gist
  (centroid);

CREATE INDEX buildings_pkey
  ON public.buildings
  USING btree
  (osm_id);
{% endhighlight %}

Here's a quick image of the buildings and their center points.

![center points](https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/hexgrid/buildings.jpg)

Now onto the fancy part we're going to use some spatial joins to count how many centroid points are within each hexagon. Running the query below will add a now column to the hexgrid table for the building count.

{% highlight sql %}

ALTER TABLE hexgrid ADD COLUMN agg_building float; --Add a column to the hexagon table
UPDATE hexgrid SET agg_building = 0.0; --Initialize that column to a count of zero
UPDATE hexgrid SET agg_building = temporary_holder.building_count
  FROM
  (
    SELECT
      hexgrid.gid, --Keep the ID for each hexagon to help specify which rows to update
      count( --The aggregation function used in collapsing to just hexagons
          buildings.osm_id --Just a vector of ones meaning yes if building
          ) AS building_count --Give the total a name for easy reference
    FROM
    (
      hexgrid
      INNER JOIN -- Make a new table where each pair of hexagon-gazetteer point is a row
      buildings
      ON ST_Intersects(hexgrid.cell, buildings.centroid) -- Only for pairs that occupy the same space
    )
    GROUP BY hexgrid.gid -- Collapse hexagon-gazetteer point pairs to just hexagons
  ) AS temporary_holder --The placeholder name for the aggregate results
  WHERE hexgrid.gid=temporary_holder.gid --Update rows in the hexagon table with matching id number
{% endhighlight %}

[Original Query - Rex Douglass](http://rexdouglass.com/spatial-hexagon-binning-in-postgis/)

If we bring these layers into QGIS we can then visualise the results:

![](https://s3.eu-central-1.amazonaws.com/ls-sat/blog-images/hexgrid/ml-bulding-densityw.jpg)

You can see that the highest densities are surrounding the major settlements and in the north from Maseru to Bera, to Leribe, and Buthe-Buthe.

**Have an idea another idea of a #MapLesotho question we could answer with this technique, then let me know on twitter [@Rusty1052](https://twitter.com/rusty1052)**
