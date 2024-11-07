```dataview 
TABLE length(explored) AS "Explored", filter(file.inlinks, (x) => !econtains(explored, x)) AS "Unexplored"
FROM "- Topics"
SORT explored ASC
```
37 minutes, 57 seconds