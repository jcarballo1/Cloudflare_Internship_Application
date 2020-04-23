/**
 * Author: Jennifer Carballo
 * Date: 4/22/2020
 * Description: javascript file for Cloudflare's Full Stack Internship Application
 */

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let cookie = request.headers.get("cookie");
  const jsonResponse = await getResponse(
    "https://cfw-takehome.developers.workers.dev/api/variants"
  );

  let variNum = await getVariant(cookie);
  const page = await fetch(jsonResponse[variNum]);
  const newPage = new HTMLRewriter()
    .on("*", new ElementHandler(variNum))
    .transform(page);
  newPage.headers.set('Set-Cookie', variNum)
  return newPage
}

async function getResponse(url) {
  const response = await fetch(url);
  return await parseJSON(response);
}

async function getVariant(cookieVal) {
  console.log('in method:',cookieVal)
  if (cookieVal == '0' || cookieVal == '1') {
    return cookieVal;
  }
  else {
    //randomize variant for right now
    let rand = Math.random(); //returns a number between 0 or 1
    if (rand <= 0.5) cookieVal = 0;
    else cookieVal = 1;
    return cookieVal;
  }
}

async function parseJSON(jsonResponse) {
  const response = JSON.stringify(await jsonResponse.json());
  let variants = JSON.parse(response).variants;
  return variants;
}

class ElementHandler {
  constructor(v) {
    this.variant = v;
  }
  element(element) {
    if (element.tagName === "title") {
      element.setInnerContent(`Jennifer Carballo's Cloudflare Application`);
    } else if (element.tagName === "h1") {
      element.prepend("This is ");
      element.append("!");
    } else if (element.tagName === "p") {
      if (this.variant == 0)
        element.setInnerContent(
          `What an interesting assignment, I learned a lot. Variant 2 has a link to my Github, clear cookies to access it!`
        );
      else
        element.setInnerContent(
          `What an interesting assignment, I learned a lot. Variant 1 has a link to my Linkedin, clear cookies to access it!`
        );
    } else if (element.tagName === "a") {
      if (this.variant == 0) {
        element.setAttribute("href","https://www.linkedin.com/in/jennifer-carballo/");
        element.setInnerContent(`Jennifer Carballo's Linkedin`);
      } else {
        element.setAttribute("href", "https://github.com/jcarballo1");
        element.setInnerContent(`Jennifer Carballo's Github`);
      }
    }
  }
}
