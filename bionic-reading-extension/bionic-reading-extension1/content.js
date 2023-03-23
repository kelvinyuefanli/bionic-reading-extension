function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyBionicReading() {
  const targetNode = document.body;
  const bionicRegExp = /\b(\w{1,3})/g;
  const isDark = isDarkMode();

  function traverseNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent;
      const newTextContent = textContent.replace(
        bionicRegExp,
        `<span class="bionic-reading-effect" style="color: ${isDark ? 'white' : 'black'}; font-weight: bold;">$1</span>`
      );
      const wrapper = document.createElement('span');
      wrapper.innerHTML = newTextContent;
      node.replaceWith(...Array.from(wrapper.childNodes));
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.nodeName)
    ) {
      Array.from(node.childNodes).forEach(traverseNodes);
    }
  }

  traverseNodes(targetNode);
}

function removeBionicReading() {
  const targetNode = document.body;

  function traverseNodes(node) {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.classList.contains('bionic-reading-effect')
    ) {
      node.style.color = '';
      node.outerHTML = node.textContent;
    } else {
      Array.from(node.childNodes).forEach(traverseNodes);
    }
  }

  traverseNodes(targetNode);
}

let bionicReadingEnabled = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleBionicReading') {
    bionicReadingEnabled = !bionicReadingEnabled;
    if (bionicReadingEnabled) {
      applyBionicReading();
    } else {
      removeBionicReading();
    }
  }
});