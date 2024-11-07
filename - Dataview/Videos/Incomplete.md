
```dataview
TABLE sum(rows.Length) as "Total Time of Incomplete Playlists"
FROM #type/playlist and #status/incomplete 
WHERE Length != null
GROUP BY View
```

```dataview
TABLE Length
FROM #type/playlist and #status/incomplete
SORT Length DESC
```
