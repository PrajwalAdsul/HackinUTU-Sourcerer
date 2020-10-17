let details = {};
let set = new Set();

// Fetch page content from the backend
fetch("http://127.0.0.1:5000/get/contacts", {
  method: "POST",
  mode: "cors",
  cache: "no-cache",
  headers: {
    "Content-Type": "application/json",
  },
  referrerPolicy: "no-referrer",
  body: JSON.stringify({ url: window.location.href }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    details = { ...data };
    insertToSet();
    replaceText(document.body);
  })
  .catch((err) => {
    console.log(err);
  });

// Highlight the names and emails
function replaceText(element) {
  if (element.hasChildNodes()) {
    element.childNodes.forEach(replaceText);
  } else if (element.nodeType === Text.TEXT_NODE) {
    set.forEach((val) => {
      let re = new RegExp(val, "gi");
      if (element.textContent.match(re)) {
        const newElement = document.createElement("span");
        newElement.innerHTML = element.textContent.replace(
          re,
          `<span class="rainbow">${val}</span>`
        );
        element.replaceWith(newElement);
      }
    });
  }
}

// remove duplicate data by adding it to set
function insertToSet() {
  for (const prop in details) {
    details[prop].forEach((value) => set.add(value));
  }
}
