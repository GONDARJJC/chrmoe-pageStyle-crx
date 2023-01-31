const textareaDom = document.getElementById('textarea')
const btnDom = document.getElementById('button')
const btnGetDom = document.getElementById('buttonGet')
const fmtGetDom = document.getElementById('fmtGet')

const KEY_D_CODE = 68
const CSS_NONE = 'display: none !important;\n'

textareaDom.addEventListener('keydown', function (e) {
  if (e.altKey && e.keyCode === KEY_D_CODE) {
    console.log(111)
  }
})

textareaDom.addEventListener('keyup', function (e) {
  const pos = e.target.selectionStart
  const value = e.target.value
  if (e.altKey && e.keyCode === KEY_D_CODE) {
    const newValue = value.slice(0, pos - 1) + CSS_NONE + value.slice(pos)
    e.target.value = newValue
    textareaDom.setSelectionRange(pos + CSS_NONE.length - 1, pos + CSS_NONE.length - 1)
  }
})

btnDom.onclick = async function () {
  const value = textareaDom.value

  let queryOptions = {active: true, lastFocusedWindow: true};
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  const host = new URL(tab.url).host

  chrome.storage.sync.set({[host]: value}, function () {
    console.log('Value is set to ' + value);
  });
}

fmtGetDom.onclick = async function () {
  const value = textareaDom.value
  const opt = {
    minifyCSS: true, format: {
      beautify: true
    }
  }

  const aa = parse(value)

  const rules = aa.stylesheet.rules.map(({selectors, declarations}) => {
    return {selectors, declarations}
  })

  const sss = rules.map(x => genRules(x)).join('\n')

  function genRules(rule) {
    const declarations = rule.declarations
    const rules = declarations.reduce((pre, cur) => {
      pre += `${cur.property}:${cur.value};`
      return pre
    }, '')
    return `${rule.selectors.join(' ')}{
    ${rules}
  }`
  }

  const a = css_beautify(sss, {
    'indent_size': 2,
    'indent_char': ' ',
    'selector_separator': '',
    'end_with_newline': false,
    'newline_between_rules': true,
    'space_around_selector_separator': true
  })
  // const a =await minify(value, opt)
  console.log(a)
  textareaDom.value = a
}

btnGetDom.onclick = async function () {

  let queryOptions = {active: true, lastFocusedWindow: true};
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  const host = new URL(tab.url).host
  chrome.storage.sync.get([host], function (result) {
    console.log('Value currently is ' + result[host]);
    textareaDom.value = result[host]
    chrome.scripting.insertCSS({
      target: {tabId: tab.id}, css: result[host]
    })
  });

}

async function aa() {
  let queryOptions = {active: true, lastFocusedWindow: true};
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  const host = new URL(tab.url).host
  chrome.storage.sync.get([host], function (result) {
    console.log('Value currently is ' + result[host]);
    textareaDom.value = result[host]
    // chrome.scripting.insertCSS({
    //   target: {tabId: tab.id}, css: result.host
    // })
  });
}

aa()

