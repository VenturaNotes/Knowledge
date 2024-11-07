```dataview 
TABLE length(explored) AS "Explored", filter(file.inlinks, (x) => !econtains(explored, x)) AS "Unexplored"
FROM "- Topics/Combination"
SORT explored ASC
```
