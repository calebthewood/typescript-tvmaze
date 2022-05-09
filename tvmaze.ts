import axios from "axios";
import * as $ from 'jquery';

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const API_URL = "https://api.tvmaze.com/search/shows";
const DEFAULT_IMG = "https://tinyurl.com/tv-missing";
/*
1. interface for shows
2. make getShowsByTerm a generic

URL: /search/shows?q=:query
Example: https://api.tvmaze.com/search/shows?q=girls

*/


// [
//   {
//     id: 1767,
//     name: "The Bletchley Circle",
//     summary:
//       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
//          women with extraordinary skills that helped to end World War II.</p>
//        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
//          normal lives, modestly setting aside the part they played in
//          producing crucial intelligence, which helped the Allies to victory
//          and shortened the war. When Susan discovers a hidden code behind an
//          unsolved murder she is met by skepticism from the police. She
//          quickly realises she can only begin to crack the murders and bring
//          the culprit to justice with her former friends.</p>`,
//     image:
//         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
//   }
// ]

async function getData(username: string): Promise<string> {
  const apiUrl = `https://api.github.com/users/${username}`;
  const res = await fetch(apiUrl);
  const jsonResponse = await res.json();
  return jsonResponse.name;
}

interface ShowInterface {
  id: number;
  name: string;
  summary: string;
  image?: string;
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term: string): Promise < ShowInterface[] > {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`${API_URL}/?q=${term}`);
  console.log(res)


  const shows:ShowInterface[] = res.data.map( <T>(s:T): ShowInterface => {

    return  {
        id: s.show.id,
        name: s.show.name,
        summary: s.show.summary,
        image: s.show.image ? s.show.image.medium : DEFAULT_IMG
    }
  })
  return shows;
};


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: ShowInterface[]):void {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg"
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay(): void {
  const term: string = $("#searchForm-term").val();
  const shows: ShowInterface = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }