const request = require( 'request-promise' )
const fs = require( 'fs' )
const cheerio = require( 'cheerio' )
const json2csv = require( 'json2csv' ).Parser

const movies = [ `https://www.imdb.com/title/tt6468322/?ref_=hm_fanfav_tt_3_pd_fp1`, `https://www.imdb.com/title/tt0903747/?ref_=tt_sims_tti` ];

( async () => {
  let imdbData = []

  for ( let movie of movies )
  {
    const response = await request( {
      uri: movie,
      headers: {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9"
      },
      gzip: true
    } )
    let $ = cheerio.load( response )
    let title = $( 'div[class="title_wrapper"] > h1' ).text().trim()
    let rating = $( 'div[class="ratingValue"] > strong > span' ).text()
    let summary = $( 'div[class="summary_text"]' ).text().trim()
    let releaseData = $( 'a[title="See more release dates"]' ).text().trim()

    imdbData.push( { title, rating, summary, releaseData } )
  }

  const json2csvParser = new json2csv()
  const csv = json2csvParser.parse( imdbData )

  fs.writeFileSync( "./imdb-movie.csv", csv, "utf-8" )

} )()
