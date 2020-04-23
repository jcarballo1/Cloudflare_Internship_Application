/**
 * Author: Jennifer Carballo
 * Date: 4/22/2020
 * Description: javascript file for Cloudflare's Full Stack Internship Application
 */

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Respond page according to variant
 * @param {Request} request
 */
async function handleRequest(request) {
  let cookie = request.headers.get("cookie"); //gets value for cookie whether it's set or not
  const urls = await getResponse( 
    "https://cfw-takehome.developers.workers.dev/api/variants"
  ); //stores array of varients in jsonResponse

  let variNum = await getVariant(cookie); //gets variant number from header or from random
  const variantUrl = await fetch(urls[variNum]); //gets url of selected variant
  const page = new HTMLRewriter() //uses Element handler class to add customizations
    .on("*", new ElementHandler(variNum))
    .transform(variantUrl); //passes in url of selected variant
  //page.headers.set('Set-Cookie', variNum) //sets cookie to variant value
  return new Response(page, {
    headers: {
      'Content-Type': 'text/html',
      'Set-Cookie' :`variant=${variNum}`
    }
  }) //returns the page of the generated variant
}

/**
 * Fetches json from original url
 * calls parseJSON
 */
async function getResponse(url) {
  const response = await fetch(url);
  return await parseJSON(response);
}

/**
 * Returns current cookie value
 * If there is no value set,
 * randomly assign 0 or 1
 */
async function getVariant(cookieVal) {
  if (cookieVal.includes(0)) { //checks if one is set
    return 0;
  }
  else if (cookieVal.includes(1)) {
    return 1;
  } 
  else {
    //randomize variant if there is not one set
    let rand = Math.random(); //returns a number between 0 or 1
    if (rand <= 0.5)
      cookieVal = 0; //Variant 1
    else
      cookieVal = 1; //Variant 2
    return cookieVal;
  }
}

/**
 * Returns the array with the 2 variant urls
 */
async function parseJSON(jsonResponse) {
  const response = JSON.stringify(await jsonResponse.json()); //converts to json string
  let variants = JSON.parse(response).variants; //array of variant urls
  return variants;
}

/**
 * Customization of variants
 */
class ElementHandler {
  constructor(v) { //pass in generated variant number
    this.variant = v;
  }
  element(element) {
    if (element.tagName === "title") { //title in tab
      element.setInnerContent(`Jennifer Carballo's Cloudflare Application`);
    } else if (element.tagName === "h1") { //title under checkmark with variant name
      element.prepend("This is ");
      element.append("!");
    } else if (element.tagName === "p") { //description under title; varies with variant
      if (this.variant == 0)
        element.setInnerContent( //content for Variant 1
          `What a fun project, I learned a lot. Variant 2 has a link to my Github, clear cookies to access it! Check out my resume below :)`
        );
      else
        element.setInnerContent( //content for Variant 2
          `What a fun assignment, I learned a lot. Variant 1 has a link to my Linkedin, clear cookies to access it! Check out my previous projects below :)`
        );
    } else if (element.tagName === "a") { //link set on button; varies with variant
      if (this.variant == 0) {
        element.setAttribute("href","https://www.linkedin.com/in/jennifer-carballo/"); //link for Variant 1
        element.setInnerContent(`Jennifer Carballo's Linkedin`);
      } else {
        element.setAttribute("href", "https://github.com/jcarballo1"); //linke for Variant 2
        element.setInnerContent(`Jennifer Carballo's Github`);
      }
    }
  }
}
