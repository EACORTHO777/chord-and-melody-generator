# Test Report

<!--
    Commit this file to the root of your application's GitHub repository, alongside its code.
    Every requirement listed in your README.md needs at least one test case below. Giving each
    requirement a short ID in the README (e.g. R1, R2) makes the "Requirement" column easy to fill
    in and to check.
-->

## Summary

All requirements were tested manually through the app's interface on the live version, https://chord-and-melody-generator.vercel.app, in Safari on macOS. Each test case below can be repeated by opening the link, following the "Input" column and comparing with "Expected outcome". To make sure no old version is cached, use a private window. The MIDI file was opened in FL Studio.

The hardest part to test was everything that depends on randomness, since every press on Generate gives a new song. This was solved with the seed: the same key and seed always give the same song, which makes favorites and share links possible to verify. Testing also found two real bugs, see the ❌ row below.

## Test Results

| Test case                    | Requirement | Input                                                                                | Expected outcome                                                                                     | Actual outcome                                                                                                                          |
| ---------------------------- | ----------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Choose a key                 | R1          | Selected "E" and "Minor" and pressed Generate.                                       | "Relative key: G major" and the notes E4, F#4, G4, A4, B4, C5, D5 are shown.                         | ✅ As expected.                                                                                                                         |
| Generate a chord progression | R2          | Pressed Generate five times in E minor.                                              | Four chords each time, all from E minor (Em, F#dim, G, Am, Bm, C, D). The progression can vary.      | ✅ As expected.                                                                                                                         |
| Generate on the live version | R2          | Pressed Generate on the live site after updating my module.                          | A song is generated.                                                                                 | ❌ Nothing happened. Vercel had cached the old module version without `toRelative()`. Fixed by redeploying without build cache, now ✅. |
| Generate a melody            | R3          | Pressed Generate in E minor.                                                         | 16 notes are shown under Melody, all from the E minor scale.                                         | ✅ As expected.                                                                                                                         |
| Play a song                  | R4          | Generated a song and pressed Play.                                                   | Chords and melody are heard together for about 6 seconds.                                            | ✅ As expected.                                                                                                                         |
| Play a single note and chord | R4          | Clicked a note button and a chord button.                                            | Only that note or chord is heard.                                                                    | ✅ As expected.                                                                                                                         |
| Save a favorite              | R5          | Generated a song, pressed Save favorite, reloaded the page and clicked the favorite. | The favorite is still listed after reload, and clicking it shows the same chords.                    | ❌ Save favorite crashed, since the favorites container had been removed from index.html by mistake. Fixed in commit f789ec9, now ✅.   |
| Show notes and relative key  | R6          | Selected "C" and "Major", pressed Generate and clicked a chord.                      | "Relative key: A minor", each chord shows its notes, e.g. "C major (C E G)", and the chord is heard. | ✅ As expected, after adding the chord notes to the buttons.                                                                            |
| Download MIDI                | R7          | Pressed Download MIDI and opened the file in FL Studio.                              | A file named like "C-major-12345.mid" is downloaded and plays the chords and melody in FL Studio.    | ✅ As expected.                                                                                                                         |
| Share a song                 | R8          | Pressed Share and opened the copied link in a new tab.                               | The same key and the same chords and melody are shown.                                               | ❌ Same bug as "Save a favorite", since opening a song also updates the favorites list. Fixed in commit f789ec9, now ✅.                |

## Known Issues in Third-Party Modules

No flaws in Dice-RNG-Toolkit affected the application. While testing it I noticed that `Randomizer.pickWeighted()` returns `undefined` instead of throwing an error when all weights are 0. The app always uses positive weights, so it never happens here.
