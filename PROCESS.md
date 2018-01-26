# mon 15:
Done:
- Line graph now shows a line
- Decided to give up on Bootstrap bug (see line 38 for comments)

To do:
- Add legends (friday)
- Make x axis pretty and readable

# Tue 16:
Done:
- Beginnings to pie and bar charts

To do:
- Somehow find a better way to escape asynchronicity (JQuery instead of d3.queue??)
- Fix whatever bugs are left in pie chart

# Wed 17:
Done:
- Found and fixed the issue that broke my line chart
- Found and fixed the asynchronicity issue (by moving a bracket :/)
- Made pie chart even though it's ugly
- Made bar chart except for actual bars

To do:
- Put bars in bar chart

# Thu 18:
Done:
- Took 6 hrs to get home

To do:
- Everything I planned to do

# Fri 19:
Done:
- Made all visualisations work under the hood

To do:
- Make table appear

# Mon 22:
Current issues:
- Selecting month via line chart is counterintuitive, should use dropdown or slider instead
- Text in pie charts is ugly, should fix with tooltip
- dropdown function has a lot of repetition (purely stylistic)
- Pie charts won't update (bar + table not tested)

Fixed issues:
- None of the graphs have legends yet: Opted to only make legend for bar chart, as I felt like the other graphs didn't need one (maybe pie chart but in a different format than the traditional legend)
- x axis on line chart should display months, but doesn't yet: x axis now displays months
- Table won't appear (but probably works under the hood): Changed svg to div, since tables are html, not d3. Still ugly
- Cannot listen for bootstrap dropdown click event, meaning I can't update the data: Can now select ranking weight, just have to update data now
- dropdown cannot access data from dataLoaded, meaning graphs cannot be updated: Graphs can now be properly updated (but pie charts don't work yet)

Done: 
- Made github pages
- Added colors to bar chart corresponding to matchup vs. Landorus-T so it's easy to understand

# Tue 23:
Current issues:
- Text in pie charts is ugly, should fix with tooltip + legend of some sort
- Not all files have headers
- Loadcharts doesn't load all charts yet, as not all data are there
- Table listing moves/items under pie charts are broken

Fixed issues:
- Pie charts won't update (bar + table not tested): passed correct arguments upon dropdown selection, now works
- dropdown function has a lot of repetition (purely stylistic): fixed by adding loadcharts function
- Selecting month via line chart is counterintuitive, should use dropdown or slider instead: fixed by adding slider


Done:
- Added loadCharts function so that both dropdown and slider can access it to load the correct charts

# Wed 24:
Current functional issues:
- Loadcharts doesn't load all charts yet, as not all data are there
- There is no interactivity between the pie charts and the tables under them
- The tooltip on the pie charts do not follow the mouse

Current stylistic issues:
- Move and item data is formatted differently than Metagame data, meaning I can't use the same function for both tables
- pieTable function is ugly as hell
- New tooltips get created every time the slider is used
- Not all files have headers

Fixed issues:
- Tables duplicate when updated: identified the right elements to delete upon calling table function
- Text in pie charts is ugly, should fix with tooltip + legend of some sort: added tooltip + table, but there is little interactivity
- Table listing moves/items under pie charts are broken: they work, but there is little interactivity

Added:
- meta_data_1500 dataset
- Loadtable function now also loads metagame data

# Thu 25:
Current functional issues:
- The tooltip on the pie charts do not follow the mouse

Current stylistic issues:
- Move and item data is formatted differently than Metagame data, meaning I can't use the same function for both tables
- pieTable function is ugly as hell
- New tooltips get created every time the slider is used
- Not all files have headers

Fixed issues:
- Loadcharts doesn't load all charts yet, as not all data are there: added all data
- Giving table elements an id based on their contents doesn't work, since two charts have "other": Now use classes based on the value e.g. "Choice Scarf"

# Fri 26:
Current issues:
- The tooltip on the pie charts do not follow the mouse
- Data is hard to view/analyse for non-pokemon players (not my target audience, but still)

Current stylistic issues:
- See Thu 25

Fixed issues:
- There is no interactivity between the pie charts and the tables under them: item now highlights corresponding item in pie/table on hover
