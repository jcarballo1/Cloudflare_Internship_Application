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
   .on('*', new ElementHandler(variant))
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
  constructor(v) {
    this.variant = v
  }
  element(element) {
    if (element.tagName === 'title') {
      element.setInnerContent(`Jennifer Carballo's Cloudflare Application`);
    }
    else if (element.tagName === 'h1') {
      element.prepend("This is ")
      element.append("!")
    }
    else if (element.tagName === 'p') {
      if(this.variant == 0)
        element.setInnerContent(`I'll implement cookies in a bit. So the variant is just random rn Variant 2 has a link to my Github!`);
      else 
        element.setInnerContent(`I'll implement cookies in a bit. So the variant is just random rn Variant 1 has a link to my Linkedin!`);
    }
    else if (element.tagName === 'a') {
      if (this.variant == 0) {
        element.setAttribute("href", "htt/ps://www.linkedin.com/in/jennifer-carballo/")
        element.setInnerContent(`Jennifer Carballo's Linkedin`);
      }
      else {
        element.setAttribute("href", "https://github.com/jcarballo1")
        element.setInnerContent(`Jennifer Carballo's Github`);
      }
    }
  }
}
