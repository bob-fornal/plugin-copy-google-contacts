
const nameId = document.getElementById('name');
const emailsId = document.getElementById('emails');
const websiteId = document.getElementById('website');

let copy = [];

function processData(data) {
  if (data === null) return;

  copy = [];

  nameId.innerText = data.name;
  copy.push(data.name);

  const emails = data.email.join('\n');
  emailsId.innerText = emails;
  copy.push(...data.email);

  const websites = data.sites.join('\n');
  websiteId.innerText = websites;
  copy.push(...data.sites);
}

function handleCopy() {
  navigator.clipboard.writeText(copy.join('\n'));
}

function handleClickEvent() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    async function captureData() {
      const active = document.querySelector('[style="visibility: visible; opacity: 1;"]');

      const button = active.querySelector('.iy8V6c button');
      if (button !== null && button.innerText === 'More') {
        button.click();
      }

      await new Promise(r => setTimeout(r, 100));
      const nameData = active.querySelector('.Tabbqd [aria-level="1"]').innerText;

      const emailData = [];
      const emails = active.querySelectorAll('[aria-label*="Email"]');
      for (let i = 0, len = emails.length; i < len; i++) {
        emailData.push(emails[i].innerText);
      }

      const siteData = [];
      const sites = active.querySelectorAll('[aria-label*="Website"]');
      for (let i = 0, len = sites.length; i < len; i++) {
        siteData.push(sites[i].innerText);
      }

      return { name: nameData, email: emailData, sites: siteData };
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: captureData,
    }).then((data) => {
      processData(data[0].result);
    })
  });
}

const captureId = document.getElementById('capture');
captureId.addEventListener('click', handleClickEvent);

const copyId = document.getElementById('copy');
copyId.addEventListener('click', handleCopy);
