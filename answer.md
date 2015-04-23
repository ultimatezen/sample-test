# Refactoring
### events
  - add end time
 
### event_list for students
  - add "to" parameter so you can have a range
  - allow to filter by company name
  - allow to filter by time of day/day of week
  - filter by reserved/unreserved

### reserve and unreserve
  - just from a user perspective, don't error if there's nothing the user can do, i.e. trying to unreserve something that isn't reserved

### event_list for companies
  - add "to" parameter so you can have a range
  - sort events by number of attendees
  - check for overlapping events


# Other
Some other minor things
  - would be nice if specs read port from config (for non root/sudo)
  - probably better to use int timestamp than datetime (easier to migrate to different datastore, removes logic from database layer and into the application layer where it's easily handled and easier to scale)

