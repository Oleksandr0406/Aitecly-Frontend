console.log("loaded chatbot_wrapper.js");

const chatbotScript = document.querySelector("script[data-name='aitechly']");
const chatbotId = chatbotScript?.getAttribute("data-id");
const chatbotPosition = chatbotScript?.getAttribute("data-position");
const chatbotAddress = chatbotScript?.getAttribute("data-address");
const chatbotServerAddress = chatbotScript?.getAttribute("data-server-address");
const chatbotWrapper = document.createElement("div");
chatbotWrapper.id = "chatbot-wrapper";
chatbotWrapper.style.zIndex = "9249299";
chatbotWrapper.style.background = "transparent";
chatbotWrapper.style.overflow = "hidden";
chatbotWrapper.style.position = "fixed";
chatbotWrapper.style.bottom = "0px";
switch (chatbotPosition) {
  case "left":
    chatbotWrapper.style.left = "0px";
    break;
  case "right":
    chatbotWrapper.style.right = "0px";
    break;
  default:
    break;
}
chatbotWrapper.style.width = "min(100%, 400px)";
chatbotWrapper.style.height = "min(100%, 800px)";

let widgetOpen = true;

document.body.appendChild(chatbotWrapper);

let widgetSize = chatbotScript?.getAttribute("data-widget-size");
let widgetButtonSize = chatbotScript?.getAttribute("data-widget-button-size");

const VALID_WIDGET_SIZES = {
  normal: {
    height: "680px",
    width: "384px",
  },
  large: {
    height: "800px",
    width: "422px",
  },
};

if (!VALID_WIDGET_SIZES[widgetSize]) {
  widgetSize = "normal";
}

const iframe = document.createElement("iframe");

// let iframeUrl = `https://${removeHttp(
//   chatbotAddress
// )}/widget/${chatbotId}`;

let iframeUrl = `${chatbotAddress}/chatbot/${chatbotId}`;

const urlObj = new URL(iframeUrl);
const chatbotParams = new URLSearchParams();
chatbotParams.append("position", chatbotPosition);
// if (dataGreeting) {
//   chatbotParams.append("greeting", dataGreeting);
// } else if (greeting) {
//   chatbotParams.append("greeting", greeting);
// }

if (widgetButtonSize) {
  chatbotParams.append("widgetButtonSize", widgetButtonSize);
}

urlObj.search = chatbotParams.toString();

iframeUrl = urlObj.toString();

iframe.setAttribute("src", iframeUrl);

iframe.setAttribute("allow", "fullscreen");
iframe.setAttribute("frameborder", "0");
iframe.setAttribute("scrolling", "no");
iframe.style.width = "100%";
iframe.style.height = "100%";
iframe.style.background = "transparent";
const chatbotIframeId = "chatbot-" + chatbotId;
iframe.id = chatbotIframeId;

function removeChatbotIframe() {
  const iframeToRemove = document.getElementById(chatbotIframeId);
  if (iframeToRemove) {
    iframeToRemove.parentNode.removeChild(iframeToRemove);
  }
}

function addChatbotIframe() {
  if (!document.getElementById(chatbotIframeId))
    chatbotWrapper?.appendChild(iframe);
}

function shouldAppendIframe(href) {
  if (!href) href = window.location.href;
  fetch(`${chatbotServerAddress}chatbot/find-chatbot-by-id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: chatbotId }),
  })
    .then((response) => response.json())
    .then((result) => {
      removeChatbotIframe();
      addChatbotIframe();
      // result.matchUrl.contains.forEach((url) => {
      //   if (href.includes(url)) {
      //     addChatbotIframe();
      //   }
      // });
      // result.matchUrl.not_contains.forEach((url) => {
      //   if (!href.includes(url)) {
      //     addChatbotIframe();
      //   }
      // });
      // result.matchUrl.exact.forEach((url) => {
      //   if (href === url) {
      //     addChatbotIframe();
      //   }
      // });
    });
}
// addChatbotIframe();
shouldAppendIframe();

(function (history) {
  var pushState = history.pushState;
  var replaceState = history.replaceState;
  history.pushState = function (state, title, url) {
    if (typeof history.onpushstate == "function") {
      history.onpushstate({ state: state, title: title, url: url });
    }
    // Call the original method with the original context and arguments
    return pushState.apply(history, arguments);
  };
  history.replaceState = function (state, title, url) {
    if (typeof history.onreplacestate == "function") {
      history.onreplacestate({ state: state, title: title, url: url });
    }
    // Call the original method with the original context and arguments
    return replaceState.apply(history, arguments);
  };
})(window.history);

// Now you can add event listeners for your new onpushstate and onreplacestate events
window.history.onpushstate = function (event) {
  const url = event.url ? window.location.origin + event.url : undefined;
  // alert(url);
  shouldAppendIframe(url);
};
window.history.onreplacestate = function (event) {
  const url = event.url ? window.location.origin + event.url : undefined;
  // alert(url);
  shouldAppendIframe(url);
};
