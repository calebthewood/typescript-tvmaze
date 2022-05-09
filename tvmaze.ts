import axios from "axios";
import * as $ from "jquery";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const API_URL = "https://api.tvmaze.com";
const DEFAULT_IMG = "https://tinyurl.com/tv-missing";

interface ShowInterface {
  id: number;
  name: string;
  summary: string;
  image: { medium: string } | null;
}

interface IShow extends Omit<ShowInterface, "image"> {
  image: string;
}

interface EpisodeInterface {
  id: number;
  name: string;
  season: string;
  number: string;
}

/*
1. interface for shows
2. make getShowsByTerm a generic

URL: /search/shows?q=:query
Example: https://api.tvmaze.com/search/shows?q=girls

*/

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term: string): Promise<IShow[]> {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`${API_URL}/search/shows?q=${term}`);

  return res.data.map((result: { show: ShowInterface }): IShow => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image?.medium || DEFAULT_IMG,
    };
  });
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: IShow[]): void {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt=${show.name}
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
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay(): Promise<void> {
  const term = $("#searchForm-term").val() as string;
  const shows: IShow[] = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$showsList.on("click", ".Show-getEpisodes", getAndDisplayEpisodes);


async function getAndDisplayEpisodes(evt: JQuery.ClickEvent) :Promise<void>{

  const showId = $(evt.target).closest(".Show").data("show-id");
  console.log(showId);

  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}



/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id: number) : Promise<EpisodeInterface[]> {

  const res = await axios.get(`${API_URL}/shows/${id}/episodes`);

  console.log(res.data)

  return res.data.map((result: EpisodeInterface ): EpisodeInterface => {
    return {
      id: result.id,
      name: result.name,
      season: result.season,
      number: result.number
    };
  });

}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {



}
