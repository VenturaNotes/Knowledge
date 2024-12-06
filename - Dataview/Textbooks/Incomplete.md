```dataview
TABLE sum(number(rows.Length)) as "Total Pages of Incomplete TextBooks", round(sum(number(rows.Progress))/sum(number(rows.Length))*100, 2) + "%" as "Progress"
FROM #type/textbook and #status/incomplete
Group by View
```

- WHERE Length != null and Progress != null
	- Command helps to always work (doesn't choose files with broken syntax)
- number()
	- This function converts any string to a number

```dataview
TABLE number(Length), round((number(Progress)/number(Length))*100,2) + "%" as Progress
FROM #type/textbook  and #status/incomplete and !#temp
SORT round((number(Progress)/number(Length))*100,2) DESC
```