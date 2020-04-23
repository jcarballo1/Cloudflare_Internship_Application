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
  const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
  const response = await fetch(url);
   const jsonResponse = await parseJSON(response)
  
   let rand = Math.random() //returns a number between 0 or 1
   let variant = 0
   if (rand <= 0.5) variant = 0
   else variant = 1
   console.log(jsonResponse[variant], variant, 'hello')
   let page = await fetch(jsonResponse[variant])

   return new HTMLRewriter()
   .on('*', new ElementHandler())
   .transform(page);
}

async function getRand() {
  //randomize variant for right now
  let rand = Math.random() //returns a number between 0 or 1
  let variant = 0
  if (rand <= 0.5) variant = 0
  else variant = 1
  return variant
}

async function parseJSON(jsonResponse) {
  const response = JSON.stringify(await jsonResponse.json())
  let variants = JSON.parse(response).variants
  return variants
}

class ElementHandler {
  element(element) {
    if (element.tagName === 'title') {
      element.setInnerContent(`this is the title`);
    }
    else if (element.tagName === 'h1') {
      element.prepend("This is ")
      element.append("!")
    }
    else if (element.tagName === 'p') {
      element.setInnerContent(`I'll implement cookies in a bit. So the variant is just random rn`);
    }
    else if (element.tagName === 'a' && (element.getAttribute('id') == "url")) {
      element.setAttribute("href", "")
      element.setInnerContent(``);
    }
  }
}
