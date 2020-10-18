addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

const url = "https://static-links-page.signalnerve.workers.dev"
const data = [
  {"name": "Link1", "url": "https://linkurl1.com"},
  {"name": "Link2", "url": "https://linkurl2.com"},
  {"name": "Link3", "url": "https://linkurl3.com"},
  {"name": "Link4", "url": "https://linkurl4.com"},
]

const data_social = [
  {"name": "Social Link1", "url": "https://sociallinkurl1.com", "svg": "https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/github.svg"},
  {"name": "Social Link2", "url": "https://sociallinkurl2.com", "svg": "https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/cloudflare.svg"},
  {"name": "Social Link3", "url": "https://sociallinkurl3.com", "svg": "https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/apple.svg"},
  {"name": "Social Link4", "url": "https://sociallinkurl4.com", "svg": "https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/google.svg"},
]

class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    var i
    for (i = 0; i < this.links.length; i++) {
      var link = this.links[i]
      let a_tag = "<a href=\"" + link.url + "\">" + link.name + "</a>"
      element.append(a_tag,{html:true})
    }
  }
}

class SocialLinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    var i
    for (i = 0; i < this.links.length; i++) {
      var link = this.links[i]
      let a_tag = "<a style=\"display:inline-block\" href=\"" + link.url + "\">" + "<img src=\""+link.svg+"\" height=\"35\" width=\"35\"/>" + "</a>"
      element.append(a_tag,{html:true})
    }
  }
}

class AttributeHandler {
  constructor(attribute, value) {
    this.attribute = attribute
    this.value = value
  }
  
  async element(element) {
    console.log(`${element.tagName},${element.getAttribute("class")}`)
    if (this.attribute == "text") {
      element.setInnerContent(this.value, {html:false})
    }
    else {
      element.setAttribute(this.attribute, this.value)
    }
  }
}

async function handleRequest(request) {
  if (request.url.endsWith("/links")) {
  
    const json = JSON.stringify(data, null, 2)
    let response = new Response(json, { headers: { "content-type": "application/json;charset=UTF-8" } })
    return response
  }
  else {
    const init = {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    }
    const response = await fetch(url, init)
    const rewriter = new HTMLRewriter()
                    .on("div#links", new LinksTransformer(data))
                    .on("div#profile", new AttributeHandler("style","display:block"))
                    .on("img#avatar", new AttributeHandler("src","https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"))
                    .on("h1#name", new AttributeHandler("text", "tanmay_gatle"))
                    .on("div#social", new AttributeHandler("style","display:block"))
                    .on("div#social", new SocialLinksTransformer(data_social))
                    .on("title", new AttributeHandler("text", "Tanmay Gatle"))
                    .on("body", new AttributeHandler("class", "bg-orange-400"))
                    
    return rewriter.transform(response)
  }
}