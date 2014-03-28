## TODO

### Server Side

- Create endpoint to like/dislike caleg (Do we need to prevent users from liking/disliking multiple times?)
- Provide a way to filter caleg by multiple parameter values (probably CSV? Something like id=1,2,3). The documentation mentions filtering by one parameter value only. If supporting multiple values is too cumbersome, keep the API as it is and the client side should use regular dropdown with [select2](http://ivaynberg.github.io/select2/#basics)
- Paginate Electoral Districts API, or hardcode them (whichever is easier).

### Client Side

- Placeholder images for caleg without photos
- Caleg data to display - we don't have whatever the mockup suggests. Need to think what's actually displayable.
- Caleg detail page
- Select all (same as select none) filter values by category
- Conform to homepage branding as much as possible
