/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "my-ts-app",
      region: "ap-south-1",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("MyBucket", {
      access: "public"
    });
    
    const api = new sst.aws.ApiGatewayV2("MyApi");
    api.route("GET /", {
      link: [bucket],
      handler: "index.upload"
    });
    api.route("GET /latest", {
      link: [bucket],
      handler: "index.latest"
    }); 
  },
});
