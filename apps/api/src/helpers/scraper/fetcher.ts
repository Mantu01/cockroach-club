import axios from "axios";
import randomUseragent from "random-useragent";

export async function fetchHTML(
  url: string
) {
  const userAgent =
    randomUseragent.getRandom() ||
    "Mozilla/5.0";

  const response = await axios.get(url, {
    timeout: 30000,

    headers: {
      "User-Agent": userAgent,

      Accept:
        "text/html,application/xhtml+xml,application/xml",

      "Accept-Language":
        "en-US,en;q=0.9",

      Connection: "keep-alive",

      Referer: "https://google.com",
    },
  });

  return response.data;
}