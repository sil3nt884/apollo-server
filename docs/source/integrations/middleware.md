---
title: Integrating with Node.js middleware
sidebar_title: Node.js middleware
description: Use Apollo Server with Express, Koa, and more
---

FIXME the way we document the packages needs some work in general. first of all the idea that there are multiple packages at all isn't really introduced early in the docs. secondly, it's not always applyMiddleware, there's createHandler too. we should actually document all the middlewares!!! or give up and explicitly only care about the READMEs. Not an AS3 regression though. Also we shouldn't refer to `apollo-server` as the "core" package since it's not `apollo-server-core`. I like "batteries-included".
Another alternative is that we should endeavour to document Express explicitly and basically say "for the others, figure it out yourself" (or README only)

Apollo Server integrates easily with several popular Node.js middleware libraries.
To integrate, first install the appropriate package from the table below _instead of_
the core `apollo-server` package:

| Middleware  | Package  |
|---|---|
| Express  | `apollo-server-express`  |
| AWS Lambda | `apollo-server-lambda` |
| Koa | `apollo-server-koa` |
| hapi  | `apollo-server-hapi`  |
| Micro | `apollo-server-micro` |
| Fastify  | `apollo-server-fastify`  |
| Google Cloud Functions | `apollo-server-cloud-functions` |
| Azure Functions | `apollo-server-azure-functions` |
| Cloudflare | `apollo-server-cloudflare` |


If you've already installed the core `apollo-server` package, you can `npm uninstall`
it after installing an integration package.

## Applying middleware

When integrating with middleware, first you initialize Apollo Server just like you
always do, and then you call `applyMiddleware`.

Here's a basic Express example that serves `Hello!` from every path _except_ `/graphql`, which serves a GraphQL endpoint with Apollo Server:

```js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  server.applyMiddleware({ app });

  app.use((req, res) => {
    res.status(200);
    res.send('Hello!');
    res.end();
  });

  await new Promise(resolve => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}
```

The parameter you provide to `applyMiddleware` is your middleware's top-level representation of your application. In Express applications, this variable is commonly named `app`.

When you pass your app to `applyMiddleware`, Apollo Server automatically configures various middleware (including body parsing, an HTML landing page, and CORS support), so you don't need to apply them with a mechanism like `app.use`.

> **Note:** When integrating with hapi, call `applyMiddleware` with `await`.
