# Improvements to the app

## Backend
Since my backend skills are deeper than my front-end skills (70/30), I focused on this area first.

### Database tables.

I made a few changes to the advocate table.

First, as a minor change I updated phone number to be text field. Logically speaking, phone numbers are text that happens to be composed of digits, not integers. I also update specialties from a jsonb column to a plain text array column. This restricts their schema and makes more clear what data is stored

Given more time, I would have taken one of two approaches to specialities - either making them an enum in code which is stored as references to that enum in the array column, or a separate table holding ids and string values. 

Both of these approaches allow us to both control the valid set of specialty names, and allows us to globally change the name more easily. I have a slight preference for defining this sort of static/slow changing data in code, as generally updating a code reference is actually cheaper in a modern continuous deployment environment than a database migration, and it reduces the extraneous joins you need to pull data out of the enum table. But both approaches could be viable ehre.

The downside of both of these approaches is they make the full text index building more complicated - we need a process or trigger for updating the full text index document in response to a specialty value change. Because I thought the full text index was more valuable and interesting for a demo, I focused on building that and skipped factoring out specialities into an enu

For the full text index, I just created a column that held all the searchable fields (first and last name, city, all specialties, degree) in a space delimited format, and then threw on a GIN index on that space delimited text converted to a ts_vector. This creates an index where each individual word is indexed allowing searches on any term.

The downside of GIN indexes is they are very expensive to build on update. But for our use case, that hardly matters. The provider list is almost certainly going to change slowly, and through offline processes that do not block user's experiences. So it makes sense to always optimize for end customers for speed.


## General Backend Performance Considerations

The prompt notes we have hundreds of thousands of advocates to churn through. This is a relatively small data set - too large, likely, to pass the entire data set to the browser, but within the size where it would be reasonable to hold the entire data set in memory with no problem. 

Each advocate has

first name: Perhaps as many as 30 bytes if UTF-8 encoded
last name: Perhaps as many as 30 bytes
degree: A few bytes, say less than 10,
specialties: Maybe 1-10 specialties, each up to perhaps 50 bytes. So say 500 bytes worse case
years of experience: 8 bytes
phone number: 10 bytes

Altogether that is less than 1 kilobyte. If we round up to a kilobyte to accomodate object overhead, a 300K advocate dataset is going to be less than 300 MB. 

The dataset is also, presumably, very slowly changing. Advocates are presumably added by backoffice processes or data syncs. 

Finally, our data latency tolerance is likely high. Lags of seconds, minutes, or even tens of minutes before an advocates data shows up in search are entirely acceptable - it just means users will see one fewer option.

All together this gives us enormous flexibility, and largely trivializes performance problems. We can index data as much as we want in the database. We can shift to storing the whole dataset in memory either in a caching layer like Reddis, or even just in the application. We have as many knobs as we want

## Front end

### Overall changes

The big change here was to shift from the weird hacky 'pull all the records and filter them in memory' to just leveraging the full text search we built on the backend. For my approach I did remove typahead features. They could be added back in, certainly, but I don't think they add much to the user experience. 

Results before the user has typed their full query probably don't help all that much. The user doesn't want providers from New Orleans if they are typing New York - it can be distracting and disorienting to watch results change while you are typing. At the same time, they massively multiply the server load for search. I think removing that feature leads to just as good if not better user experience.

Now if we created an omnibox type search where in addition to providers you could look up specialties or something similar that might be different. There suggestions can be very useful, because users likely won't know the exact magic term for specialities, and we could build tooling to 'alias' specialties and help users find our terms for them to facilitate their search.

Aside from that, changes were mostly cosmetic, or structural. I actually don't think the underlying HTML read as 'AI Chimpanzee' quality, it was imperfect, but aside from the use of `<br>` tags it captured the semantics of the page. I made micro tweaks in a few places.

Given more time, I would have broken down the page into more components - one for search bar, one for results, to better express the logic of the page.

### Design
From a desig perspective, my big shifts were pulling the 

## Addtional Notes

I did not have time to add tests. Obviously this needs a whole robust unit testing practice. 




