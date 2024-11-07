
```dataview
TABLE sum(rows.Length) as "Total Time of Complete Playlists"
FROM #type/playlist and #status/complete
WHERE Length != null
GROUP BY View
```

```dataview
TABLE Length, Tags
FROM #type/playlist and #status/complete
SORT Length DESC
```
