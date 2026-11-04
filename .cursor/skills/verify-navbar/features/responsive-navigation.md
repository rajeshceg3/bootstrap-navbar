# Responsive navigation
## Sub-features
Brand, Home/About/Contact placeholders, mobile collapse toggle and desktop expanded layout.
## How to get to it (user POV)
Open the built preview page. Under Bootstrap's992px breakpoint use Toggle navigation. At desktop width links are inline.
## Driving it with drive.mjs
Run doctor and drive at390 and1365 widths. Assert label/order, collapsed/open/closed mobile states and aria-expanded, desktop links visible/toggle hidden. Inspect screenshots.
## Gotchas
All href values are #, not working pages. No destinations were requested or invented. Original index.html had no script entry and index.js had raw nav HTML outside its template; build could pass with an empty app. Boot now checks rendered nav, not only build exit. Bootstrap4/Popper1 are legacy dependencies preserved within existing ranges, not force-upgraded; dependency security must be tracked separately.
