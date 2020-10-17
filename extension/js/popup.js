var form_el = document.getElementById("searchForm");
var domainSearchBtn = document.getElementById("domainBtn");
var downloadCSVBtn = document.getElementById("downloadCSVButton");
let main_details = undefined;


domainSearchBtn.addEventListener("click", () => {
  // e.preventDefault();
  document.getElementsByClassName("loader")[0].style.display = "block";
  document.getElementsByClassName("container")[0].style.display = "none";
  let tabURL;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabURL = new URL(tabs[0].url);
    console.log(tabURL.protocol + tabURL.hostname);

    //fetching content from complete domain i.e. domainCapture request
    fetch("http://127.0.0.1:5000/get/contacts/domain", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        url: tabURL.protocol + "//" + tabURL.hostname,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        details = { ...data };
        console.log(details);

        //setting up the popup display data
        setupPage(details, "");
      });
  });
});

//filtering input field onSubmit handler
form_el.addEventListener("submit", function (evt) {
  evt.preventDefault();
  filter = form_el.search.value;
  setupPage(main_details, filter.toLowerCase());
});

const setupError = (error) => {
  console.log("error");
};

// Main function setting up the popup display data once fetched from backend
const setupPage = (details, filter) => {
  try {
    let names = details.names;
    let emails = details.emails;
    let numbers = details.numbers;
    let socials = details.social_links;
    document.getElementsByClassName("loader")[0].style.display = "none";
    document.getElementsByClassName("container")[0].style.display = "block";
    setupName(names, filter);
    setupEmail(emails, filter);
    setupNumber(numbers, filter);
    setupSocial(socials, filter);
  } catch (err) {
    console.log(err);
  }
};

// clear previous data from lists
const clearList = (list) => {
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
};

const setupName = (names, filter) => {
  if (names.length == 0) {
    item = document.getElementsByClassName("main__info__names")[0];
    makeItemInvisible(item);
  }
  list = document.getElementById("main__info__names__list");
  clearList(list);

  index = 1;
  names.forEach((name) => {
    if (name.toLowerCase().includes(filter)) {
      addName(index + ". " + name);
      index += 1;
    }
  });
};

const addName = (name) => {
  let list = document.getElementById("main__info__names__list");
  // console.log(list)
  var li = document.createElement("li");
  var span = document.createElement("span");
  span.className = "names__content__listitem__title";
  span.textContent = name;
  li.appendChild(span);
  // console.log(li)
  list.appendChild(li);
};

//display of email data
const setupEmail = (emails, filter) => {
  if (emails.length == 0) {
    item = document.getElementsByClassName("main__info__emails")[0];
    makeItemInvisible(item);
  }
  index = 1;
  list = document.getElementById("main__info__emails__list");
  clearList(list);
  emails.forEach((email) => {
    if (email.toLowerCase().includes(filter)) {
      addEmail(index + ". " + email);
      index += 1;
    }
  });
};

const addEmail = (email) => {
  let list = document.getElementById("main__info__emails__list");
  // console.log(list)
  var li = document.createElement("li");
  var span = document.createElement("span");
  span.className = "names__content__listitem__title";
  span.textContent = email;
  li.appendChild(span);
  list.appendChild(li);
};

//display numbers
const setupNumber = (numbers, filter) => {
  if (numbers.length == 0) {
    item = document.getElementsByClassName("main__info__contact")[0];
    makeItemInvisible(item);
  }
  index = 1;
  list = document.getElementById("main__info__contacts__list");
  clearList(list);
  numbers.forEach((number) => {
    if (number.toLowerCase().includes(filter)) {
      addNumber(index + ". " + number);
      index += 1;
    }
  });
};

const addNumber = (number) => {
  let list = document.getElementById("main__info__contacts__list");
  var li = document.createElement("li");
  var span = document.createElement("span");
  span.className = "names__content__listitem__title";
  span.textContent = number;
  li.appendChild(span);
  list.appendChild(li);
};

//display social links
const setupSocial = (socials, filter) => {
  if (socials.length == 0) {
    item = document.getElementsByClassName("main__info__social")[0];
    makeItemInvisible(item);
  }
  index = 1;
  list = document.getElementById("main__info__socials__list");
  clearList(list);
  socials.forEach((social) => {
    if (social.toLowerCase().includes(filter)) {
      addSocial(index + ". " + social);
      index += 1;
    }
  });
};

const addSocial = (social) => {
  let list = document.getElementById("main__info__socials__list");
  var li = document.createElement("li");
  var span = document.createElement("span");
  span.className = "names__content__listitem__title";
  span.textContent = social;
  li.appendChild(span);
  list.appendChild(li);
};

const makeItemInvisible = (item) => {
  item.style.display = "none";
};

function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";
  console.log(array);
  for (var i = 0; i < array.length; i++) {
    var line = "";
    var flag = false;
    for (var index in array[i]) {
      if (flag) {
        line += ",";
      } else {
        flag = true;
      }
      line += array[i][index];
    }

    str += line + "\r\n";
  }

  return str;
}

//export to csv functionality
function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = this.convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

var new_headers = {
  names: "Names",
  emails: "Emails",
  numbers: "Numbers",
  social_links: "Social Links",
};

const getFormattedList = (numbers) => {
  var list = "";
  numbers.forEach((number) => {
    list += number + "\n";
  });
  return list;
};

const getFormattedDetails = () => {
  let names = main_details.names;
  let emails = main_details.emails;
  let numbers = main_details.numbers;
  let socials = main_details.social_links;
  var max_index = Math.max(
    names.length,
    emails.length,
    numbers.length,
    socials.length
  );

  var formatted_details = [];

  for (i = 0; i < max_index; i++) {
    formatted_details.push({
      names: names[i] ? names[i] : "",
      emails: emails[i] ? emails[i] : "",
      numbers: numbers[i] ? numbers[i] : "",
      social_links: socials[i] ? socials[i] : "",
    });
  }

  return formatted_details;
};

var fileTitle = "contacts";

downloadCSVBtn.addEventListener("click", () => {
  exportCSVFile(new_headers, getFormattedDetails(), fileTitle);
});

const fetchData = () => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    fetch("http://127.0.0.1:5000/get/contacts", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ url: tabs[0].url }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let details = { ...data };
        localStorage.setItem(
          "my_extension_" + tabs[0].url,
          JSON.stringify(details)
        );
        main_details = details;
        setupPage(details, "");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

// Load the page and fetch the data
window.addEventListener("load", () => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    main_details = localStorage.getItem("my_extension_" + tabs[0].url);
    if (main_details) {
      main_details = JSON.parse(main_details);
      setupPage(main_details, "");
    } else {
      fetchData();
    }
  });
});
