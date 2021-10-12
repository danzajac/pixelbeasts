import * as https from "https";
import * as url from "url";

export const request = (_url: string, _options: any, postData?: any):
    Promise<any> => {
  const parsedURL = url.parse(_url);
  const options = Object.assign(
      {
        hostname: parsedURL.host,
        port: 443,
        path: parsedURL.path,
        method: "GET",
      },
      _options
  );
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve(JSON.parse(body));
      });
    });
    req.on("error", (e) => {
      console.error(e);
      reject(e);
    });
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};
