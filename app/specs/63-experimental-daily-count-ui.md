# Experimental Daily Count Interface

https://github.com/kwila-cloud/bintraq/issues/63

## Plan

Instead of inputting each individual bin, allow the user to input the daily count for each picker at the end of the day.

- [x] Duplicate the "bin" table in supabase to a new "dailyCount" table
  - [x] Remove block, size, and id columns
  - [x] New count column
  - [x] Set up RLS
- [x] Experimental toggle in the frontend
  - [x] The user can access it from a new "Settings" item at the top of the main menu
  - [x] The value of the "dailyCountUiEnabled" setting should be stored in the client
- [x] Rename `/add-bin` route to `/add`
- [x] Rename `HistoryView` to `BinsHistoryView`
- [x] When "dailyCountUiEnabled" is true, we should use new components for all of the following routes:
  - [x] `/add` should use new `AddDailyCountView`
  - [x] `/pending` should use new `PendingDailyCountsView`
  - [x] `/history` should use new `DailyCountsHistoryView`
- [ ] `AddDailyCountView` should be the same as `AddBinView`, but instead should:
  - [ ] Allow the user to input daily count rather than block, size, and bin ID
  - [ ] Display the list of daily count options directly in the view to make the UX more efficient
    - [ ] Use a 5 column grid from 1-25 to display the daily count options
- [ ] `PendingDailyCountsView` should be the same as `PendingBinsView`, but instaed should:
  - [ ] Display the list of pending daily counts, with:
    - [ ] Picker
    - [ ] Count
    - [ ] Delete button
  - [ ] Should include the following in the SMS message
    - [ ] Date
    - [ ] Picker
    - [ ] Daily count
    - [ ] Weekly count
- [ ] `DailyCountsHistoryView` should be the same as `BinsHistoryView`, but instead should:
  - [ ] Display the list of send daily count messages, with:
    - [ ] Picker
    - [ ] Count
    - [ ] Timestamp
    - [ ] Send status
