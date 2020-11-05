# Hellometer-Demo

Thank you for checking out my Hellometer demo code! This readme will quickly walk through: 
- [Submission Format](#submission-format)
- How to "run" yourself (#open-the-dashboard)
- How the code is structured
- Parting Thoughts

## Submission Format
For the main product I decided to go with a web-app style dashboard. To keep it exceedingly simple and ensure 
that anyone would be able to quickly open it and paly around, it is *pure front-end* HTML, CSS, JS based, i.e., there 
is no server of any kinds (no Node.js, no flask, no Django) required. This is limiting in that I can't use nice
data processing packages that we find in Python, and I am forced to deal with the data all at once (as a browser
isn't allowed to directly read and write files), so this is about as much data as I could handle without needing
to get clever with the visualizations (start thinking about Canvas) or chunk the data with a server. 

![Dashboard](Assets/full_dashboard.png)

While the dashboard is the main submission. I did also quickly toss together a Jupyter Notebook to take a look at the 
data before I got started. I also used it to convert the data from a csv file to a JSON and save it in a .js file
so I could just load it into the dashboard. 

## Open the Dashboard
