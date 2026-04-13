---
status: done
priority: "2"
dateCreated: 2026-01-30T21:53:29.222-05:00
dateModified: 2026-01-31T11:41:40.455-05:00
reminders:
  - id: rem_1769827989717_jitqqv5xa
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
completedDate: 2026-01-31
---
## Synthesis

### Reminders
- Original template is saved in archive 2 
	- It does not include the fixed color coding for column `O`
- I've created an "Incomplete Archive" for playlists I did not complete within a specific time
### Goals
- Remove dependency on "Main"
- Remove Reward Base
- Remove Time Estimate Base 
### Functionalities
- Ensure that the old functions still work
- In Column F, Green should mean that you're faster than 20%. Red should mean you're not faster than 20%
### O Column Calculation Incorrect
- Rounding error for below
```Original
Blue:
=AND(D4=MAX(FILTER(D$4:D, ROUND((INDEX(D:D,$Q$8) - (D$4:D))*(1-(1/1.2)),10) > $Q$7)),O4=MIN(FILTER(O:O, $Q$7 <= (O:O) * (1-(1/1.2)) + INDEX(FILTER(H:H, H:H<>""), COUNTA(FILTER(H:H, H:H<>""))))))

Purple:
=O4=MIN(FILTER(O:O, $Q$7 <= (O:O) * (1-(1/1.2)) + INDEX(FILTER(H:H, H:H<>""), COUNTA(FILTER(H:H, H:H<>"")))))

Orange:
=D4=MAX(FILTER(D$4:D, ROUND((INDEX(D:D,$Q$8) - (D$4:D))*(1-(1/1.2)),10) > $Q$7))
```

- Fixed
```
Blue:
=AND(D4=MAX(FILTER(D$4:D, ROUND((INDEX(D:D,$Q$8) - (D$4:D))*(1-(1/1.2)),10) >= $Q$7)), O4=MIN(FILTER(O:O, ROUND((O:O) * (1-(1/1.2)) + INDEX(FILTER(H:H, H:H<>""), COUNTA(FILTER(H:H, H:H<>""))), 10) >= $Q$7)))

Purple:
=O4=MIN(FILTER(O:O, ROUND((O:O) * (1-(1/1.2)) + INDEX(FILTER(H:H, H:H<>""), COUNTA(FILTER(H:H, H:H<>""))), 10) >= $Q$7))

Orange:
=D4=MAX(FILTER(D$4:D, ROUND((INDEX(D:D,$Q$8) - (D$4:D))*(1-(1/1.2)),10) >= $Q$7))
```