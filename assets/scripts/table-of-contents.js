function pageNumber(element) {
  const page = element.closest('div[class~="pagedjs_page"]')
  return page.getAttribute('data-page-number')
}

function createTableOfContents(config) {
  const titles = Array.from(config.content.querySelectorAll(config.titlesSelector))

  const headersRange =
    titles
      .map((el) => el.tagName)
      .map((h) => /H(\d{1})/.exec(h))
      .filter((re) => re)
      .map((re) => re[1])
      .map((strInt) => parseInt(strInt))

  const titlesWithLevel =
    headersRange
      .map((level, i) => [titles[i], level])

  const highestLevel = Math.min(...headersRange) + parseInt(config.depth) - 1

  const boundedTitlesWithLevel =
    titlesWithLevel
      .filter((entry) => entry[1] <= highestLevel)

  const container = config.content.querySelector(config.ref)

  const entries = boundedTitlesWithLevel.map((tl) => this.renderEntry(tl[0], tl[1]))

  const html = `
    <table class="table-of-contents">
      ${entries.join('')}
    <table>
    `

  container.innerHTML = html
}

function renderEntry(el, level) {
  if (!el.id) el.id = Math.random().toString(36).substring(7)
  return `
    <tr class="entry level-${level}">
      <td class="title"><a href="#${el.id}">${el.innerHTML}</a></td>
      <td class="spacing"></td>
      <td class="page-number"><a href="#${el.id}" class="page-number-ref" data-ref-id="${el.id}">XX</a></td>
    </tr>`
}

function pageTableOfContents(config) {
  const container = document.querySelector(config.ref)
  const entries = Array.from(container.querySelectorAll('.page-number-ref'))
  const pageReferences = entries.map((e) => e.getAttribute('data-ref-id'))

  const elements = pageReferences.map((ref) => document.getElementById(ref))
  const pageNumbers = elements.map(pageNumber)

  entries.forEach((el, index) => {
    el.textContent = pageNumbers[index];
  })
}

class handlers extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }

  beforeParsed(content){
    createTableOfContents({
      content: content,
      ref: '#table-of-contents',
      titlesSelector: ['.content h1,.content h2,.content h3,.content h4,.content h5,.content h6'],
      depth: 3
    });
  }

  afterPreview(pages) {
    pageTableOfContents({
      ref: '#table-of-contents'
    });
  }
}
Paged.registerHandlers(handlers);

