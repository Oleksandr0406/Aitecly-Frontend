export const hide_api_key = (key, numberOfLetter = 6) => {
  return (
    key.slice(0, numberOfLetter) +
    "*".repeat(key.length - numberOfLetter * 2) +
    key.slice(-numberOfLetter)
  );
};

export const linkify = (text) => {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  if (text)
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_">' + url + "</a>";
    });
  else return text;
};
