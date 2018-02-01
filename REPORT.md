# Description

Visualisation about Landorus-Therian in the official Pokemon ruleset in 2015.
![](doc/screenshot.jpg)
N.B. The screenshot does not capture the entire website.

# Technical design

## Upon loading the page

After declaring global variables, which are used so that they can be used throughout the entire code without having to pass them as arguments from function to function, the window.onload function loads all datasets and calls dataLoaded once it's done. There are no other functions that run upon loading the page.

dataLoaded intialises the entire website, filling the global variables, loading all charts and calling the functions for interactive elements.

## Charts

loadCharts does what its name implies: it loads all charts picking the right data to put in the charts with the weight (for ranking weight) and selectedMonth.

lineGraph only takes one argument, as it shows all months.

pieChart gets called twice withing loadCharts, as there are two pies on the page (pie1 and pie2), showing item and move usage on Landorus for the selected ranking weight in the selected month. It needs the 1 and 2 so that the tooltip (more on that later) and the table below the pies do not get confused which elements are being hovered over. pieChart calls pieTable, which displays the replacements for legends below the pie chart. pieTable calls the capitalize function do make the table headers pretty.

barChart creates a bar chart (duh) for the selected month and ranking weight. It calls function countTypes to determine the height of the bars, and the function pickColor to determine the color of the bars.

usageTable is the final visualisation. It shows the top 20 most used pokemon in the selected month, with data being weighted by ranking. It doesn't call any other functions.

## interactivity

These three functions are initialised in dataLoaded.

dropdown listens for a click in the dropdown menu which is located in the navbar. If it detects a click, it checks wheter the ranking weight needs to be updated. If so, it updates the current ranking weight and calls loadCharts, which updates all graphs on the page.

slider listens for a change in its value (i.e. selected month). When it detects a change, it calls loadCharts, updating all charts to represent the selected month.

# Challenges

One of the biggest problems design wise were the pie charts, which looked cluttered with the legend and/or text. I solved it by adding interactive tables under the pie charts, which highlight the corresponding pie piece on hover. This interactive element also solved another one of my problems. The guidelines specifie that there have to be two interactive elements, of which one has to be interactive within a graph. My original project proposal stated that the user would be able to click on a month in the line chart, updating all other graphs for that specific month. However, this feature proved to be highly counterintuitive, so I decided to add a slider for month selection instead. This was still within the guidelines because the pie charts are now interactive.

# Ideal world

The biggest problem my project faces at the moment is that it is not really clear what the ranking weight actually does. I have provided a short explanation as well as a link to a forum post in which Antar (the guy who collected the data), but the forum post is hard to navigate as it also talks about other concepts within the Pokemon community.

If I had more time I would add tooltips in the bar chart telling the user which pokemon of that type are used in the top 20 (i.e. "ground" onhover would show Landorus-Therian and Garchomp). The pie chart could also be improved by adding more detailed info about the items and moves it includes for less knowledgable players.