---
Source:
  - https://www.youtube.com/watch?v=3fI_pWcH_CY
Reviewed: false
---
- With block will help you save lots of time
- Making another sub procedure
```VBA
Sub with_block()

Range("a1:a10") = "tutorials"

With Range("a1:a10").font
        .Name = "arial"
    
        .Bold = True
        .Bold = False
    
        .Italic = True
        .Italic = False
    
        .Size = 10
        .Size = 20
    End With
    
End Sub
```
- Need to indent twice for `with` block
- Solves problem from last video of needing to retype all the `Range("a1:a10").font` part
Result
![[Screenshot 2025-01-25 at 3.48.45 AM.png]]