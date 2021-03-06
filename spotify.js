const getFromAPI = function(endpoint, query = {}) {
    const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
    return fetch(url).then(response => {
        if (!response.ok) {
            return Promise.reject(response.statusText);
        }
        return response.json();
    });
};

let artist;
const getArtist = name => {
    const query = {
        q: "System of a Down",
        limit: 1,
        type: "artist"
    }

    return getFromAPI("search", query).then(result =>{
      artist = result.artists.items[0];
      return getFromAPI(`artists/${artist.id}/related-artists`);
    }).then(relatedResults => {
        const relatedArtists  = relatedResults.artists;
        let artistTrackRequests = [];

        artist.related = relatedArtists;

        relatedArtists.forEach(artist => {
            artistTrackRequests.push(getFromAPI(`artists/${artist.id}/top-tracks`, {country: "US"}));
        });

        return Promise.all(artistTrackRequests);
    }).then(topTracks => {
        topTracks.forEach((currentTracks, num) => {
            artist.related[num].tracks = currentTracks.tracks;
        });

        return artist;
    }).catch(error => {console.log(error)});
};



// let artist;
// const getArtist = name => {
//     const query = {
//         q: "Celine Dion",
//         limit: 1,
//         type: "artist"
//     }

//     return getFromAPI("search", query).then(result =>{
//       artist = result.artists.items[0];
//       //https://api.spotify.com/v1/artists/{id}/related-artists
//       return fetch(`https://api.spotify.com/v1/artists/${artist.id}/related-artists`).then(relatedResults => {
//           const parsed = relatedResults.json();
//           artist.related = parsed.artists;
//           console.log(parsed);
//           return artist;
//       });  
//     }).catch(error => {console.log("WHAT THE HELL IS THIS", error)});
// };