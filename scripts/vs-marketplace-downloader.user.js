// ==UserScript==
// @name        VS Marketplace Downloader
// @namespace   Violentmonkey Scripts
// @match       https://marketplace.visualstudio.com/items?itemName=*
// @grant       none
// @version     1.0
// @description Adds a download button once the Resources section is loaded.
// ==/UserScript==

const observer = new MutationObserver(() => {
  const targetContainer = document.querySelector(".ux-section-resources ul");
  const versionElem = document.querySelector('td[aria-labelledby="version"]');

  // Only proceed if both the target list and version element exist
  if (
    targetContainer &&
    versionElem &&
    !document.querySelector("#tm-download-vsix")
  ) {
    const url = window.location.href;
    const match = url.match(/itemName=([^&]+)/);
    if (!match) return;

    const itemName = match[1];
    const [publisher, extension] = itemName.split(".");
    const version = versionElem.textContent.trim();
    const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage`;

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.id = "tm-download-vsix";
    a.href = downloadUrl;
    a.textContent = "Download VSIX";
    a.style.fontWeight = "bold";

    li.appendChild(a);
    targetContainer.appendChild(li);

    // Successfully added; we can stop observing
    observer.disconnect();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
